import { Context } from "hono"
import { Types } from "mongoose"
import { Conversation } from "../models/Conversation.js"
import { Message } from "../models/Message.js"
import { User } from "../models/User.js"

const PARTICIPANT_FIELDS = "display_name shop_name avatar_url"

/** participants-ыг үргэлж нэг журмаар эрэмбэлнэ — unique индекс үүн дээр тулгуурладаг. */
const orderedPair = (a: Types.ObjectId | string, b: Types.ObjectId | string) =>
    [String(a), String(b)].sort()

/**
 * Хоёр хэрэглэгчийн ярианы мөрийг олох, байхгүй бол үүсгэх.
 *
 * Хоёр хүсэлт зэрэг ирвэл хоёулаа "байхгүй" гэж үзээд давхар үүсгэхийг
 * оролдож болзошгүй тул upsert ашиглана — unique индекс + upsert хослол нь
 * үүнийг атомоор шийднэ.
 */
const findOrCreateConversation = async (
    a: Types.ObjectId | string,
    b: Types.ObjectId | string,
) => {
    const participants = orderedPair(a, b)
    const filter: Record<string, unknown> = { participants }
    return Conversation.findOneAndUpdate(
        filter,
        { $setOnInsert: { participants } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
    )
}

/** Нэвтэрсэн хэрэглэгчийн бүх яриа, хамгийн сүүлийн зурвасаараа эрэмбэлэгдсэн. */
export const listConversations = async (c: Context) => {
    try {
        const userId = c.get("userId")

        const conversations = await Conversation.find({ participants: userId })
            .sort({ last_message_at: -1, updatedAt: -1 })
            .populate("participants", PARTICIPANT_FIELDS)

        // Яриа тус бүрийн уншаагүй тоог нэг асуулгаар авна — яриа бүрд тусад нь
        // тоолвол жагсаалт уртсах тусам асуулга нэмэгдэнэ.
        const unreadRows = await Message.aggregate([
            {
                $match: {
                    conversation_id: { $in: conversations.map((c) => c._id) },
                    sender_id: { $ne: new Types.ObjectId(String(userId)) },
                    read_at: null,
                },
            },
            { $group: { _id: "$conversation_id", count: { $sum: 1 } } },
        ])
        const unreadBy = new Map(unreadRows.map((r) => [String(r._id), r.count]))

        const data = conversations.map((conversation) => {
            const other = (conversation.participants as any[]).find(
                (p) => String(p?._id) !== String(userId),
            )
            return {
                _id: conversation._id,
                other,
                last_message_text: conversation.last_message_text ?? null,
                last_message_at: conversation.last_message_at ?? null,
                unread: unreadBy.get(String(conversation._id)) ?? 0,
            }
        })

        return c.json({ data }, 200)
    } catch (error) {
        console.error("listConversations алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * Тодорхой хэрэглэгчтэй ярианы мөрийг нээх. Мэдэгдэл дээрээс "худалдагчтай
 * чатлах" гэж ороход энэ дуудагдана.
 */
export const openConversation = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const body = await c.req.json()
        const otherId = String(body?.user_id ?? "")

        if (!Types.ObjectId.isValid(otherId)) {
            return c.json({ message: "user_id буруу байна" }, 400)
        }
        if (String(otherId) === String(userId)) {
            return c.json({ message: "Өөртэйгөө чатлах боломжгүй" }, 400)
        }

        const other = await User.findById(otherId).select(PARTICIPANT_FIELDS)
        if (!other) {
            return c.json({ message: "Хэрэглэгч олдсонгүй" }, 404)
        }

        const conversation = await findOrCreateConversation(userId, otherId)
        if (!conversation) {
            return c.json({ message: "Яриа үүсгэж чадсангүй" }, 500)
        }
        return c.json({ data: { _id: conversation._id, other } }, 200)
    } catch (error) {
        console.error("openConversation алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/** Нэг ярианы зурвасууд. Уншсанаар тэмдэглэх нь тусдаа endpoint. */
export const listMessages = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const id = c.req.param("id")

        const conversation = await Conversation.findById(id).populate(
            "participants",
            PARTICIPANT_FIELDS,
        )
        if (!conversation) {
            return c.json({ message: "Яриа олдсонгүй" }, 404)
        }
        // Гуравдагч этгээд бусдын ярианы уншихаас сэргийлнэ.
        const isParticipant = (conversation.participants as any[]).some(
            (p) => String(p?._id ?? p) === String(userId),
        )
        if (!isParticipant) {
            return c.json({ message: "Энэ яриаг үзэх эрхгүй байна" }, 403)
        }

        const messages = await Message.find({ conversation_id: id })
            .sort({ createdAt: 1 })
            .limit(200)

        const other = (conversation.participants as any[]).find(
            (p) => String(p?._id) !== String(userId),
        )

        return c.json({
            data: {
                _id: conversation._id,
                other,
                messages: messages.map((m) => ({
                    _id: m._id,
                    text: m.text,
                    mine: String(m.sender_id) === String(userId),
                    createdAt: m.createdAt,
                })),
            },
        }, 200)
    } catch (error) {
        console.error("listMessages алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/** Зурвас илгээх. */
export const sendMessage = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const id = c.req.param("id")
        const body = await c.req.json()
        const text = String(body?.text ?? "").trim()

        if (!text) {
            return c.json({ message: "Хоосон зурвас илгээх боломжгүй" }, 400)
        }
        if (text.length > 2000) {
            return c.json({ message: "Зурвас хэт урт байна" }, 400)
        }

        const conversation = await Conversation.findById(id)
        if (!conversation) {
            return c.json({ message: "Яриа олдсонгүй" }, 404)
        }
        const isParticipant = (conversation.participants as any[]).some(
            (p) => String(p) === String(userId),
        )
        if (!isParticipant) {
            return c.json({ message: "Энэ яриа руу бичих эрхгүй байна" }, 403)
        }

        const message = await Message.create({
            conversation_id: id,
            sender_id: userId,
            text,
        })

        // Жагсаалтад сүүлийн зурвасыг харуулахад ашиглана — тус бүрд нь
        // Message-ээс хайхгүйн тулд энд хуулбарлаж хадгална.
        conversation.last_message_at = message.createdAt
        conversation.last_message_text = text
        await conversation.save()

        return c.json({
            data: {
                _id: message._id,
                text: message.text,
                mine: true,
                createdAt: message.createdAt,
            },
        }, 201)
    } catch (error) {
        console.error("sendMessage алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/** Нөгөө талын зурвасуудыг уншсанд тооцох. */
export const markConversationRead = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const id = c.req.param("id")

        await Message.updateMany(
            { conversation_id: id, sender_id: { $ne: userId }, read_at: null },
            { read_at: new Date() },
        )

        return c.json({ message: "Уншсанд тэмдэглэв" }, 200)
    } catch (error) {
        console.error("markConversationRead алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}
