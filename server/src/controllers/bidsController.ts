import { Context } from "hono"
import { Bid } from "../models/Bid.js"

export const getbids = async (c: Context) => {
    try {
        const data = await Bid.find()
        return c.json({
            message: "Amjilttai avlaa",
            data
        }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa",

        }, 500)
    }

}
export const postbids = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { listing_id, buyer_id, amount_coins } = body
        if (!listing_id || !buyer_id || amount_coins === undefined) {
            return c.json({
                message: "Bvh talbariig boglonvv"
            }, 400)
        }
        const data = await Bid.create({
            listing_id, buyer_id, amount_coins,
        })
        return c.json({
            message: "Amjilttai hadgallaa",
            data
        }, 201)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }
}