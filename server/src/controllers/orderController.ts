import { Context } from "hono";
import { FULFILLMENT_STATUSES, Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Wallet } from "../models/Wallet.js";
import { CoinTransaction } from "../models/Cointransaction.js";

/**
 * `requireAuth` нь Mongo-гийн хэрэглэгчийг `c.get("user")` дээр тавьдаг. Hono-гийн
 * ерөнхий Context үүнийг `any` гэж үздэг тул энд нарийсгаж уншина.
 */
type OrderAddress = {
    _id: unknown
    fullName: string
    phone: string
    city: string
    district: string
    khoroo?: string
    detail: string
}
type AuthedUser = { addresses?: OrderAddress[] }
const authedUser = (c: Context): AuthedUser => c.get("user") as AuthedUser

/** Нэг удаад буцаах захиалгын дээд тоо. */
const ORDER_PAGE_LIMIT = 500

/**
 * GET /api/order — нэвтэрсэн хэрэглэгчийн ӨӨРИЙН захиалгууд.
 *
 * Өмнө нь энэ нь нүцгэн `Order.find()` бөгөөд нэвтрэлт огт шаарддаггүй байв:
 * хүсэлт явуулсан ХЭН Ч системийн бүх захиалгыг — худалдан авагчийн нэр,
 * хүргэх хаяг, утас, худалдаж авсан зүйлийг нь — татаж чаддаг байсан.
 *
 * Худалдан авагчийн жагсаалт `/mine`, худалдагчийнх `/seller` дээр байгаа тул
 * энэ нь голдуу нийцтэй байдлын үүднээс үлдсэн ерөнхий зам.
 */
export const getOrder = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const myProducts = await Product.find({ seller_id: userId }).select("_id")

        const data = await Order.find({
            $or: [
                { buyer_id: userId },
                { product_id: { $in: myProducts.map((product) => product._id) } },
            ],
        }).sort({ createdAt: -1 })

        return c.json({ message: "Amjilttai avlaa", data }, 200)
    } catch (error) {
        console.error("getOrder алдаа:", error)
        return c.json({ message: "Захиалгыг уншиж чадсангүй" }, 500)
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

        // Хүргэлтийн хаяг сонголтоор ирнэ (жишээ нь сагсны захиалга хараахан
        // хаяг асуудаггүй) — байвал хэрэглэгчийн ХАДГАЛСАН хаягуудаас олж,
        // тухайн үеийн хэвлэмэл хуулбарыг захиалга дээр хадгална.
        const address_id = body.address_id as string | undefined
        let shipping_address: Omit<OrderAddress, "_id"> | undefined
        if (address_id) {
            const address = authedUser(c).addresses?.find(
                (a) => String(a._id) === String(address_id),
            )
            if (!address) {
                return c.json({ message: "Хүргэлтийн хаяг олдсонгүй" }, 400)
            }
            shipping_address = {
                fullName: address.fullName,
                phone: address.phone,
                city: address.city,
                district: address.district,
                khoroo: address.khoroo,
                detail: address.detail,
            }
        }

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
            shipping_address,
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
            // 50 биш: аналитик 90 хоногийн БҮХ захиалгаас орлого, топ бараа,
            // дундаж чекийг бодох тул тасалбал тоо нь дутуу гарна.
            .limit(ORDER_PAGE_LIMIT)
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
            // 50 биш: аналитик 90 хоногийн БҮХ захиалгаас орлого, топ бараа,
            // дундаж чекийг бодох тул тасалбал тоо нь дутуу гарна.
            .limit(ORDER_PAGE_LIMIT)
            .populate("product_id", "name description price_coins images")
            .populate("buyer_id", "display_name shop_name avatar_url")

        return c.json({ data }, 200)
    } catch (error) {
        console.error("getMySellerOrders алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/** Захиалгыг барааны эзэн худалдагч л өөрчлөх эрхтэй. */
const findOwnedOrder = async (id: string, sellerId: unknown) => {
    const order = await Order.findById(id).populate("product_id", "seller_id")
    if (!order) return { order: null, forbidden: false }
    const product = order.product_id as unknown as { seller_id?: unknown } | null
    const forbidden = !product?.seller_id || String(product.seller_id) !== String(sellerId)
    return { order, forbidden }
}

/**
 * PATCH /api/order/:id/status
 *
 * Худалдагч захиалгын хүргэлтийн явцыг ахиулна (Хүлээгдэж буй →
 * Боловсруулж буй → Хүргэхэд бэлэн → Хүргэгдсэн гэх мэт).
 */
export const updateOrderFulfillment = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const id = c.req.param("id")
        const body = await c.req.json()
        const fulfillment_status = body.fulfillment_status as string

        if (!id) {
            return c.json({ message: "Захиалга олдсонгүй" }, 404)
        }
        if (!FULFILLMENT_STATUSES.includes(fulfillment_status as (typeof FULFILLMENT_STATUSES)[number])) {
            return c.json({ message: "Төлөв буруу байна" }, 400)
        }

        const { order, forbidden } = await findOwnedOrder(id, userId)
        if (!order) {
            return c.json({ message: "Захиалга олдсонгүй" }, 404)
        }
        if (forbidden) {
            return c.json({ message: "Энэ захиалгыг өөрчлөх эрхгүй байна" }, 403)
        }

        order.fulfillment_status = fulfillment_status as (typeof FULFILLMENT_STATUSES)[number]
        await order.save()

        return c.json({ message: "Шинэчлэгдлээ", data: order }, 200)
    } catch (error) {
        console.error("updateOrderFulfillment алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * PATCH /api/order/:id/tracking
 *
 * Захиалгыг илгээсэн гэж тэмдэглэнэ — тээвэрлэгч, хүргэлтийн кодыг
 * хадгалж, хүргэлтийн явцыг шууд "SHIPPED" болгоно.
 */
export const updateOrderTracking = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const id = c.req.param("id")
        const body = await c.req.json()
        const { carrier, tracking_number } = body

        if (!id) {
            return c.json({ message: "Захиалга олдсонгүй" }, 404)
        }
        if (!carrier || !tracking_number) {
            return c.json({ message: "Тээвэрлэгч, хүргэлтийн код шаардлагатай" }, 400)
        }

        const { order, forbidden } = await findOwnedOrder(id, userId)
        if (!order) {
            return c.json({ message: "Захиалга олдсонгүй" }, 404)
        }
        if (forbidden) {
            return c.json({ message: "Энэ захиалгыг өөрчлөх эрхгүй байна" }, 403)
        }

        order.carrier = carrier
        order.tracking_number = tracking_number
        order.fulfillment_status = "SHIPPED"
        await order.save()

        return c.json({ message: "Шинэчлэгдлээ", data: order }, 200)
    } catch (error) {
        console.error("updateOrderTracking алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}
