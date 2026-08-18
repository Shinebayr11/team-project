import mongoose, { Schema } from "mongoose";
const Show_productSchema = new Schema(
    {
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_show" },
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        display_order: { type: Number }

    },
    { timestamps: true }
)
export const Show_product = mongoose.model("Show_product", Show_productSchema)
