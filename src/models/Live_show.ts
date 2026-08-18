import mongoose, { Schema } from "mongoose";
import { stringify } from "node:querystring";

const Live_showsSchema = new Schema(
    {
        seller_id: { type: Schema.Types.ObjectId, ref: "User" },
        title: { type: String },
        status: { type: String },
        thumbnail_url: { type: String },
        ended_at: { type: Date },
        agora_channel_name: { type: String },
        viewer_count: { type: Number },
        started_at: { type: Date }
    },
    { timestamps: true }
)
export const Live_Show = mongoose.model("Live_Show", Live_showsSchema)