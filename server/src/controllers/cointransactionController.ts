import { Context } from "hono"
import { CoinTransaction } from "../models/Cointransaction.js"

export const getCointransaction = async (c: Context) => {
    const data = await CoinTransaction.find()
    return c.json({
        message: "Amjilttai avlaa",
        data
    }, 200)
}
export const postCointransaction = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { wallet_id, type, amount, related_order_id } = body
        if (!wallet_id || !type || amount === undefined) {
            return c.json({
                message: "wallet_id,type,amount shaardlagtai"
            })
        }
        const data = await CoinTransaction.create({
            wallet_id, type, amount, related_order_id
        })
        return c.json({
            message: "Amjilttai hadgallaa",
            data
        }, 201)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        })
    }
}