import { Context } from "hono"
import { Live_Show } from "../models/Live_show.js"


export const getliveshow = async (c: Context) => {
    try {
        const data = await Live_Show.find()
        return c.json({ data })
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        })
    }

}
export const postliveshow = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { seller_id, title, thumbnail_url, agora_channel_name, viewer_count } = body
        if (!seller_id || !title || !agora_channel_name) {
            return c.json({
                message: "shaardlagtai medeelel dutuu bn"
            }, 400)

        }
        const data = await Live_Show.create({
            seller_id, title, thumbnail_url, agora_channel_name, viewer_count
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