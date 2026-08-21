import { Types } from "mongoose"
import { ProductListing } from "../models/ProductListing.js"
import { Live_Show } from "../models/Live_show.js"
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

/** Барьцааг сулруулна — давуулагдсан, эсвэл аукцион цуцлагдсан үед. */
export const releaseCoins = async (userId: UserRef, amount: number) => {
    if (!userId || !amount) return
    await Wallet.updateOne({ user_id: userId }, { $inc: { held_coins: -amount } })
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
            // Барьцаа алга болсон (жишээ нь гараар өөрчлөгдсөн) — борлуулалт
            // биш гэж тэмдэглэж, дутуу төлбөрөөр хаахаас сэргийлнэ.
            await ProductListing.updateOne(
                { _id: claimed._id },
                { status: LISTING_STATUS.unsold },
            )
            await releaseCoins(claimed.current_winner_id, amount)
            continue
        }

        await CoinTransaction.create({
            wallet_id: buyerWallet._id,
            type: "auction_win",
            amount: -amount,
        })

        // Худалдагчийн орлого. Хэтэвчгүй бол үүсгэнэ — эс бөгөөс мөнгө
        // замдаа алга болно.
        const show = await Live_Show.findById(claimed.live_show_id)
        if (!show?.seller_id) continue

        const sellerWallet = await Wallet.findOneAndUpdate(
            { user_id: show.seller_id },
            { $inc: { coin_balance: amount } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        )

        await CoinTransaction.create({
            wallet_id: sellerWallet._id,
            type: "auction_sale",
            amount,
        })
    }
}
