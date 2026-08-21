import { Context } from "hono"
import { Product } from "../models/Product.js"

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
        const { name, description, price_coins, stock_quantity, images, category_id } = body

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
