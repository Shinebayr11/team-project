import mongoose, { Schema } from "mongoose";

/**
 * Худалдагчийн үйл ажиллагааны тохиргоо. Default утгууд нь шинэ бараа/хүргэлтийн
 * формын ӨМНӨХ хатуу утгуудтай яг ижил — тохиргоогоо хөндөөгүй худалдагчийн
 * ажиллагаа өөрчлөгдөхгүй.
 */
const sellerSettingsSchema = new Schema(
    {
        selling: {
            type: new Schema(
                {
                    defaultListingType: {
                        type: String,
                        enum: ["buy_it_now", "auction"],
                        required: true,
                        default: "buy_it_now",
                    },
                    acceptOffers: { type: Boolean, required: true, default: true },
                },
                { _id: false }
            ),
            required: true,
            default: () => ({}),
        },
        listing: {
            type: new Schema(
                {
                    defaultCategory: { type: String, required: true, default: "Sneakers", trim: true },
                    defaultCondition: { type: String, required: true, default: "New", trim: true },
                    defaultQuantity: { type: Number, required: true, default: 1, min: 0, max: 9999 },
                },
                { _id: false }
            ),
            required: true,
            default: () => ({}),
        },
        shipping: {
            type: new Schema(
                {
                    processingDays: { type: Number, required: true, default: 2, min: 1, max: 30 },
                },
                { _id: false }
            ),
            required: true,
            default: () => ({}),
        },
        orders: {
            type: new Schema(
                {
                    autoConfirm: { type: Boolean, required: true, default: false },
                    packingSlipNote: { type: String, default: "", trim: true, maxlength: 300 },
                },
                { _id: false }
            ),
            required: true,
            default: () => ({}),
        },
    },
    { _id: false }
)

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
        settings: { type: sellerSettingsSchema, required: true, default: () => ({}) },
    },
    { _id: false }
)

/** Бүртгэлийн ерөнхий тохиргоо. Худалдагч эсэхээс үл хамааран бүх хэрэглэгчид байна. */
const preferencesSchema = new Schema(
    {
        language: { type: String, enum: ["mn", "en"], required: true, default: "mn" },
        timezone: { type: String, required: true, default: "Asia/Ulaanbaatar", trim: true },
    },
    { _id: false }
)

/** Мэдэгдэл авах сэдвүүд. Илгээх суваг нь одоогоор апп доторх мэдэгдэл. */
const notificationsSchema = new Schema(
    {
        orderUpdates: { type: Boolean, required: true, default: true },
        showReminders: { type: Boolean, required: true, default: true },
        bidAlerts: { type: Boolean, required: true, default: true },
        messages: { type: Boolean, required: true, default: true },
        promotions: { type: Boolean, required: true, default: false },
    },
    { _id: false }
)

/**
 * Хүргэлтийн хаяг. Монголын хаягийн бүтэц: хот/аймаг → дүүрэг/сум → хороо/баг
 * → дэлгэрэнгүй (гудамж, байр, тоот).
 */
const addressSchema = new Schema(
    {
        fullName: { type: String, required: true, trim: true, maxlength: 60 },
        phone: { type: String, required: true, trim: true, maxlength: 20 },
        city: { type: String, required: true, trim: true, maxlength: 60 },
        district: { type: String, required: true, trim: true, maxlength: 60 },
        khoroo: { type: String, trim: true, maxlength: 60 },
        detail: { type: String, required: true, trim: true, maxlength: 200 },
        /** Үндсэн хаяг нэг л байна — шинээр тэмдэглэхэд бусад нь автоматаар арилна. */
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
)

const userSchema = new Schema(
    {
        clerk_user_id: { type: String, required: true, unique: true },
        role: { type: String, required: true, default: "user" },
        display_name: { type: String, required: true },
        bio: { type: String, trim: true, maxlength: 300 },
        avatar_url: { type: String },
        // Профайл, дэлгүүрийн хуудасны дээд талын өргөн зураг.
        cover_url: { type: String },
        shop_name: { type: String },
        preferences: { type: preferencesSchema, required: true, default: () => ({}) },
        notifications: { type: notificationsSchema, required: true, default: () => ({}) },
        addresses: { type: [addressSchema], default: [] },
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
