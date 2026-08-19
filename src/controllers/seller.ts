import { Context } from "hono";
import { User } from "../models/User.js";

// Борлуулагчийн мэдээлэл авдаг контроллер
export const getSeller = async (c: Context) => {
    try {
        const user = c.get("user");
        const currentUser = await User.findById(user._id);

        return c.json({ user: currentUser }, 200);
    } catch (error) {
        console.error("getSeller error:", error);
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500);
    }
};

// Борлуулагч болох хүсэлт илгээх контроллер
export const applySeller = async (c: Context) => {
    try {
        const user = c.get("user");
        const { shop_name } = await c.req.json();

        if (!shop_name) {
            return c.json({ message: "Дэлгүүрийн нэр оруулна уу" }, 400);
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                shop_name,
                seller_status: "pending",
            },
            { new: true }
        );

        return c.json(
            { message: "Худалдагч болох хүсэлт илгээгдлээ", user: updatedUser },
            200
        );
    } catch (error) {
        console.error("applySeller error:", error);
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500);
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
