import { Context } from "hono";
import { Order } from "../models/Order.js";

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
export const postOrder = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { buyer_id, product_id, video_id, live_show_id, quantity, price_coins, status } = body
        if (!buyer_id || !product_id || quantity === undefined || price_coins === undefined) {
            return c.json({
                message: "shaardlagtai medeelel dutuu bn"
            }, 400)
        }
        const data = await Order.create({
            buyer_id, product_id, video_id, live_show_id, quantity, price_coins, status
        })
        return c.json({
            message: "Amjilttai hadgallaa",
            data
        }, 201)
    } catch (error) {
        console.log(error)
        return c.json({

            message: "Aldaa garlaa"
        }, 500)
    }
}