import mongoose, { Schema } from "mongoose";

const Live_showsSchema = new Schema(
    {
        seller_id: { type: Schema.Types.ObjectId, ref: "User" },
        title: { type: String },
        status: { type: String },
        thumbnail_url: { type: String },
        ended_at: { type: Date },
        livekit_room_name: { type: String },
        viewer_count: { type: Number },
        started_at: { type: Date },
        category: { type: String },
        // Худалдааны хэлбэр: "auction" | "buy_it_now" | "mixed".
        // Товлосон дамжуулалтын сонголт эфирт орох үед энд бууна.
        type: { type: String, default: "mixed" },
        tags: { type: String },
        sponsored: { type: Boolean, default: false },
        /**
         * Үзүүлэнгийн өгөгдөл эсэх. `seed:demo-shop` үүнийг тавьж, `--clean`
         * үүгээр л устгана — бодит өгөгдөлд хэзээ ч хүрэхгүй.
         */
        demo_seed: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
)
export const Live_Show = mongoose.model("Live_Show", Live_showsSchema)