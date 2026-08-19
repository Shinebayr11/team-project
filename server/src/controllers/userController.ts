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
        const clerk_user_id = c.get("clerkUserId") as string
        const body = await c.req.json()
        const { display_name, avatar_url, shop_name } = body

        if (!display_name) {
            return c.json(
                {
                    message: "Shaardlagtai medeelel dutuu bn"
                },
                400
            );
        }

        const newUser = await User.findOneAndUpdate(
            { clerk_user_id },
            { $set: { display_name, avatar_url, shop_name } },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        )

        return c.json({
            message: "amjilttai hadgalagdlaa",
            newUser
        }, 201)
    } catch (error) {
        return c.json({ message: "aldaa garlaa", }, 500)
    }
}
