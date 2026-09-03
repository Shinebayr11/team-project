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
export const getCurrentUser = async (c: Context) => {
    try {
        return c.json({ data: c.get("user") })
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

export const followUser = async (c: Context) => {
    try {
        const followerId = c.get("userId") as string
        const { sellerId } = await c.req.json()

        if (!followerId || !sellerId) {
            return c.json({ error: "followerId and sellerId required" }, 400)
        }

        if (followerId === sellerId) {
            return c.json({ error: "Cannot follow yourself" }, 400)
        }

        // Add seller to follower's following list
        await User.findByIdAndUpdate(
            followerId,
            { $addToSet: { following: sellerId } },
            { new: true }
        )

        // Add follower to seller's followers list
        await User.findByIdAndUpdate(
            sellerId,
            { $addToSet: { followers: followerId } },
            { new: true }
        )

        return c.json({
            success: true,
            message: "Successfully followed seller"
        })
    } catch (error: any) {
        console.error("FollowUser error:", error)
        return c.json({ error: "Failed to follow", details: error.message }, 500)
    }
}

export const unfollowUser = async (c: Context) => {
    try {
        const followerId = c.get("userId") as string
        const { sellerId } = await c.req.json()

        if (!followerId || !sellerId) {
            return c.json({ error: "followerId and sellerId required" }, 400)
        }

        // Remove seller from follower's following list
        await User.findByIdAndUpdate(
            followerId,
            { $pull: { following: sellerId } },
            { new: true }
        )

        // Remove follower from seller's followers list
        await User.findByIdAndUpdate(
            sellerId,
            { $pull: { followers: followerId } },
            { new: true }
        )

        return c.json({
            success: true,
            message: "Successfully unfollowed seller"
        })
    } catch (error: any) {
        console.error("UnfollowUser error:", error)
        return c.json({ error: "Failed to unfollow", details: error.message }, 500)
    }
}
