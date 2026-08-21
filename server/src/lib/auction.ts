import { ProductListing } from "../models/ProductListing.js"
import { Wallet } from "../models/Wallet.js"
import { CoinTransaction } from "../models/Cointransaction.js"

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
 * Хугацаа нь дууссан аукционуудыг хааж, ялагчийн хэтэвчнээс төлбөрийг хасна.
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

        const wallet = await Wallet.findOneAndUpdate(
            { user_id: claimed.current_winner_id, coin_balance: { $gte: amount } },
            { $inc: { coin_balance: -amount } },
            { new: true },
        )

        if (!wallet) {
            // Ялагчийн үлдэгдэл санал өгснөөс хойш хүрэлцэхгүй болсон бол
            // борлуулалт биш, төлбөргүй хаалт болгож тэмдэглэнэ.
            await ProductListing.updateOne(
                { _id: claimed._id },
                { status: LISTING_STATUS.unsold },
            )
            continue
        }

        await CoinTransaction.create({
            wallet_id: wallet._id,
            type: "auction_win",
            amount: -amount,
        })
    }
}
