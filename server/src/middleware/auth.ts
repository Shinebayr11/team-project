import { createClerkClient, verifyToken } from "@clerk/backend"
import { createMiddleware } from "hono/factory"
import { User } from "../models/User.js";

// Зөвхөн Clerk token-ийг баталгаажуулна, Mongo дээр User байхыг шаардахгүй.
// Mongo User-г яг үүсгэж буй endpoint (POST /api/users) дээр ашиглана — requireAuth-ийг
// тэнд ашиглах боломжгүй, учир нь тэр нь эсрэгээрээ User-г эхлээд олдохыг шаарддаг.
export const verifyClerkToken = createMiddleware(async (c, next) => {
    const header = c.req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return c.json({ message: "Нэвтрэх шаардлагатай" }, 401);
    }

    try {
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });

        c.set("clerkUserId", payload.sub);
        await next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return c.json({ message: "Токен буруу эсвэл хугацаа дууссан байна" }, 401);
    }
});

export const requireAuth = createMiddleware(async (c, next) => {
    const header = c.req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return c.json({ message: "Нэвтрэх шаардлагатай" }, 401);
    }

    // Токен шалгах болон хэрэглэгч хайх хоёрыг тусад нь барина: өмнө нь нэг
    // try дотор байсан тул өгөгдлийн сангийн алдаа ч "Токен буруу" гэж
    // харагдаж, шалтгааныг нь буруу зүг рүү хөтөлдөг байв.
    let clerkUserId: string;
    try {
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });
        clerkUserId = payload.sub;
    } catch (error) {
        console.error("Токен шалгахад алдаа:", error);
        return c.json({ message: "Токен буруу эсвэл хугацаа дууссан байна" }, 401);
    }

    c.set("clerkUserId", clerkUserId);

    try {
        const user = await User.findOne({ clerk_user_id: clerkUserId });
        if (!user) {
            return c.json({ message: "Хэрэглэгч бүртгэгдээгүй байна" }, 404);
        }

        c.set("user", user);
        c.set("userId", user._id);
    } catch (error) {
        console.error("Хэрэглэгч уншихад алдаа:", error);
        return c.json({ message: "Өгөгдлийн сантай холбогдож чадсангүй" }, 503);
    }

    await next();
});