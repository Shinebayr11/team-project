import mongoose, { Schema } from "mongoose";
const OrderSchema = new Schema(
    {
        buyer_id: { type: Schema.Types.ObjectId, ref: "User" },
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        video_id: { type: Schema.Types.ObjectId, ref: "Video" },
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_Show" },
        quantity: { type: Number },
        price_coins: { type: Number },
        status: { type: String },
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
