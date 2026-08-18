import { Context } from "hono";
import { User } from "../models/User.js";

export const getUsers = async (c: Context) => {
    try {
        const limit = Number(c.req.query("limit")) || 20;
        const page = Number(c.req.query("page")) || 1;
        const skip = (page - 1) * limit;

        const users = await User.find().limit(limit).skip(skip);
        return c.json({ users });
    } catch (error) {
        console.error("getUsers error:", error);
        return c.json({ message: "aldaa garlaa" }, 500);
    }
};

export const postUsers = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { display_name, avatar_url, shop_name } = body;

        // 1. Validation-ыг DB-д хүрэхээс ӨМНӨ шалгана (B3)
        if (!display_name) {
            return c.json({ message: "Shaardlagtai medeelel dutuu bn" }, 400);
        }

        // 2. Auth middleware-ээс баталгаажсан Clerk ID-г авна (A1/A2)
        const clerkUserId = c.get("clerkUserId");

        // 3. User үүсгэнэ (role-ийг "user" гэж албадаж өгнө)
        const newUser = await User.create({
            clerk_user_id: clerkUserId,
            role: "user", // ← client-ээс авахгүй
            display_name,
            avatar_url,
            shop_name,
        });

        return c.json(
            {
                message: "amjilttai hadgalagdlaa",
                newUser,
            },
            201
        );
    } catch (error) {
        console.error("postUsers error:", error);
        return c.json({ message: "aldaa garlaa" }, 500);
    }
};



// import { Context } from "hono"
// import { User } from "../models/User.js"

// export const getseller = async (c: Context) => {
//     try {

//         const data = await User.find({ role: "seller" }).select("clerk_user_id display_name avatar_url shop_name")
//         return c.json({
//             message: "Amjilttai avlaa",
//             data
//         }, 200)
//     } catch (error) {
//         return c.json({
//             message: "Aldaa garlaa"
//         }, 500)
//     }

// }
// export const postseller = async (c: Context) => {
//     try {
//         const body = await c.req.json()
//         const { clerk_user_id, shop_name } = body
//         if (!clerk_user_id || !shop_name) {
//             return c.json({
//                 message: "shaardlagtai medeelel dutuu bn"
//             }, 400)
//         }
//         const data = await User.findOneAndUpdate({
//             clerk_user_id
//         }, {
//             shop_name, role: "seller"

//         }, { new: true })

//         if (!data) {
//             return c.json({
//                 message: "Hereglech olsongvi"
//             }, 404)

//         }
//         return c.json({
//             message: "Hudaldagch amjilttai hadgalsan",
//             data
//         }, 200)

//     } catch (error) {
//         console.log("postseller aldaa", error)
//         return c.json({ message: "serveriin aldaa" }, 500)
//     }

// }
