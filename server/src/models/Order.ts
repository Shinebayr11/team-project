import mongoose, { Schema } from "mongoose";
const OrderSchema = new Schema(
    {
        buyer_id: { type: Schema.Types.ObjectId, ref: "User" },
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        video_id: { type: Schema.Types.ObjectId, ref: "Video" },
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_Schow" },
        quantity: { type: Number },
        price_coins: { type: Number },
        status: { type: String },
    },
    { timestamps: true }
)
export const Order = mongoose.model("Order", OrderSchema)
