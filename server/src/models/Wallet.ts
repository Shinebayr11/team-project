import mongoose, { Schema } from "mongoose";

const WalletSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        coin_balance: { type: Number },
        // Аукционд амласан, гэхдээ хараахан төлөгдөөгүй зоос. Зарцуулж болох
        // үлдэгдэл нь coin_balance - held_coins.
        held_coins: { type: Number, default: 0 },

    },
    { timestamps: true }
)
export const Wallet = mongoose.model("Wallet", WalletSchema)
