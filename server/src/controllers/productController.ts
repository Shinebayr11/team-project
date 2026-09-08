import { Context } from "hono"
import { Product } from "../models/Product.js"
import { ProductListing } from "../models/ProductListing.js"

export const getProduct = async (c: Context) => {
    try {
        const sellerId = c.req.query("seller_id")
        const products = await Product.find(sellerId ? { seller_id: sellerId } : {})
            .sort({ createdAt: -1 })
        return c.json({ products })
    } catch (error) {
        return c.json({
            message: "aldaa garlaa"
        }, 500)
    }

}

/** Нэвтэрсэн худалдагчийн өөрийн бараанууд — аукционд гаргах сонголтод хэрэгтэй. */
export const getMyProducts = async (c: Context) => {
    try {
        const sellerId = c.get("userId")
        const products = await Product.find({ seller_id: sellerId }).sort({ createdAt: -1 })
        return c.json({ products })
    } catch (error) {
        console.error("getMyProducts алдаа:", error)
        return c.json({ message: "aldaa garlaa" }, 500)
    }
}

export const postProduct = async (c: Context) => {
    try {
        // Эзэмшигчийг токеноос авна — хүсэлтийн биеэс авбал өөр хүний нэрээр
        // бараа үүсгэх боломжтой болно.
        const seller_id = c.get("userId")
        const body = await c.req.json()
        const {
            name, description, price_coins, stock_quantity, images, category_id,
            sku, category, condition, listing_type, status,
        } = body

        // Шалгалтыг үүсгэхээс өмнө хийнэ — өмнө нь эхлээд үүсгээд дараа нь
        // шалгадаг байсан тул дутуу бараа ч DB-д үлддэг байв.
        if (!name || price_coins === undefined || stock_quantity === undefined) {
            return c.json(
                {
                    message: "Shaardlagtai medeelel dutuu bn",
                },
                400
            );
        }

        const product = await Product.create({
            seller_id, name, description, price_coins, stock_quantity, images, category_id,
            sku, category, condition, listing_type, status,
        })

        return c.json({
            message: "amjilttai hadgallaa",
            product
        }, 201)
    } catch (error) {
        console.error("postProduct алдаа:", error)
        return c.json({
            message: "aldaa garlaa"
        }, 500)
    }
}

/**
 * Зөвхөн эздийн засаж болох талбарууд — `seller_id`-г гаднаас солиулахгүй.
 *
 * `reserved_quantity`, `sold_quantity` хоёр энд БАЙХГҮЙ: тэдгээрийг зөвхөн
 * систем (захиалга, дуудлага худалдааны дүн) бичих ёстой. Өмнө нь худалдагч
 * өөрийн борлуулалтын тоог дураараа тавьж, "эрэлттэй бараа" зэрэг бодит
 * тоонд түшсэн газруудыг гажуудуулж чадах байв.
 */
const EDITABLE_FIELDS = [
    "name", "description", "price_coins", "stock_quantity", "images",
    "sku", "category", "condition", "listing_type", "status",
] as const

/**
 * PATCH /api/product/:id
 *
 * Seller Hub-ын бараа засах, нөөц тохируулах, төлөв солих бүгд энд ирнэ.
 */
export const patchProduct = async (c: Context) => {
    try {
        const sellerId = c.get("userId")
        const body = await c.req.json().catch(() => null)

        if (!body || typeof body !== "object") {
            return c.json({ message: "Хүсэлтийн бие буруу байна" }, 400)
        }

        const updates: Record<string, unknown> = {}
        for (const field of EDITABLE_FIELDS) {
            if (body[field] !== undefined) updates[field] = body[field]
        }

        if (Object.keys(updates).length === 0) {
            return c.json({ message: "Шинэчлэх мэдээлэл алга байна" }, 400)
        }

        // Эзэмшигчийг нөхцөлдөө оруулна — өөр хүний бараа засагдахгүй.
        const product = await Product.findOneAndUpdate(
            { _id: c.req.param("id"), seller_id: sellerId },
            { $set: updates },
            { new: true, runValidators: true }
        )

        if (!product) {
            return c.json({ message: "Бараа олдсонгүй" }, 404)
        }

        return c.json({ message: "Бараа шинэчлэгдлээ", product }, 200)
    } catch (error) {
        console.error("patchProduct алдаа:", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}

/** DELETE /api/product/:id */
export const deleteProduct = async (c: Context) => {
    try {
        const sellerId = c.get("userId")
        const product = await Product.findOneAndDelete({
            _id: c.req.param("id"),
            seller_id: sellerId,
        })

        if (!product) {
            return c.json({ message: "Бараа олдсонгүй" }, 404)
        }

        return c.json({ message: "Бараа устлаа" }, 200)
    } catch (error) {
        console.error("deleteProduct алдаа:", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}

/**
 * GET /api/product/trending?limit=8
 *
 * Эрэлттэй бараа — дуудлага худалдаагаар ХЭДЭН УДАА зарагдсанаар нь эрэмбэлнэ.
 * Хиймэл "trending" биш, бодит борлуулалтын тоо.
 */
export const getTrendingProducts = async (c: Context) => {
    try {
        const limit = Math.min(Math.max(Number(c.req.query("limit")) || 8, 1), 24)

        const rows = await ProductListing.aggregate([
            { $match: { status: "sold", product_id: { $ne: null } } },
            { $group: { _id: "$product_id", soldCount: { $sum: 1 } } },
            { $sort: { soldCount: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "users",
                    localField: "product.seller_id",
                    foreignField: "_id",
                    as: "seller",
                },
            },
            {
                $project: {
                    _id: "$product._id",
                    name: "$product.name",
                    price_coins: "$product.price_coins",
                    images: "$product.images",
                    soldCount: 1,
                    seller: {
                        $let: {
                            vars: { s: { $arrayElemAt: ["$seller", 0] } },
                            in: {
                                _id: "$$s._id",
                                display_name: "$$s.display_name",
                                shop_name: "$$s.shop_name",
                            },
                        },
                    },
                },
            },
        ])

        return c.json({ products: rows }, 200)
    } catch (error) {
        console.error("getTrendingProducts алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}
