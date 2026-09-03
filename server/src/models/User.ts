import mongoose, { Schema } from "mongoose";

/**
 * Худалдагчийн профайл. Гарын үсэг зурмагц ШУУД идэвхжинэ — `status` дотор
 * зөвхөн "active" байна. Хүлээх, хянах, баталгаажуулах төлөв БАЙХГҮЙ.
 */
const sellerProfileSchema = new Schema(
    {
        status: { type: String, enum: ["active"], required: true, default: "active" },
        storeName: { type: String, required: true, trim: true },
        storeSlug: { type: String, required: true, trim: true, lowercase: true },
        sellerType: { type: String, enum: ["individual", "business"], required: true, default: "individual" },
        category: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        // Гэрээнд зурсан гарын үсэг — хэрэглэгчийн бичсэн бүтэн нэр.
        signature: { type: String, required: true, trim: true },
        termsVersion: { type: String, required: true },
        agreedAt: { type: Date, required: true },
        activatedAt: { type: Date, required: true },
    },
    { _id: false }
)

const userSchema = new Schema(
    {
        clerk_user_id: { type: String, required: true, unique: true },
        role: { type: String, required: true, default: "user" },
        display_name: { type: String, required: true },
        avatar_url: { type: String },
        shop_name: { type: String },
        sellerProfile: { type: sellerProfileSchema, default: undefined },
        followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: Schema.Types.ObjectId, ref: "User" }],

    },
    {
        timestamps: true
    })

// Нэг slug-ийг зөвхөн нэг худалдагч эзэмшинэ. `sparse` — идэвхжээгүй
// хэрэглэгчид sellerProfile огт байхгүй тул index-д ороогүй байна.
userSchema.index({ "sellerProfile.storeSlug": 1 }, { unique: true, sparse: true })

export const User = mongoose.model("User", userSchema)
