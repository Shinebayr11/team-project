import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
    {
        seller_id: { type: Schema.Types.ObjectId, ref: "User" },
        storage_path: { type: String },
        thumbnail_url: { type: String },
        caption: { type: String },
        status: {
            type: String

        }
    },
    { timestamps: true }
)
export const Video = mongoose.model("Video", videoSchema)