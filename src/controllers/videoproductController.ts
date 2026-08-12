import { Context } from "hono"
import { Videoproduct } from "../models/Video_product.js"

export const getVideoproduct = async (c: Context) => {
    try {

        const data = await Videoproduct.find()
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
export const postVideoproduct = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { video_id, product_id, display_order } = body
        if (!video_id || !product_id || !display_order) {
            return c.json({
                message: "shaardlagtai medeelel dutuu bn"
            }, 400)
        }
        const data = await Videoproduct.create({
            video_id, product_id, display_order
        })

        return c.json({
            message: "Amjilttai hadgallaa ",
            data
        }, 201)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }
}
