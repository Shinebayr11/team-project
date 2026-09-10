import { Context } from "hono"
import { CoinTransaction } from "../models/Cointransaction.js"
import { Wallet } from "../models/Wallet.js"

/**
 * GET /api/cointransaction — нэвтэрсэн хэрэглэгчийн ӨӨРИЙН зоосны хөдөлгөөн.
 *
 * Өмнө нь энэ нь нүцгэн `CoinTransaction.find()` байсан бөгөөд нэвтрэлт огт
 * шаарддаггүй байв: хүсэлт явуулсан хэн ч БҮХ хэрэглэгчийн санхүүгийн
 * дэвтрийг — хэн хэдийг, хэзээ, ямар захиалгад зарцуулсныг бүгдийг татна.
 *
 * Хэрэглэгч бүр нэг хэтэвчтэй (`walletController.getWallet` мөн ингэж үздэг)
 * тул түүгээр нь шүүхэд хангалттай.
 */
export const getCointransaction = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const wallet = await Wallet.findOne({ user_id: userId }).select("_id")

        // Хэтэвчгүй хэрэглэгчид гүйлгээ ч байхгүй — хоосон жагсаалт нь зөв хариу.
        const data = wallet
            ? await CoinTransaction.find({ wallet_id: wallet._id }).sort({ createdAt: -1 })
            : []

        return c.json({ message: "Amjilttai avlaa", data }, 200)
    } catch (error) {
        console.error("getCointransaction алдаа:", error)
        return c.json({ message: "Гүйлгээг уншиж чадсангүй" }, 500)
    }
}

/**
 * POST /api/cointransaction — гүйлгээ бүртгэнэ.
 *
 * `wallet_id` нь ХҮСЭЛТИЙН БИЕЭС биш, нэвтэрсэн хэрэглэгчийн хэтэвчнээс ирнэ.
 * Өмнө нь биеэс авдаг бөгөөд нэвтрэлт ч шаарддаггүй байсан тул хэн ч дурын
 * хүний хэтэвч рүү дурын дүнтэй гүйлгээ бичих боломжтой байв.
 */
export const postCointransaction = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const body = await c.req.json()
        const { type, amount, related_order_id } = body

        if (!type || amount === undefined) {
            return c.json({ message: "type, amount shaardlagtai" }, 400)
        }

        const wallet = await Wallet.findOne({ user_id: userId }).select("_id")
        if (!wallet) {
            return c.json({ message: "Хэтэвч олдсонгүй" }, 404)
        }

        const data = await CoinTransaction.create({
            wallet_id: wallet._id,
            type,
            amount,
            related_order_id,
        })

        return c.json({ message: "Amjilttai hadgallaa", data }, 201)
    } catch (error) {
        console.error("postCointransaction алдаа:", error)
        return c.json({ message: "Гүйлгээ бүртгэж чадсангүй" }, 500)
    }
}
