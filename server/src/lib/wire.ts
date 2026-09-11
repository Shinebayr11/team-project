import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Wire — төлбөрийн үйлчилгээ (QPay оператороор дамжина). Stripe-тэй яг ижил
 * загвартай: `payment_intent` үүсгээд `confirm` хийхэд QR болон банкны
 * аппуудын deeplink нь `next_action` дотор буцаж ирнэ.
 *
 * Нууц түлхүүр (`WIRE_SECRET_KEY`) ЗӨВХӨН энд, сервер дээр уншигдана —
 * хөтөч рүү хэзээ ч явахгүй.
 */
export const WIRE_API = process.env.WIRE_API_URL ?? "https://api.wire.mn"

export type WireIntent = {
    id: string
    status: string
    amount?: number
    currency?: string
    description?: string
    next_action?: unknown
}

export async function wireFetch<T = WireIntent>(
    path: string,
    init: RequestInit = {},
): Promise<T> {
    const key = process.env.WIRE_SECRET_KEY
    if (!key) throw new Error("WIRE_SECRET_KEY тохируулаагүй байна")

    const res = await fetch(`${WIRE_API}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            ...(init.headers ?? {}),
        },
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
        // Логт үлдээнэ — аль дуудлага нь татгалзсаныг таахгүйгээр олдог болно.
        console.error(
            `[wire] ${init.method ?? "GET"} ${path} -> ${res.status}: ${JSON.stringify(body)}`,
        )
        throw new Error(
            (body as { error?: { message?: string } })?.error?.message ??
            `Wire API алдаа (${res.status})`,
        )
    }
    return body as T
}

/**
 * Webhook-ийн гарын үсэг. Толгой нь Stripe хэлбэртэй:
 *   WirePayment-Signature: t=<unix-sec>,v1=<`t.body`-ийн hex HMAC-SHA256>
 */
const TOLERANCE_SECONDS = 300

export function isValidSignature(secret: string, header: string, body: string) {
    const parts = new Map(
        header.split(",").map((p) => p.trim().split("=", 2) as [string, string]),
    )
    const t = parts.get("t")
    const v1 = parts.get("v1")
    if (!t || !v1) return false
    // Хуучирсан (дахин тоглуулсан) гарын үсгийг цонхны гадна бол авахгүй.
    if (Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE_SECONDS) return false

    const expected = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")
    if (expected.length !== v1.length) return false
    // Тогтмол хугацаанд харьцуулна — хаана зөрснийг цагаар нь мэдэх боломжгүй.
    return timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
}
