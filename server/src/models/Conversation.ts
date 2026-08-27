import mongoose, { Schema } from "mongoose";

/**
 * Хоёр хэрэглэгчийн хоорондох чат. participants нь ҮРГЭЛЖ эрэмбэлэгдсэн
 * (id-гаар нь өсөхөөр) хоёр элемент байна — ингэснээр "А→Б" ба "Б→А" нь нэг
 * л ярианд буудаг ба unique индекс давхардлаас сэргийлнэ.
 */
const conversationSchema = new Schema(
    {
        participants: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }],
            required: true,
            validate: {
                validator: (v: unknown[]) => v.length === 2,
                message: "Яриа яг хоёр оролцогчтой байна",
            },
        },
        last_message_at: { type: Date },
        last_message_text: { type: String },
    },
    { timestamps: true }
)

conversationSchema.index({ participants: 1 }, { unique: true })
conversationSchema.index({ last_message_at: -1 })

export const Conversation = mongoose.model("Conversation", conversationSchema)
