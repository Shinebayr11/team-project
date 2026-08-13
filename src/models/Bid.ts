import mongoose, { Schema } from "mongoose";

const BidsSchema = new Schema(
    {
        listing_id: {
            type: Schema.Types.ObjectId, ref: "ProducListing"
        },
        buyer_id: { type: Schema.Types.ObjectId, ref: "User" },
        amount_coins: { type: Number },

    },
    { timestamps: true }
)
export const Bid = mongoose.model("Bid", BidsSchema)