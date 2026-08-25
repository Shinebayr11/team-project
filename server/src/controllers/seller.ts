import { Context } from "hono"
import { z } from "zod"
import { User } from "../models/User.js"
import { slugify, SLUG_MIN, SLUG_MAX, SLUG_PATTERN } from "../lib/slug.js"
import type {
    SellerActivateBody,
    SellerProfile,
} from "../types/seller.js"

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

/* ===========================================================================
   Худалдагч идэвхжүүлэх.

   Гарын үсэг зурмагц ШУУД идэвхжинэ. Хүн шалгахгүй, хүлээлгэхгүй, дараа нь
   баталгаажуулахгүй. Цорын ганц "шалгуур" нь маягт бүрэн бөглөгдсөн эсэх.
   =========================================================================== */

/** Монгол утасны дугаар: 8 орон, өмнө нь +976 байж болно. */
const PHONE_PATTERN = /^(\+?976[\s-]?)?\d{8}$/

const required = (name: string) => `${name} оруулна уу`

const activateSchema = z.object({
    storeName: z
        .string()
        .trim()
        .min(3, "Дэлгүүрийн нэр 3-аас доошгүй тэмдэгт байна")
        .max(30, "Дэлгүүрийн нэр 30-аас ихгүй тэмдэгт байна"),
    storeSlug: z
        .string()
        .trim()
        .toLowerCase()
        .min(SLUG_MIN, "Хаяг хэт богино байна")
        .max(SLUG_MAX, "Хаяг хэт урт байна")
        .regex(SLUG_PATTERN, "Хаяг зөвхөн жижиг латин үсэг, тоо, зураас агуулна"),
    sellerType: z.enum(["individual", "business"]),
    category: z.string().trim().min(1, required("Үндсэн ангилал")),
    address: z
        .string()
        .trim()
        .min(5, "Оршин суух хаягаа бүтнээр нь оруулна уу")
        .max(200, "Хаяг хэт урт байна"),
    phone: z
        .string()
        .trim()
        .regex(PHONE_PATTERN, "Утасны дугаар 8 оронтой байна"),
    signature: z
        .string()
        .trim()
        .min(2, required("Гарын үсэг"))
        .max(60, "Гарын үсэг хэт урт байна"),
    termsVersion: z.string().trim().min(1, required("Гэрээний хувилбар")),
})

/** zod-ийн алдааг талбар тус бүрийн helper text болгож хөрвүүлнэ. */
const fieldErrors = (error: z.ZodError): Partial<Record<keyof SellerActivateBody, string>> => {
    const fields: Partial<Record<keyof SellerActivateBody, string>> = {}
    for (const issue of error.issues) {
        const key = issue.path[0] as keyof SellerActivateBody | undefined
        if (key && !fields[key]) fields[key] = issue.message
    }
    return fields
}

const isDuplicateKey = (error: unknown): boolean =>
    typeof error === "object" && error !== null && (error as { code?: number }).code === 11000

/**
 * `requireAuth` нь Mongo-гийн хэрэглэгчийг `c.get("user")` дээр тавьдаг. Hono-гийн
 * ерөнхий Context үүнийг `any` гэж үздэг тул энд нарийсгаж уншина.
 */
type AuthedUser = {
    _id: unknown
    sellerProfile?: SellerProfile | null
}

const authedUser = (c: Context): AuthedUser => c.get("user") as AuthedUser

/**
 * POST /api/seller/activate
 *
 * Idempotent: аль хэдийн идэвхтэй бол 200 + одоо байгаа профайлаа буцаана.
 */
export const activateSeller = async (c: Context) => {
    try {
        const user = authedUser(c)

        // Аль хэдийн идэвхтэй — дахин бичихгүйгээр байгаагаа буцаана.
        if (user.sellerProfile?.status === "active") {
            return c.json(
                { message: "Дэлгүүр аль хэдийн идэвхтэй байна", data: user.sellerProfile },
                200
            )
        }

        const raw = await c.req.json().catch(() => null)
        if (!raw) {
            return c.json({ message: "Хүсэлтийн бие буруу байна" }, 400)
        }

        const parsed = activateSchema.safeParse(raw)
        if (!parsed.success) {
            return c.json(
                { message: "Мэдээлэл дутуу эсвэл буруу байна", fields: fieldErrors(parsed.error) },
                400
            )
        }

        const body = parsed.data

        // Хаягийг нэрнээс нь дахин тооцоолж, клиентийн харуулсантай тааруулна.
        // Ингэснээр хэрэглэгчийн харсан урьдчилсан хаяг л хадгалагдана.
        const canonicalSlug = slugify(body.storeName)
        if (canonicalSlug.length < SLUG_MIN) {
            return c.json(
                {
                    message: "Дэлгүүрийн нэрнээс хаяг үүсгэж чадсангүй",
                    field: "storeName",
                    fields: { storeName: "Латин үсэг эсвэл тоо агуулсан нэр оруулна уу" },
                },
                400
            )
        }
        if (canonicalSlug !== body.storeSlug) {
            return c.json(
                {
                    message: "Дэлгүүрийн нэр болон хаяг зөрж байна",
                    field: "storeSlug",
                    fields: { storeSlug: `Энэ нэрэнд тохирох хаяг: ${canonicalSlug}` },
                },
                400
            )
        }

        const now = new Date()
        const sellerProfile = {
            status: "active" as const,
            storeName: body.storeName,
            storeSlug: canonicalSlug,
            sellerType: body.sellerType,
            category: body.category,
            address: body.address,
            phone: body.phone,
            signature: body.signature,
            termsVersion: body.termsVersion,
            agreedAt: now,
            activatedAt: now,
        }

        const updated = await User.findByIdAndUpdate(
            user._id,
            { $set: { sellerProfile, role: "seller", shop_name: body.storeName } },
            { new: true, runValidators: true }
        )

        if (!updated) {
            return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404)
        }

        return c.json(
            { message: "Дэлгүүр идэвхжлээ", data: updated.sellerProfile },
            201
        )
    } catch (error) {
        if (isDuplicateKey(error)) {
            return c.json(
                {
                    message: "Энэ хаяг аль хэдийн эзэмшигдсэн байна",
                    field: "storeSlug",
                    fields: { storeSlug: "Энэ хаяг завгүй байна. Өөр нэр сонгоно уу." },
                },
                409
            )
        }
        console.error("activateSeller aldaa", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}

/** GET /api/seller/slug-available?slug= */
export const slugAvailable = async (c: Context) => {
    try {
        const slug = (c.req.query("slug") ?? "").trim().toLowerCase()

        if (slug.length < SLUG_MIN || slug.length > SLUG_MAX || !SLUG_PATTERN.test(slug)) {
            return c.json({ available: false }, 200)
        }

        const user = authedUser(c)

        // Өөрийнх нь эзэмшдэг хаяг бол "завгүй" гэж хэлэхгүй.
        if (user?.sellerProfile?.storeSlug === slug) {
            return c.json({ available: true }, 200)
        }

        const taken = await User.exists({ "sellerProfile.storeSlug": slug })
        return c.json({ available: !taken }, 200)
    } catch (error) {
        console.error("slugAvailable aldaa", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}

/** GET /api/seller/me — идэвхжээгүй бол data: null. */
export const getMySellerProfile = async (c: Context) => {
    try {
        const profile = authedUser(c).sellerProfile ?? null
        return c.json({ data: profile }, 200)
    } catch (error) {
        console.error("getMySellerProfile aldaa", error)
        return c.json({ message: "Серверийн алдаа гарлаа" }, 500)
    }
}
