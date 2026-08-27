import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        conversation_id: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        sender_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        // Хүлээн авагч уншсан эсэх. Хоёр хүний чат тул нэг тугаар хангалттай —
        // илгээгчийн хувьд үргэлж уншсанд тооцно.
        read_at: { type: Date },
    },
    { timestamps: true }
)

// Нэг ярианы зурвасуудыг цагаар нь эрэмбэлж татахад хэрэглэнэ.
messageSchema.index({ conversation_id: 1, createdAt: 1 })

export const Message = mongoose.model("Message", messageSchema)
