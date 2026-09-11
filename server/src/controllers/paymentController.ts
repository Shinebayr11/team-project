import { Context } from "hono";
import { randomUUID } from "node:crypto";
import { Payment } from "../models/Payment.js";
import { Wallet } from "../models/Wallet.js";
import { CoinTransaction } from "../models/Cointransaction.js";
import { isValidSignature, wireFetch } from "../lib/wire.js";

/**
 * Цэнэглэх багцууд. Үнийг СЕРВЕР тооцно — клиентээс ирсэн дүнд итгэвэл
 * хүссэн хүн ₮1 төлөөд ₮100,000 авах боломжтой болно. `Wallet.tsx` дээрх
 * жагсаалттай ижил байх ёстой.
 */
const PACKS = [
    { amount: 5000, bonus: 0 },
    { amount: 15000, bonus: 1000 },
    { amount: 50000, bonus: 5000 },
    { amount: 100000, bonus: 15000 },
]

/** Wire дээр хараахан төлөгдөөгүй гэсэн үг — нэхэмжлэхийг дахин ашиглаж болно. */
const PENDING_STATUSES = ["new", "pending", "processing", "requires_action"]
/** Эргэж сэргэхгүй төгсгөлүүд. */
const TERMINAL_FAILURES = ["canceled", "cancelled", "expired", "failed"]

/**
 * Гүйлгээний утганд орох богино код (жишээ нь WN-7F2K9Q) — дансны хуулга
 * дээрээс аль төлбөр болохыг таних боломж. Ойлгомжгүй тэмдэгтгүй (0/O/1/I).
 */
const makeReference = () => {
    const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
    return "WN-" + Array.from({ length: 6 }, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)]
    ).join("")
}

/**
 * Төлбөр амжилттай болсны ГАНЦ цэг. `pending → succeeded` шилжилтийг атомаар
 * барьж авсан үед л хэтэвч цэнэглэнэ — webhook ба төлөв шалгагч хоёулаа
 * дуудсан ч нэг л удаа нэмэгдэнэ.
 */
async function markPaidAndCredit(paymentIntentId: string) {
    const claimed = await Payment.findOneAndUpdate(
        { payment_intent_id: paymentIntentId, status: { $ne: "succeeded" } },
        { status: "succeeded" },
        { new: true },
    )
    if (!claimed) return

    const wallet = await Wallet.findOneAndUpdate(
        { user_id: claimed.user_id },
        { $inc: { coin_balance: claimed.credit_amount } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    await CoinTransaction.create({
        wallet_id: wallet._id,
        type: "topup",
        amount: claimed.credit_amount,
    })
}

/**
 * POST /api/payment/topup — цэнэглэх нэхэмжлэх үүсгэнэ. Хариу дотор
 * `next_action` (QR, банкны аппын deeplink) ирэх ба хэтэвч нь төлбөр
 * баталгаажсаны ДАРАА (webhook) цэнэглэгдэнэ.
 */
export const createTopUpPayment = async (c: Context) => {
    const userId = c.get("userId")
    const body = await c.req.json().catch(() => ({}))
    const pack = PACKS.find((p) => p.amount === Number(body?.amount))
    if (!pack) {
        return c.json({ message: "Цэнэглэх дүн буруу байна" }, 400)
    }
    const credit_amount = pack.amount + pack.bonus

    try {
        // Сүүлийн 10 минутад үүсгэсэн, хараахан төлөгдөөгүй ижил дүнтэй
        // нэхэмжлэх байвал түүнийг нь буцаана — цонхыг хаагаад дахин нээх
        // бүрд шинэ нэхэмжлэх овоолохгүй.
        const existing = await Payment.findOne({
            user_id: userId,
            status: "pending",
            amount: pack.amount,
            createdAt: { $gt: new Date(Date.now() - 10 * 60_000) },
        }).sort({ createdAt: -1 })

        if (existing) {
            const intent = await wireFetch(`/v1/payment_intents/${existing.payment_intent_id}`)
            if (PENDING_STATUSES.includes(intent.status)) {
                return c.json({
                    message: "Amjilttai",
                    data: { payment_intent: intent, credit_amount: existing.credit_amount },
                }, 200)
            }
        }

        const reference = makeReference()
        const intent = await wireFetch("/v1/payment_intents", {
            method: "POST",
            headers: { "Idempotency-Key": randomUUID() },
            body: JSON.stringify({
                amount: pack.amount,
                currency: "MNT",
                automatic_operator: true,
                allowed_operators: [],
                description: `WHYNOT ${pack.amount} ${reference}`,
                // metadata нь string→string байх ёстой — тоо явуулбал Wire
                // хүсэлтийг "not valid JSON" гэж татгалзана.
                metadata: {
                    user_id: String(userId),
                    purpose: "wallet_topup",
                    credit_amount: String(credit_amount),
                    reference,
                },
            }),
        })

        // Confirm хийснээр оператор (QPay) руу илгээгдэж QR үүснэ.
        const confirmed = await wireFetch(`/v1/payment_intents/${intent.id}/confirm`, {
            method: "POST",
            headers: { "Idempotency-Key": randomUUID() },
            body: JSON.stringify({}),
        })

        await Payment.create({
            user_id: userId,
            payment_intent_id: intent.id,
            amount: pack.amount,
            credit_amount,
            currency: intent.currency ?? "MNT",
            reference,
            status: "pending",
        })

        return c.json({
            message: "Amjilttai",
            data: { payment_intent: confirmed, credit_amount },
        }, 201)
    } catch (error) {
        console.error("createTopUpPayment алдаа:", error)
        return c.json({ message: "Төлбөр үүсгэж чадсангүй" }, 502)
    }
}

/**
 * GET /api/payment/:id — цонх үүнийг тогтмол дууддаг. Webhook ирэхээс өмнө
 * төлбөр төлөгдчихсөн байж болох тул энд ч цэнэглэлтийг хийнэ (аль нь
 * түрүүлнэ тэр нь — давхар цэнэглэхгүй).
 */
export const getPaymentStatus = async (c: Context) => {
    const userId = c.get("userId")
    const id = c.req.param("id")
    if (!id) return c.json({ message: "id шаардлагатай" }, 400)

    const row = await Payment.findOne({ payment_intent_id: id, user_id: userId })
    if (!row) {
        return c.json({ message: "Төлбөр олдсонгүй" }, 404)
    }
    if (row.status === "succeeded") {
        return c.json({ message: "Amjilttai", data: { status: "succeeded" } }, 200)
    }

    try {
        const intent = await wireFetch(`/v1/payment_intents/${id}`)

        if (intent.status === "succeeded") {
            await markPaidAndCredit(id)
            return c.json({ message: "Amjilttai", data: { status: "succeeded" } }, 200)
        }
        if (TERMINAL_FAILURES.includes(intent.status)) {
            await Payment.updateOne({ payment_intent_id: id }, { status: intent.status })
        }

        return c.json({
            message: "Amjilttai",
            data: { status: intent.status, next_action: intent.next_action ?? null },
        }, 200)
    } catch (error) {
        console.error("getPaymentStatus алдаа:", error)
        return c.json({ message: "Төлбөрийн төлөв шалгаж чадсангүй" }, 502)
    }
}

/**
 * POST /api/payment/webhook — Wire-ээс ирэх мэдэгдэл. НЭВТРЭЛТГҮЙ зам тул
 * гарын үсгийг шалгахгүйгээр ЮУ Ч хийхгүй: эс бөгөөс хэн ч "төлөгдлөө" гэж
 * илгээгээд өөрийгөө цэнэглэчих боломжтой болно.
 */
export const wireWebhook = async (c: Context) => {
    const body = await c.req.text()
    const secret = process.env.WIRE_WEBHOOK_SECRET
    // Endpoint бүртгэх үеийн шалгах хүсэлт нь нууц үг үүсэхээс өмнө ирдэг —
    // 2xx буцаана, гэхдээ баталгаажаагүй мэдээллээр ажиллахгүй.
    if (!secret) return c.json({ received: true }, 200)

    const signature = c.req.header("WirePayment-Signature") ?? ""
    if (!isValidSignature(secret, signature, body)) {
        return c.json({ message: "Гарын үсэг буруу" }, 401)
    }

    let event: { type?: string; data?: unknown }
    try {
        event = JSON.parse(body)
    } catch {
        return c.json({ message: "JSON буруу" }, 400)
    }

    if (event.type === "payment_intent.succeeded") {
        const data = event.data as { object?: Record<string, unknown> } | undefined
        const intent = (data?.object ?? event.data) as Record<string, unknown>
        if (typeof intent?.id === "string") await markPaidAndCredit(intent.id)
    }

    return c.json({ received: true }, 200)
}
