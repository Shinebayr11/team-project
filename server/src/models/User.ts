import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        clerk_user_id: { type: String, required: true, unique: true },
        role: { type: String, required: true, default: "user" },
        display_name: { type: String, required: true },
        avatar_url: { type: String },
        shop_name: { type: String },

    },
    {
        timestamps: true
    })
export const User = mongoose.model("User", userSchema)