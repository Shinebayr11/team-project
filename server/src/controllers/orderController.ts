import { Context } from "hono";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Wallet } from "../models/Wallet.js";
import { CoinTransaction } from "../models/Cointransaction.js";

export const getOrder = async (c: Context) => {
    try {
        const data = await Order.find()
        return c.json({
            message: "Amjilttai avlaa",
            data
        }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }
}

/**
 * Шууд худалдан авалт ("Худалдаж авах" / сагс). Дуудлага худалдааны
 * `postbids`-тэй адил зарчим: худалдан авагчийг токеноос авна, үнийг
 * серверээс тооцно — клиентийн buyer_id/үнэд итгэхгүй.
 */
export const postOrder = async (c: Context) => {
    const buyerId = c.get("userId")
    let stockReserved = false
    let quantity = 0
    let product_id: string | undefined
    try {
        const body = await c.req.json()
        const parsedQuantity = Number(body.quantity)
        product_id = body.product_id
        const { video_id, live_show_id } = body

        if (!product_id || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            return c.json({ message: "shaardlagtai medeelel dutuu bn" }, 400)
        }
        quantity = parsedQuantity

        const product = await Product.findById(product_id)
        if (!product) {
            return c.json({ message: "Бараа олдсонгүй" }, 404)
        }
        if (String(product.seller_id) === String(buyerId)) {
            return c.json({ message: "Өөрийн бараагаа худалдаж авах боломжгүй" }, 403)
        }

        // Нөөцийг атомаар хасна — хоёр хүн зэрэг сүүлчийн ширхэгийг авахыг
        // оролдвол зөвхөн нэг нь л амжилттай болно.
        const reserved = await Product.findOneAndUpdate(
            { _id: product_id, stock_quantity: { $gte: quantity } },
            { $inc: { stock_quantity: -quantity } },
        )
        if (!reserved) {
            return c.json({ message: "Нөөц хүрэлцэхгүй байна" }, 409)
        }
        stockReserved = true

        const total = (product.price_coins ?? 0) * quantity

        // Худалдан авагчийн үлдэгдлийг атомаар хасна. Зарцуулж болох дүн
        // хүрэлцэхгүй бол `wallet` нь `null` буцна.
        const buyerWallet = await Wallet.findOneAndUpdate(
            { user_id: buyerId, coin_balance: { $gte: total } },
            { $inc: { coin_balance: -total } },
            { new: true },
        )
        if (!buyerWallet) {
            await Product.updateOne(
                { _id: product_id },
                { $inc: { stock_quantity: quantity } },
            )
            stockReserved = false
            return c.json({ message: "Үлдэгдэл хүрэлцэхгүй байна" }, 402)
        }

        const data = await Order.create({
            buyer_id: buyerId,
            product_id,
            video_id,
            live_show_id,
            quantity,
            price_coins: total,
            status: "PAID",
        })

        await CoinTransaction.create({
            wallet_id: buyerWallet._id,
            type: "order_purchase",
            amount: -total,
            related_order_id: data._id,
        })

        // Худалдагчийн орлого. Хэтэвчгүй бол үүсгэнэ.
        const sellerWallet = await Wallet.findOneAndUpdate(
            { user_id: product.seller_id },
            { $inc: { coin_balance: total } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        )
        await CoinTransaction.create({
            wallet_id: sellerWallet._id,
            type: "order_sale",
            amount: total,
            related_order_id: data._id,
        })

        if ((reserved.stock_quantity ?? 0) - quantity <= 0) {
            await Product.updateOne({ _id: product_id }, { status: "OUT_OF_STOCK" })
        }

        return c.json({
            message: "Amjilttai hadgallaa",
            data
        }, 201)
    } catch (error) {
        console.log(error)
        if (stockReserved && product_id) {
            await Product.updateOne(
                { _id: product_id },
                { $inc: { stock_quantity: quantity } },
            ).catch(() => {})
        }
        return c.json({

            message: "Aldaa garlaa"
        }, 500)
    }
}

/** Нэвтэрсэн хэрэглэгчийн шууд худалдан авалтууд — Profile "Худалдан авалт". */
export const getMyOrders = async (c: Context) => {
    try {
        const userId = c.get("userId")

        const data = await Order.find({ buyer_id: userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("product_id", "name description price_coins images")

        return c.json({ data }, 200)
    } catch (error) {
        console.error("getMyOrders алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * GET /api/order/seller
 *
 * Нэвтэрсэн худалдагчийн барааг шууд худалдаж авсан захиалгууд.
 * `productlistingsController.getMySales`-тэй ижил зарчим — эндхийн эсрэг тал.
 */
export const getMySellerOrders = async (c: Context) => {
    try {
        const userId = c.get("userId")

        const myProducts = await Product.find({ seller_id: userId }).select("_id")
        const productIds = myProducts.map((product) => product._id)

        if (productIds.length === 0) {
            return c.json({ data: [] }, 200)
        }

        const data = await Order.find({ product_id: { $in: productIds } })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("product_id", "name description price_coins images")
            .populate("buyer_id", "display_name shop_name avatar_url")

        return c.json({ data }, 200)
    } catch (error) {
        console.error("getMySellerOrders алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}
