import { Context } from "hono";
import { User } from "../models/User.js";
export const getUsers = async (c: Context) => {
    try {
        const users = await User.find()
        return c.json({ users })
    } catch (error) {
        return c.json({ message: "aldaa garlaa" }, 500)
    }
}
export const postUsers = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { clerk_user_id, role, display_name, avatar_url, shop_name } = body
        const newUser = await User.create({ clerk_user_id, role, display_name, avatar_url, shop_name })
        return c.json({
            message: "amjilttai hadgalagdlaa",
            newUser
        })
    } catch (error) {
        return c.json({ message: "aldaa garlaa", }, 500)
    }
}
