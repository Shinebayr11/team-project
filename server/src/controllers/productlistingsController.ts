import { Context } from "hono"
import { ProductListing } from "../models/ProductListing.js"
export const getProductlisting = async (c: Context) => {
    try {
        const data = await ProductListing.find()
        return c.json({
            message: "Amilttai awlaa",
            data
        }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }
}
export const postProductlisting = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { product_id, live_show_id, sale_type, starting_price_coins, current_highest_bid_coins, current_winner_id, timer_ends_at, status } = body
        if (!product_id || !sale_type || !live_show_id || starting_price_coins === undefined) {
            return c.json({
                message: "shaardlagtai medeelel dutuu bn"
            }, 400)
        }
        const data = await ProductListing.create({
            product_id, live_show_id, sale_type, starting_price_coins, current_highest_bid_coins, current_winner_id, timer_ends_at, status
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
