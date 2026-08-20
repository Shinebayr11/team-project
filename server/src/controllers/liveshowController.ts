import { Context } from "hono"
import { Live_Show } from "../models/Live_show.js"

export const getliveshow = async (c: Context) => {
    try {
        // Home feed-д зөвхөн одоо шууд явж буй (status: "live"), эсвэл эхлэх цаг нь
        // тохируулагдсан (started_at) шоунуудыг харуулна — цаг/төлөвгүй бэлэн бус
        // (draft) баримтуудыг нуух.
        const data = await Live_Show.find({
            $or: [{ status: "live" }, { started_at: { $ne: null } }],
        }).populate("seller_id", "display_name avatar_url shop_name")
        return c.json({ data }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"

        }, 500)
    }

}
export const getliveshowById = async (c: Context) => {
    try {
        const id = c.req.param("id")
        const data = await Live_Show.findById(id).populate("seller_id", "display_name avatar_url shop_name")
        if (!data) {
            return c.json({ message: "Live show olsongvi" }, 404)
        }
        return c.json({ data }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }

}
export const patchliveshow = async (c: Context) => {
    try {
        const id = c.req.param("id")
        const userId = c.get("userId")
        const body = await c.req.json()
        const { status, viewer_count, ended_at } = body

        const show = await Live_Show.findById(id)
        if (!show) {
            return c.json({ message: "Live show olsongvi" }, 404)
        }
        if (String(show.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ шоуг өөрчлөх эрхгүй байна" }, 403)
        }

        if (status !== undefined) show.status = status
        if (viewer_count !== undefined) show.viewer_count = viewer_count
        if (ended_at !== undefined) show.ended_at = ended_at

        await show.save()

        return c.json({ message: "Amjilttai shinechlelee", data: show }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }

}
export const postliveshow = async (c: Context) => {
    try {
        const seller_id = c.get("userId")
        const body = await c.req.json()
        const { title, thumbnail_url, livekit_room_name, viewer_count, category, tags, sponsored, status, started_at } = body
        if (!seller_id || !title || !livekit_room_name) {
            return c.json({
                message: "shaardlagtai medeelel dutuu bn"
            }, 400)

        }
        const data = await Live_Show.create({
            seller_id, title, thumbnail_url, livekit_room_name, viewer_count, category, tags, sponsored, status, started_at
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