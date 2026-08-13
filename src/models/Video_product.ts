import mongoose, { Schema } from "mongoose";

const videoproductSchema = new Schema(
    {
        video_id: { type: Schema.Types.ObjectId, ref: "Video" },
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        display_order: { type: Number }
    },
    { timestamps: true }
)
export const Videoproduct = mongoose.model("Videoproduct", videoproductSchema)