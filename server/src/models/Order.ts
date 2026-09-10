import mongoose, { Schema } from "mongoose";

/** Худалдагчийн хүргэлтийн явц. `features/seller-hub/types.ts`-ийн
 * `SellerOrder['fulfillmentStatus']`-той яг ижил утгууд. */
export const FULFILLMENT_STATUSES = [
    "PENDING",
    "PROCESSING",
    "READY_TO_SHIP",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
] as const

const OrderSchema = new Schema(
    {
        buyer_id: { type: Schema.Types.ObjectId, ref: "User" },
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        video_id: { type: Schema.Types.ObjectId, ref: "Video" },
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_Show" },
        quantity: { type: Number },
        price_coins: { type: Number },
        status: { type: String },
        fulfillment_status: { type: String, enum: FULFILLMENT_STATUSES, default: "PENDING" },
        carrier: { type: String },
        tracking_number: { type: String },
        /** Захиалга үүсэх үеийн хаягийн хэвлэмэл хуулбар — `User.addresses`-ийн
         * тухайн бичлэг дараа засагдаж/устсан ч захиалга дээрх хаяг өөрчлөгдөхгүй. */
        shipping_address: {
            fullName: { type: String },
            phone: { type: String },
            city: { type: String },
            district: { type: String },
            khoroo: { type: String },
            detail: { type: String },
        },
    },
    { timestamps: true }
)
export const Order = mongoose.model("Order", OrderSchema)
