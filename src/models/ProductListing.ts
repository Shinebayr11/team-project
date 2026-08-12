import mongoose, { Schema } from "mongoose";

const ProductListingSchema = new Schema(
    {
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_Show" },
        sale_type: { type: String },
        starting_price_coins: { type: Number },
        current_winner_id: { type: Schema.Types.ObjectId, ref: "User" },
        current_highest_bid_coins: { type: Number },
        timer_ends_at: { type: Date },
        status: { type: String }
    }
)
export const ProductListing = mongoose.model("ProducListing", ProductListingSchema)