import mongoose, { Schema } from "mongoose";

const productListingSchema = new Schema(
    {
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        /**
         * Эфирийн лот бол аль эфир вэ. ПОСТ хэлбэрийн дуудлага худалдаанд
         * (барааны хуудсан дээр хоног үргэлжлэх) энэ нь ХООСОН байна.
         */
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_Show" },
        /**
         * Худалдагч. Өмнө нь эзнийг нь ЗӨВХӨН эфирээр дамжуулж олдог байсан тул
         * эфиргүй лот боломжгүй байв — одоо лот дээрээ шууд бичигдэнэ.
         */
        seller_id: { type: Schema.Types.ObjectId, ref: "User", index: true },
        sale_type: { type: String },
        starting_price_coins: { type: Number },
        current_winner_id: { type: Schema.Types.ObjectId, ref: "User" },
        current_highest_bid_coins: { type: Number },
        timer_ends_at: { type: Date },
        status: { type: String },
        /**
         * Үзүүлэнгийн өгөгдөл эсэх. `seed:demo-shop` үүнийг тавьж, `--clean`
         * үүгээр л устгана — бодит өгөгдөлд хэзээ ч хүрэхгүй.
         */
        demo_seed: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
)
export const ProductListing = mongoose.model("ProductListing", productListingSchema)