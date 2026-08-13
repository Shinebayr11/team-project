import { Context } from "hono"
import { Show_product } from "../models/Show_product.js"

export const getshowproduct = async (c: Context) => {
    try {
        const data = await Show_product.find()
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
export const postshowproduct = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { live_show_id, product_id, display_order } = body
        if (!live_show_id || !product_id) {
            return c.json({
                message: "shaardlagtai medeelel dutuu bn"
            }, 400)
        }
        const data = await Show_product.create({
            live_show_id, product_id, display_order
        })
        return c.json({
            message: "Amjilttai hadgallaa", data
        }, 201)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }
}