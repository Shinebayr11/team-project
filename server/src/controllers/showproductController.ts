import { Context } from "hono"
import { Show_product } from "../models/Show_product.js"
import { Product } from "../models/Product.js"
import { Live_Show } from "../models/Live_show.js"

/**
 * Шоуны барааны жагсаалт. live_show_id өгвөл зөвхөн тухайн шоуных, эс бөгөөс
 * бүгд. Үзэгчид ч уншдаг тул нэвтрэх шаардлагагүй.
 */
export const getshowproduct = async (c: Context) => {
    try {
        const liveShowId = c.req.query("live_show_id")
        const filter = liveShowId ? { live_show_id: liveShowId } : {}

        const data = await Show_product.find(filter)
            .sort({ display_order: 1, createdAt: 1 })
            .populate("product_id", "name description price_coins stock_quantity images")

        return c.json({ message: "Amjilttai avlaa", data }, 200)
    } catch (error) {
        console.error("getshowproduct алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * Шоунд бараа нэмэх. Зөвхөн тухайн шоуны эзэн, зөвхөн өөрийн бараагаар.
 * display_order өгөөгүй бол жагсаалтын араас залгана.
 */
export const postshowproduct = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const body = await c.req.json()
        const { live_show_id, product_id, display_order } = body

        if (!live_show_id || !product_id) {
            return c.json({ message: "shaardlagtai medeelel dutuu bn" }, 400)
        }

        const show = await Live_Show.findById(live_show_id)
        if (!show) {
            return c.json({ message: "Live show olsongvi" }, 404)
        }
        if (String(show.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ шоуг өөрчлөх эрхгүй байна" }, 403)
        }

        const product = await Product.findById(product_id)
        if (!product) {
            return c.json({ message: "Бараа олдсонгүй" }, 404)
        }
        if (String(product.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ бараа таных биш байна" }, 403)
        }

        // Дараалал заагаагүй бол одоо байгаа хамгийн сүүлчийн ард нь тавина.
        let order = Number(display_order)
        if (!Number.isFinite(order)) {
            const last = await Show_product.findOne({ live_show_id })
                .sort({ display_order: -1 })
            order = (last?.display_order ?? -1) + 1
        }

        const data = await Show_product.create({
            live_show_id, product_id, display_order: order
        })

        const populated = await data.populate(
            "product_id",
            "name description price_coins stock_quantity images"
        )
        return c.json({ message: "Amjilttai hadgallaa", data: populated }, 201)
    } catch (error) {
        // Давхардсан индекс — бараа аль хэдийн жагсаалтад байна.
        if ((error as { code?: number }).code === 11000) {
            return c.json({ message: "Энэ бараа жагсаалтад аль хэдийн байна" }, 409)
        }
        console.error("postshowproduct алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/** Шоуны жагсаалтаас бараа хасах — зөвхөн шоуны эзэн. */
export const deleteshowproduct = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const entry = await Show_product.findById(c.req.param("id"))
        if (!entry) {
            return c.json({ message: "Olsongvi" }, 404)
        }

        const show = await Live_Show.findById(entry.live_show_id)
        if (!show || String(show.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ шоуг өөрчлөх эрхгүй байна" }, 403)
        }

        await entry.deleteOne()
        return c.json({ message: "Amjilttai ustgalaa" }, 200)
    } catch (error) {
        console.error("deleteshowproduct алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}
