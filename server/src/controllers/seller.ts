import { Context } from "hono"
import { User } from "../models/User.js"

export const getseller = async (c: Context) => {
    try {

        const data = await User.find({ role: "seller" }).select("clerk_user_id display_name avatar_url shop_name")
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
export const postseller = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { clerk_user_id, shop_name } = body
        if (!clerk_user_id || !shop_name) {
            return c.json({
                message: "shaardlagtai medeelel dutuu bn"
            }, 400)
        }
        const data = await User.findOneAndUpdate({
            clerk_user_id
        }, {
            shop_name, role: "seller"

        }, { new: true })

        if (!data) {
            return c.json({
                message: "Hereglech olsongvi"
            }, 404)

        }
        return c.json({
            message: "Hudaldagch amjilttai hadgalsan",
            data
        }, 200)

    } catch (error) {
        console.log("postseller aldaa", error)
        return c.json({ message: "serveriin aldaa" }, 500)
    }

}
