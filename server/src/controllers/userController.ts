import { Context } from "hono";
import { z } from "zod";
import { User } from "../models/User.js";
import type { AccountUpdateBody } from "../types/account.js";
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

const preferencesSchema = z.object({
    language: z.enum(["mn", "en"]),
    timezone: z.string().trim().min(1, "Цагийн бүс сонгоно уу"),
})

const notificationsSchema = z.object({
    orderUpdates: z.boolean(),
    showReminders: z.boolean(),
    bidAlerts: z.boolean(),
    messages: z.boolean(),
    promotions: z.boolean(),
})

/** Панель бүр зөвхөн өөрийн хэсгээ явуулдаг тул талбар бүр сонголттой. */
const accountSchema = z
    .object({
        display_name: z
            .string()
            .trim()
            .min(2, "Нэр 2-оос доошгүй тэмдэгт байна")
            .max(40, "Нэр 40-өөс ихгүй тэмдэгт байна"),
        bio: z.string().trim().max(300, "Танилцуулга 300-аас ихгүй тэмдэгт байна"),
        preferences: preferencesSchema,
        notifications: notificationsSchema,
    })
    .partial()
    .refine((body) => Object.keys(body).length > 0, {
        message: "Шинэчлэх мэдээлэл алга байна",
    })

/** zod-ийн алдааг талбар тус бүрийн helper text болгож хөрвүүлнэ. */
const fieldErrors = (error: z.ZodError): Partial<Record<keyof AccountUpdateBody, string>> => {
    const fields: Partial<Record<keyof AccountUpdateBody, string>> = {}
    for (const issue of error.issues) {
        const key = issue.path[0] as keyof AccountUpdateBody | undefined
        if (key && !fields[key]) fields[key] = issue.message
    }
    return fields
}

/**
 * PATCH /api/users/me
 *
 * Бүртгэлийн тохиргоо — нэр, танилцуулга, ерөнхий тохиргоо, мэдэгдэл. Худалдагчийн
 * дэлгүүрийн мэдээлэл энд БИШ, `PATCH /api/seller/profile` дээр засагдана.
 */
export const updateAccount = async (c: Context) => {
    try {
        const userId = c.get("userId")

        const raw = await c.req.json().catch(() => null)
        if (!raw) {
            return c.json({ message: "Хүсэлтийн бие буруу байна" }, 400)
        }

        const parsed = accountSchema.safeParse(raw)
        if (!parsed.success) {
            return c.json(
                { message: "Мэдээлэл дутуу эсвэл буруу байна", fields: fieldErrors(parsed.error) },
                400
            )
        }

        const updated = await User.findByIdAndUpdate(
            userId,
            { $set: parsed.data },
            { new: true, runValidators: true }
        ).select("display_name bio avatar_url preferences notifications")

        if (!updated) {
            return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404)
        }

        return c.json({ message: "Тохиргоо хадгалагдлаа", data: updated }, 200)
    } catch (error) {
        console.error("updateAccount aldaa", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}

/**
 * Нэвтэрсэн хэрэглэгчийн дагаж буй худалдагчид, профайлынх нь хамт.
 *
 * `/api/users/me` нь `following`-ийг зөвхөн ObjectId-гийн массиваар буцаадаг
 * тул түүгээр жагсаалт зурах боломжгүй — энд populate хийж нэр, зураг хамт
 * өгнө.
 */
export const listFollowing = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const user = await User.findById(userId).populate(
            "following",
            "display_name shop_name avatar_url",
        )
        return c.json({ data: user?.following ?? [] }, 200)
    } catch (error) {
        console.error("listFollowing error:", error)
        return c.json({ message: "aldaa garlaa" }, 500)
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

/* ===========================================================================
   Хүргэлтийн хаяг. Хэрэглэгчийн баримт дотор массив болж амьдардаг — хаяг нь
   зөвхөн эзэндээ хамаатай, тоо нь цөөн тул тусдаа цуглуулга шаардлагагүй.
   =========================================================================== */

const MONGOLIAN_PHONE = /^(\+?976[\s-]?)?\d{8}$/

const addressSchema = z.object({
    fullName: z.string().trim().min(2, "Хүлээн авагчийн нэр оруулна уу").max(60),
    phone: z.string().trim().regex(MONGOLIAN_PHONE, "Утасны дугаар 8 оронтой байна"),
    city: z.string().trim().min(2, "Хот / аймгаа оруулна уу").max(60),
    district: z.string().trim().min(2, "Дүүрэг / сумаа оруулна уу").max(60),
    khoroo: z.string().trim().max(60).optional(),
    detail: z
        .string()
        .trim()
        .min(5, "Гудамж, байр, тоотоо бүтнээр нь оруулна уу")
        .max(200),
    isDefault: z.boolean().optional(),
})

/** zod-ийн алдааг талбар тус бүрийн helper text болгоно. */
const addressFieldErrors = (error: z.ZodError) => {
    const fields: Record<string, string> = {}
    for (const issue of error.issues) {
        const key = String(issue.path[0] ?? "")
        if (key && !fields[key]) fields[key] = issue.message
    }
    return fields
}

/**
 * Үндсэн хаяг НЭГ л байна. Шинэ хаягийг үндсэн болгосон, эсвэл огт хаяггүй
 * байсан бол эхнийхийг нь автоматаар үндсэн болгоно.
 */
const normalizeDefaults = (
    addresses: { isDefault?: boolean }[],
    preferredIndex: number
) => {
    if (addresses.length === 0) return
    const index =
        preferredIndex >= 0 && preferredIndex < addresses.length
            ? preferredIndex
            : addresses.findIndex((address) => address.isDefault)
    const chosen = index >= 0 ? index : 0
    addresses.forEach((address, i) => {
        address.isDefault = i === chosen
    })
}

/** GET /api/users/addresses */
export const listAddresses = async (c: Context) => {
    try {
        const user = await User.findById(c.get("userId")).select("addresses")
        return c.json({ data: user?.addresses ?? [] }, 200)
    } catch (error) {
        console.error("listAddresses aldaa", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}

/** POST /api/users/addresses */
export const createAddress = async (c: Context) => {
    try {
        const raw = await c.req.json().catch(() => null)
        const parsed = addressSchema.safeParse(raw)
        if (!parsed.success) {
            return c.json(
                { message: "Мэдээлэл дутуу эсвэл буруу байна", fields: addressFieldErrors(parsed.error) },
                400
            )
        }

        const user = await User.findById(c.get("userId"))
        if (!user) {
            return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404)
        }

        user.addresses.push(parsed.data)
        // Анхны хаяг, эсвэл "үндсэн" гэж тэмдэглэсэн бол түүнийг үндсэн болгоно.
        const last = user.addresses.length - 1
        normalizeDefaults(user.addresses, parsed.data.isDefault ? last : -1)
        await user.save()

        return c.json({ message: "Хаяг нэмэгдлээ", data: user.addresses }, 201)
    } catch (error) {
        console.error("createAddress aldaa", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}

/** PATCH /api/users/addresses/:id */
export const updateAddress = async (c: Context) => {
    try {
        const raw = await c.req.json().catch(() => null)
        const parsed = addressSchema.safeParse(raw)
        if (!parsed.success) {
            return c.json(
                { message: "Мэдээлэл дутуу эсвэл буруу байна", fields: addressFieldErrors(parsed.error) },
                400
            )
        }

        const user = await User.findById(c.get("userId"))
        if (!user) {
            return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404)
        }

        const id = c.req.param("id")
        const index = user.addresses.findIndex((address) => String(address._id) === id)
        if (index === -1) {
            return c.json({ message: "Хаяг олдсонгүй" }, 404)
        }

        user.addresses[index].set(parsed.data)
        normalizeDefaults(user.addresses, parsed.data.isDefault ? index : -1)
        await user.save()

        return c.json({ message: "Хаяг шинэчлэгдлээ", data: user.addresses }, 200)
    } catch (error) {
        console.error("updateAddress aldaa", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}

/** DELETE /api/users/addresses/:id */
export const deleteAddress = async (c: Context) => {
    try {
        const user = await User.findById(c.get("userId"))
        if (!user) {
            return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404)
        }

        const id = c.req.param("id")
        const before = user.addresses.length
        user.addresses = user.addresses.filter(
            (address) => String(address._id) !== id
        ) as typeof user.addresses

        if (user.addresses.length === before) {
            return c.json({ message: "Хаяг олдсонгүй" }, 404)
        }

        // Үндсэн хаягаа устгасан бол үлдсэний эхнийх нь үндсэн болно.
        normalizeDefaults(user.addresses, -1)
        await user.save()

        return c.json({ message: "Хаяг устлаа", data: user.addresses }, 200)
    } catch (error) {
        console.error("deleteAddress aldaa", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}
