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

/**
 * Хосын давхардлыг байрлалаар нь хоригложээ.
 *
 * Өмнө нь `{ participants: 1 }` дээр unique индекс байсан нь БУРУУ: массив
 * талбар дээрх unique индекс нь массивыг бүхэлд нь биш, ЭЛЕМЕНТ ТУС БҮРИЙГ
 * давхардуулахгүй барьдаг. Улмаас нэг хэрэглэгч ЗӨВХӨН НЭГ яриатай байж
 * чадах ба хоёр дахийг нээх гэхэд E11000 алдаа гарч, чат нээгддэггүй байв.
 *
 * `participants` нь үргэлж эрэмбэлэгдсэн, яг хоёр элементтэй тул байрлалаар
 * нь compound unique индекс тавихад "А↔Б" хос давхардахгүй, харин "А↔В" шинэ
 * яриа хэвийн үүснэ.
 */
conversationSchema.index({ "participants.0": 1, "participants.1": 1 }, { unique: true })
conversationSchema.index({ last_message_at: -1 })

export const Conversation = mongoose.model("Conversation", conversationSchema)
