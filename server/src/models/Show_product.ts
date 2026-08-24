import mongoose, { Schema } from "mongoose";

/** Шоуны барааны жагсаалт — аль бараа аль шоун дээр ямар дарааллаар гарах вэ. */
const Show_productSchema = new Schema(
    {
        // Модель "Live_Show" нэрээр бүртгэгддэг тул ref нь яг тэр үсгээр байх ёстой,
        // эс бөгөөс populate ажиллахгүй.
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_Show" },
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        display_order: { type: Number }

    },
    { timestamps: true }
)

// Нэг бараа нэг шоун дээр ганц л удаа байна.
Show_productSchema.index({ live_show_id: 1, product_id: 1 }, { unique: true })

export const Show_product = mongoose.model("Show_product", Show_productSchema)
