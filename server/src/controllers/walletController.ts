import { Context } from "hono"
import { Wallet } from "../models/Wallet.js"

export const getWallet = async (c: Context) => {
    try {
        const data = await Wallet.find()
        return c.json({
            message: "Amjilttai avlaa",
            data
        }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa "
        }, 500)
    }

}
export const postWallet = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { user_id, coin_balance } = body
        if (!user_id || coin_balance === undefined) {
            return c.json({
                message: "user_id,bolon coin_balance shaardlagtai"
            }, 400)
        }
        const data = await Wallet.create({
            user_id, coin_balance
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

