import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        parent_id: { type: Schema.Types.ObjectId, ref: "Category" }
    }
)
export const Category = mongoose.model("Category", categorySchema)