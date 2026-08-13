import mongoose, { Schema } from "mongoose";

const CoinTransactionSchema = new Schema(
    {
        wallet_id: { type: Schema.Types.ObjectId, ref: "Wallet" },
        type: { type: String },
        amount: { type: Number },
        related_order_id: { type: Schema.Types.ObjectId, ref: "Order" },
    },
    { timestamps: true }
)
export const CoinTransaction = mongoose.model("CoinTransaction", CoinTransactionSchema)