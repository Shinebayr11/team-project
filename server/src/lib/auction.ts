import { Types } from "mongoose"
import { ProductListing } from "../models/ProductListing.js"
import { Live_Show } from "../models/Live_show.js"
import { Order } from "../models/Order.js"
import { Product } from "../models/Product.js"
import { User } from "../models/User.js"
import { Wallet } from "../models/Wallet.js"
import { CoinTransaction } from "../models/Cointransaction.js"

/** Controller-ууд userId-г context-оос авдаг тул төрөл нь сул — энд нэгтгэнэ. */
type UserRef = Types.ObjectId | string

/** Аукционы төлөв. */
export const LISTING_STATUS = {
    active: "active",
    sold: "sold",
    unsold: "unsold",
    cancelled: "cancelled",
} as const

/**
 * Тухайн listing дээр дараагийн санал хамгийн багадаа хэд байх ёстой вэ.
 * Эхний санал эхлэх үнээс багагүй, дараачийнх нь одоогийн саналаас их байна.
 */
export const minimumBid = (listing: {
    current_highest_bid_coins?: number | null
    starting_price_coins?: number | null
}) =>
    listing.current_highest_bid_coins != null
        ? listing.current_highest_bid_coins + 1
        : (listing.starting_price_coins ?? 0)

/**
 * Санал өгсөн дүнг барьцаанд авна. Зарцуулж болох үлдэгдэл (coin_balance -
 * held_coins) хүрэлцэж байвал л амжилттай — иймд нэг зоосыг зэрэг явж буй
 * хэд хэдэн аукционд давхар амлах боломжгүй.
 *
 * @returns барьцаалж чадсан эсэх
 */
export const holdCoins = async (userId: UserRef, amount: number) => {
    const wallet = await Wallet.findOneAndUpdate(
        {
            user_id: userId,
            $expr: {
                $gte: [
                    { $subtract: ["$coin_balance", { $ifNull: ["$held_coins", 0] }] },
                    amount,
                ],
            },
        },
        { $inc: { held_coins: amount } },
    )
    return !!wallet
}

/**
 * Барьцааг сулруулна — давуулагдсан, эсвэл аукцион цуцлагдсан үед.
 *
 * Бодитоор барьцаалагдсанаас илүүг сулруулбал held_coins сөрөг болж,
 * зарцуулж болох үлдэгдэл (coin_balance - held_coins) бодит үлдэгдлээс
 * давах буюу байхгүй зоос үүснэ — иймд барьцаа хүрэлцэхэд л хасна.
 */
export const releaseCoins = async (userId: UserRef, amount: number) => {
    if (!userId || !amount) return
    await Wallet.updateOne(
        { user_id: userId, held_coins: { $gte: amount } },
        { $inc: { held_coins: -amount } },
    )
}

/**
 * Хугацаа нь дууссан аукционуудыг хаана: ялагчийн барьцааг худалдагч руу
 * шилжүүлж, саналгүй дууссаныг чөлөөлнө.
 *
 * Vercel serverless дээр байнга ажилладаг процесс байхгүй тул cron-оор хаах
 * боломжгүй — уншилт/санал бүрийн үед хугацаа дууссаныг шалгаж, тэр үед нь
 * хаана (lazy close).
 */
export const settleExpiredListings = async (filter: Record<string, unknown> = {}) => {
    const expired = await ProductListing.find({
        ...filter,
        status: LISTING_STATUS.active,
        timer_ends_at: { $lte: new Date() },
    })

    for (const listing of expired) {
      // Нэг аукционы алдаа бусдыг нь хаалтгүй үлдээх ёсгүй — тус тусад нь
      // тусгаарлана.
      try {
        // Хоёр хүсэлт зэрэг хаахыг оролдвол зөвхөн нэг нь амжилттай болно —
        // status-ыг нөхцөлтэйгээр солино.
        const claimed = await ProductListing.findOneAndUpdate(
            { _id: listing._id, status: LISTING_STATUS.active },
            {
                status: listing.current_winner_id
                    ? LISTING_STATUS.sold
                    : LISTING_STATUS.unsold,
            },
            { new: true },
        )
        if (!claimed || !claimed.current_winner_id) continue

        const amount = claimed.current_highest_bid_coins ?? 0
        if (amount <= 0) continue

        // Барьцаанд байгаа дүнг бодит төлбөр болгоно: үлдэгдлээс хасаж,
        // барьцааг нь мөн чөлөөлнө.
        const buyerWallet = await Wallet.findOneAndUpdate(
            {
                user_id: claimed.current_winner_id,
                coin_balance: { $gte: amount },
                held_coins: { $gte: amount },
            },
            { $inc: { coin_balance: -amount, held_coins: -amount } },
            { new: true },
        )

        if (!buyerWallet) {
            // Барьцаа нь олдсонгүй — тэгэхээр сулруулах зүйл ч алга. Энд
            // releaseCoins дуудвал байхгүй барьцааг хасаж, зоос үүсгэнэ.
            // Борлуулалт биш гэж тэмдэглээд орхино.
            console.error(
                `Аукцион ${claimed._id}: ялагчийн барьцаа олдсонгүй, төлбөр хийгдсэнгүй`,
            )
            await ProductListing.updateOne(
                { _id: claimed._id },
                { status: LISTING_STATUS.unsold },
            )
            continue
        }

        await CoinTransaction.create({
            wallet_id: buyerWallet._id,
            type: "auction_win",
            amount: -amount,
        })

        // Худалдагчийн орлого. Хэтэвчгүй бол үүсгэнэ — эс бөгөөс мөнгө
        // замдаа алга болно.
        //
        // Эзнийг ЛОТООС нь авна. Өмнө нь зөвхөн эфирээр дамжуулж олдог байсан
        // тул эфиргүй (пост хэлбэрийн) лот энд ирээд чимээгүй унтардаг байв.
        // Хуучин лотуудад `seller_id` байхгүй тул эфир нь нөөц хэвээр.
        const show = claimed.live_show_id
            ? await Live_Show.findById(claimed.live_show_id)
            : null
        const sellerId = claimed.seller_id ?? show?.seller_id
        if (!sellerId) continue

        const sellerWallet = await Wallet.findOneAndUpdate(
            { user_id: sellerId },
            { $inc: { coin_balance: amount } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        )

        await CoinTransaction.create({
            wallet_id: sellerWallet._id,
            type: "auction_sale",
            amount,
        })

        // Ялсан лот бол ЗАХИАЛГА: худалдагч барааг нь илгээх ажил үлдсэн.
        //
        // Өмнө нь энэ нь захиалга үүсгэдэггүй байсан тул Seller Hub ялагчдыг
        // "Захиалга" хүснэгтэндээ биш, түүний ДЭЭР тусдаа самбар дээр харуулж,
        // мөн орлого, хүргэлтийн тоонд ч ордоггүй байв.
        //
        // Төлбөр нь ЭНД аль хэдийн хийгдсэн (зоос шилжсэн) тул PAID; харин
        // хүргэлт нь хараахан эхлээгүй.
        const [product, winner] = await Promise.all([
            Product.findById(claimed.product_id).select("name sku"),
            User.findById(claimed.current_winner_id).select("display_name"),
        ])

        await Order.create({
            seller_id: sellerId,
            buyer_id: claimed.current_winner_id,
            listing_id: claimed._id,
            live_show_id: claimed.live_show_id,
            product_id: claimed.product_id,
            buyer_name: winner?.display_name ?? "Хэрэглэгч",
            items: [
                {
                    product_id: claimed.product_id,
                    name: product?.name ?? "Бараа",
                    sku: product?.sku ?? "",
                    price_coins: amount,
                    quantity: 1,
                },
            ],
            quantity: 1,
            price_coins: amount,
            total_coins: amount,
            payment_status: "PAID",
            fulfillment_status: "PENDING",
        })
      } catch (error) {
        console.error(`Аукцион ${listing._id} хаахад алдаа гарлаа:`, error)
      }
    }
}
