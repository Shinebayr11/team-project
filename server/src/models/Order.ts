import mongoose, { Schema } from "mongoose";

/**
 * Худалдагчийн хүргэлтийн явц. `features/seller-hub/types.ts`-ийн
 * `SellerOrder['fulfillmentStatus']`-той яг ижил утгууд.
 *
 * Үндсэн урсгал: PENDING → CONFIRMED → SHIPPED → DELIVERED.
 * CANCELLED/RETURNED нь урсгалын хэсэг биш, онцгой төгсгөлүүд — самбар дээр
 * товчгүй, зөвхөн төлөв нь харагдана.
 */
export const FULFILLMENT_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
] as const

const OrderSchema = new Schema(
    {
        buyer_id: { type: Schema.Types.ObjectId, ref: "User" },
        product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        video_id: { type: Schema.Types.ObjectId, ref: "Video" },
        live_show_id: { type: Schema.Types.ObjectId, ref: "Live_Show" },
        quantity: { type: Number },
        price_coins: { type: Number },
        status: { type: String },
        /**
         * Худалдан авагчийн нэрийн хуулбар. `buyer_id`-г populate хийж нэрийг нь
         * авдаг ч бүртгэл устсан, эсвэл захиалга нь бүртгэлгүй эх сурвалжтай
         * (үзүүлэнгийн өгөгдөл) үед энэ л үлдэнэ.
         */
        buyer_name: { type: String },
        /**
         * Аукционы лотоос үүссэн бол аль лот вэ. Нэг лот НЭГ л захиалга үүсгэнэ
         * (доорх `sparse` unique индекс) — шууд худалдан авалтууд индекст ороогүй.
         */
        listing_id: { type: Schema.Types.ObjectId, ref: "ProductListing" },
        /** Үзүүлэнгийн өгөгдөл эсэх. `seed:demo-shop` тавьж, `--clean` үүгээр л устгана. */
        demo_seed: { type: Boolean, default: false, index: true },
        fulfillment_status: { type: String, enum: FULFILLMENT_STATUSES, default: "PENDING" },
        /** Хүргэлтэд гарахад бөглөнө — барааг хүргэж яваа жолоочийн мэдээлэл. */
        driver_phone: { type: String },
        vehicle_plate: { type: String },
        /** Захиалга үүсэх үеийн хаягийн хэвлэмэл хуулбар — `User.addresses`-ийн
         * тухайн бичлэг дараа засагдаж/устсан ч захиалга дээрх хаяг өөрчлөгдөхгүй. */
        shipping_address: {
            fullName: { type: String },
            phone: { type: String },
            city: { type: String },
            district: { type: String },
            khoroo: { type: String },
            detail: { type: String },
        },
    },
    { timestamps: true }
)
OrderSchema.index({ listing_id: 1 }, { unique: true, sparse: true })

export const Order = mongoose.model("Order", OrderSchema)
