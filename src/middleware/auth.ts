import { createClerkClient, verifyToken } from "@clerk/backend"
import { createMiddleware } from "hono/factory"
import { User } from "../models/User.js";
export const requireAuth = createMiddleware(async (c, next) => {
    const header = c.req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return c.json({ message: "Нэвтрэх шаардлагатай" }, 401);
    }

    try {
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });

        const clerkUserId = payload.sub;
        c.set("clerkUserId", clerkUserId);

        // Mongo-ийн хэрэглэгчийг олох
        const user = await User.findOne({ clerk_user_id: clerkUserId });
        if (!user) {
            return c.json({ message: "Хэрэглэгч бүртгэгдээгүй байна" }, 404);
        }

        c.set("user", user);
        c.set("userId", user._id);

        await next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return c.json({ message: "Токен буруу эсвэл хугацаа дууссан байна" }, 401);
    }
});