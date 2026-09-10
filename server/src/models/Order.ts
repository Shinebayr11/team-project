import mongoose, { Schema } from "mongoose";

/**
 * Захиалга.
 *
 * Доорх `buyer_id`/`product_id`/`quantity`/`price_coins` нь АНХНЫ, нэг бараатай
 * хэлбэр — хуучин бичлэгүүд тэрчлэн үлдсэн тул хэвээр байна. Seller Hub-ын
 * "Захиалга" ба "Аналитик" хэсэг нь үүнээс илүү ихийг шаарддаг: нэг захиалгад
 * олон бараа, төлбөр/хүргэлтийн ТУСДАА төлөв, хүргэх хаяг, худалдагч хэн бэ.
 * Тэдгээрийг доор нэмсэн бөгөөд бүгд сонголттой — хуучин бичлэг эвдрэхгүй.
 */

/** Захиалгын нэг мөр. Нэр/үнэ нь ТЭР ҮЕИЙН хуулбар — бараа хожим өөрчлөгдөхөд захиалга хөдлөхгүй. */
const orderItemSchema = new Schema(
    {
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        sku: { type: String, default: "" },
        price_coins: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
)

const shippingAddressSchema = new Schema(
    {
        fullName: { type: String, default: "" },
        addressLine1: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "Mongolia" },
    },
    { _id: false }
)

const OrderSchema = new Schema(
    {
        buyer_id: { type: Schema.Types.ObjectId, ref: "User" },
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        video_id: { type: Schema.Types.ObjectId, ref: "Video" },
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_Show" },
        quantity: { type: Number },
        price_coins: { type: Number },
        status: { type: String },

        /** Худалдагч. `GET /api/order/mine` ЗӨВХӨН үүгээр шүүнэ. */
        seller_id: { type: Schema.Types.ObjectId, ref: "User", index: true },
        /** Худалдан авагчийн нэрийн хуулбар — бүртгэл устсан ч захиалга уншигдана. */
        buyer_name: { type: String, default: "" },
        items: { type: [orderItemSchema], default: [] },
        total_coins: { type: Number, default: 0 },
        payment_status: {
            type: String,
            enum: ["PENDING", "PAID", "REFUNDED"],
            default: "PENDING",
        },
        fulfillment_status: {
            type: String,
            enum: [
                "PENDING",
                "PROCESSING",
                "READY_TO_SHIP",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
                "RETURNED",
            ],
            default: "PENDING",
        },
        shipping_address: { type: shippingAddressSchema, default: () => ({}) },
        tracking_number: { type: String },
        carrier: { type: String },

        /**
         * Үзүүлэнгийн өгөгдөл эсэх. Seed script үүнийг тавьж, `--clean` үүгээр
         * л устгана — бодит захиалгад хэзээ ч хүрэхгүй.
         */
        demo_seed: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
)

export const Order = mongoose.model("Order", OrderSchema)
