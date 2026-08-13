import mongoose, { Schema } from "mongoose";
export const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price_coins: { type: Number },
        stock_quantity: { type: Number },
        seller_id: { type: Schema.Types.ObjectId, ref: "User" },
        images: [{ type: String }],
        category_id: { type: Schema.Types.ObjectId, ref: "Category" }
    }
)
export const Product = mongoose.model("Product", ProductSchema)
