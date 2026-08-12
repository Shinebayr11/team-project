import { Context } from "hono";
import { Video } from "../models/video.js";
export const getVideo = async (c: Context) => {
    try {
        const data = await Video.find()
        return c.json({ message: "Amjilttai avlaa", data }, 200)
    } catch (error) {
        return c.json({
            message: "aldaa garlaa",

        }, 500)
    }
}
export const postVideo = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { seller_id, storage_path, thumbnail_url, caption, status } = body
        if (!seller_id || !storage_path) {
            return c.json({ message: "shaardlagtai medeelel dutuu bn" }, 400)
        }
        const data = await Video.create({
            seller_id, storage_path, thumbnail_url, caption, status
        });

        return c.json({ message: "Amjiltti hadgallaa", data }, 201)

    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }
}
