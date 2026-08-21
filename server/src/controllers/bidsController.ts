import { Context } from "hono"
import { Bid } from "../models/Bid.js"
import { ProductListing } from "../models/ProductListing.js"
import { Wallet } from "../models/Wallet.js"
import { LISTING_STATUS, minimumBid, settleExpiredListings } from "../lib/auction.js"

const MAX_BIDS_RETURNED = 50

/** Тухайн аукционы саналууд, шинэ нь эхэндээ. */
export const getbids = async (c: Context) => {
    try {
        const listingId = c.req.query("listing_id")
        const filter = listingId ? { listing_id: listingId } : {}

        const data = await Bid.find(filter)
            .sort({ amount_coins: -1, createdAt: -1 })
            .limit(MAX_BIDS_RETURNED)
            .populate("buyer_id", "display_name avatar_url")

        return c.json({ message: "Amjilttai avlaa", data }, 200)
    } catch (error) {
        console.error("getbids алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * Санал өгөх. Санал өгөгчийг токеноос авна — өмнө нь хүсэлтийн биеэс авдаг
 * байсан тул хэн ч өөр хүний нэрээр санал өгөх боломжтой байсан.
 */
export const postbids = async (c: Context) => {
    try {
        const buyerId = c.get("userId")
        const body = await c.req.json()
        const { listing_id, amount_coins } = body

        if (!listing_id || amount_coins === undefined) {
            return c.json({ message: "Bvh talbariig boglonvv" }, 400)
        }

        const amount = Number(amount_coins)
        if (!Number.isFinite(amount) || amount <= 0) {
            return c.json({ message: "Дүн буруу байна" }, 400)
        }

        // Хугацаа нь дууссан байвал энд хаагдана — дуусчихсан аукционд санал
        // орохоос сэргийлнэ.
        await settleExpiredListings({ _id: listing_id })

        const listing = await ProductListing.findById(listing_id)
        if (!listing) {
            return c.json({ message: "Аукцион олдсонгүй" }, 404)
        }
        if (listing.status !== LISTING_STATUS.active) {
            return c.json({ message: "Энэ аукцион дууссан байна" }, 409)
        }
        if (String(listing.current_winner_id) === String(buyerId)) {
            return c.json({ message: "Та аль хэдийн тэргүүлж байна" }, 409)
        }

        const required = minimumBid(listing)
        if (amount < required) {
            return c.json(
                { message: `Хамгийн багадаа ${required} байх ёстой`, minimum: required },
                409,
            )
        }

        const wallet = await Wallet.findOne({ user_id: buyerId })
        if (!wallet || (wallet.coin_balance ?? 0) < amount) {
            return c.json({ message: "Үлдэгдэл хүрэлцэхгүй байна" }, 402)
        }

        // Хоёр хүн зэрэг санал өгвөл аль нэг нь л ялах ёстой. Уншаад дараа нь
        // бичих нь хоёуланг нь давхар ялагч болгож мэднэ — иймд нөхцөлийг
        // шинэчлэлтийн дотор нь шалгуулж, атомаар солино.
        const claimed = await ProductListing.findOneAndUpdate(
            {
                _id: listing_id,
                status: LISTING_STATUS.active,
                timer_ends_at: { $gt: new Date() },
                $expr: {
                    $lt: [
                        {
                            $ifNull: [
                                "$current_highest_bid_coins",
                                { $subtract: ["$starting_price_coins", 1] },
                            ],
                        },
                        amount,
                    ],
                },
            },
            { current_highest_bid_coins: amount, current_winner_id: buyerId },
            { new: true },
        )

        if (!claimed) {
            // Энэ хооронд өөр хэн нэгэн илүү өндөр санал өгсөн эсвэл хугацаа дууссан.
            const latest = await ProductListing.findById(listing_id)
            return c.json(
                {
                    message: "Санал хоцорлоо, дахин оролдоно уу",
                    minimum: latest ? minimumBid(latest) : undefined,
                },
                409,
            )
        }

        const data = await Bid.create({
            listing_id,
            buyer_id: buyerId,
            amount_coins: amount,
        })

        return c.json(
            { message: "Amjilttai hadgallaa", data, listing: claimed },
            201,
        )
    } catch (error) {
        console.error("postbids алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}
