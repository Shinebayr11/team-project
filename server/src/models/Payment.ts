import mongoose, { Schema } from "mongoose";

/**
 * Wire дээр үүсгэсэн нэхэмжлэх бүрийн бүртгэл. Хэтэвч ЗӨВХӨН энэ мөрөөр
 * дамжиж цэнэглэгдэнэ: `status` нь `pending → succeeded` болж атомаар
 * "эзэмшигдсэн" үед л үлдэгдэл нэмэгдэх тул webhook ба төлөв шалгагч хоёр
 * зэрэг ирлээ ч хоёр дахин цэнэглэхгүй.
 */
const PaymentSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", index: true },
        payment_intent_id: { type: String, required: true, unique: true },
        /** Хэрэглэгчийн бодитоор төлөх дүн (₮). */
        amount: { type: Number, required: true },
        /** Хэтэвчид нэмэгдэх дүн — урамшуулал нь үүн дотор. */
        credit_amount: { type: Number, required: true },
        currency: { type: String, default: "MNT" },
        status: { type: String, default: "pending", index: true },
        /** Гүйлгээний утга дээр гарах богино код (WN-XXXXXX). */
        reference: { type: String },
    },
    { timestamps: true }
)

export const Payment = mongoose.model("Payment", PaymentSchema)
