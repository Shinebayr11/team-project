import mongoose, { Schema } from "mongoose";
import { stringify } from "node:querystring";
import { string } from "zod";

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
        tags: { type: String },
        sponsored: { type: Boolean, default: false },
        // LiveKit Ingress/Egress fields
        ingressId: { type: String, sparse: true },
        egressId: { type: String, sparse: true },
        roomName: { type: String },
        liveStatus: { type: String, enum: ["idle", "ingress_created", "streaming", "ingress_failed", "stopped"], default: "idle" },
        liveError: { type: String },
        // Facebook Egress
        facebookEgressStatus: { type: String, enum: ["idle", "started", "failed", "stopped"], default: "idle" },
        facebookEgressError: { type: String },
        facebookStartedAt: { type: Date },
        // Stream session timing
        ingressCreatedAt: { type: Date },
        stoppedAt: { type: Date }
    },
    { timestamps: true }
)
export const Live_Show = mongoose.model("Live_Show", Live_showsSchema)