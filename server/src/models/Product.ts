import mongoose, { Schema } from "mongoose";

/**
 * Худалдагчийн бараа — Seller Hub-ын "Бараа" хэсэг ба шууд дамжуулалтын "Миний бараа"
 * ХОЁУЛАА эндээс уншина. Өмнө нь Seller Hub зөвхөн хөтчийн localStorage дээр
 * ажилладаг байсан тул нэмсэн бараа шууд дамжуулалт дээр огт харагддаггүй байв.
 *
 * `sku`-с доош талбарууд нь Seller Hub-ын нэмэлт ойлголтууд; шууд дамжуулалтын тал
 * тэдгээрийг ашиглахгүй ч нэг баримт дээр хамт амьдарна.
 */
export const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price_coins: { type: Number },
        stock_quantity: { type: Number },
        seller_id: { type: Schema.Types.ObjectId, ref: "User" },
        images: [{ type: String }],
        category_id: { type: Schema.Types.ObjectId, ref: "Category" },

        sku: { type: String, trim: true },
        /** Seller Hub-ын текст ангилал (`category_id` нь шууд дамжуулалтын ангилал). */
        category: { type: String, trim: true },
        condition: { type: String, trim: true },
        listing_type: {
            type: String,
            enum: ["buy_it_now", "auction"],
            default: "buy_it_now",
        },
        status: {
            type: String,
            enum: ["ACTIVE", "DRAFT", "ARCHIVED", "OUT_OF_STOCK"],
            default: "ACTIVE",
        },
        /** Шууд дамжуулалтад гаргахаар барьцаалсан ба зарагдсан тоо. */
        reserved_quantity: { type: Number, default: 0, min: 0 },
        sold_quantity: { type: Number, default: 0, min: 0 },

        /**
         * Үзүүлэнгийн өгөгдөл эсэх. `seed:demo-shop` үүнийг тавьж, `--clean`
         * үүгээр л устгана — бодит бараанд хэзээ ч хүрэхгүй.
         */
        demo_seed: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
)

export const Product = mongoose.model("Product", ProductSchema)
