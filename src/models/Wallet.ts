import mongoose, { Schema } from "mongoose";

const WalletSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        coin_balance: { type: Number },

    },
    { timestamps: true }
)
export const Wallet = mongoose.model("Wallet", WalletSchema)