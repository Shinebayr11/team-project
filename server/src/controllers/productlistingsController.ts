import { Context } from "hono"
import { Bid } from "../models/Bid.js"
import { ProductListing } from "../models/ProductListing.js"
import { Product } from "../models/Product.js"
import { Live_Show } from "../models/Live_show.js"
import { LISTING_STATUS, settleExpiredListings } from "../lib/auction.js"

const DEFAULT_DURATION_SECONDS = 60
const MAX_DURATION_SECONDS = 60 * 60

/**
 * Лайвын аукционууд. live_show_id өгвөл зөвхөн тухайн лайвынх, эс бөгөөс бүгд.
 * Уншихаас өмнө хугацаа нь дууссан аукционуудыг хаана.
 */
export const getProductlisting = async (c: Context) => {
    try {
        const liveShowId = c.req.query("live_show_id")
        const filter = liveShowId ? { live_show_id: liveShowId } : {}

        await settleExpiredListings(filter)

        const data = await ProductListing.find(filter)
            .sort({ createdAt: -1 })
            .populate("product_id", "name description price_coins images")
            .populate("current_winner_id", "display_name avatar_url")

        return c.json({ message: "Amilttai awlaa", data }, 200)
    } catch (error) {
        console.error("getProductlisting алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * Нэвтэрсэн хэрэглэгчийн хожсон аукционууд — "барааг авах эрх үүссэн"
 * мэдэгдлүүд эндээс уншигдана.
 *
 * Хугацаа нь дуусаад хараахан хаагдаагүй аукцион байвал эхлээд хаана,
 * ингэснээр дөнгөж дууссан хожил шууд харагдана.
 */
export const getMyWonListings = async (c: Context) => {
    try {
        const userId = c.get("userId")

        await settleExpiredListings({ current_winner_id: userId })

        const data = await ProductListing.find({
            current_winner_id: userId,
            status: LISTING_STATUS.sold,
        })
            .sort({ updatedAt: -1 })
            .limit(20)
            .populate("product_id", "name description price_coins images")
            .populate({
                path: "live_show_id",
                select: "title seller_id",
                populate: { path: "seller_id", select: "display_name shop_name avatar_url" },
            })

        return c.json({ data }, 200)
    } catch (error) {
        console.error("getMyWonListings алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * GET /api/productlisting/bidding
 *
 * Хэрэглэгчийн санал өгсөн, ОДОО ХҮРТЭЛ явж буй лотууд. Тэргүүлж байгаа эсэхийг
 * сервер тооцож өгнө — клиент өөрийн Mongo id-г мэддэггүй.
 */
export const getMyActiveBids = async (c: Context) => {
    try {
        const userId = c.get("userId")

        const listingIds = await Bid.distinct("listing_id", { buyer_id: userId })
        if (listingIds.length === 0) {
            return c.json({ data: [] }, 200)
        }

        await settleExpiredListings({ _id: { $in: listingIds } })

        const listings = await ProductListing.find({
            _id: { $in: listingIds },
            status: LISTING_STATUS.active,
        })
            .sort({ timer_ends_at: 1 })
            .populate("product_id", "name description price_coins images")
            .populate({
                path: "live_show_id",
                select: "title seller_id",
                populate: { path: "seller_id", select: "display_name shop_name avatar_url" },
            })
            .lean()

        const data = listings.map((listing) => ({
            ...listing,
            leading: String(listing.current_winner_id) === String(userId),
        }))

        return c.json({ data }, 200)
    } catch (error) {
        console.error("getMyActiveBids алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * GET /api/productlisting/sales
 *
 * Худалдагчийн зарагдсан лотууд, ялагчийнх нь хамт. `/wins`-ийн эсрэг тал:
 * дамжуулалт дуусмагц худалдагч ялагчтайгаа холбогдох цорын ганц зам нь
 * эфир дээрх тууз байсан бөгөөд дараагийн лот гармагц алга болдог байв.
 */
export const getMySales = async (c: Context) => {
    try {
        const userId = c.get("userId")

        // Лайв нь худалдагчийнх эсэхээр шүүнэ — лот дээр эзэмшигч шууд байхгүй.
        const myShows = await Live_Show.find({ seller_id: userId }).select("_id")
        const showIds = myShows.map((show) => show._id)

        if (showIds.length === 0) {
            return c.json({ data: [] }, 200)
        }

        await settleExpiredListings({ live_show_id: { $in: showIds } })

        const data = await ProductListing.find({
            live_show_id: { $in: showIds },
            status: LISTING_STATUS.sold,
        })
            .sort({ updatedAt: -1 })
            .limit(50)
            .populate("product_id", "name description price_coins images")
            .populate("current_winner_id", "display_name shop_name avatar_url")
            .populate({ path: "live_show_id", select: "title started_at" })

        return c.json({ data }, 200)
    } catch (error) {
        console.error("getMySales алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/**
 * Лайв дээр бараагаа аукционд гаргах. Зөвхөн тухайн лайвын эзэн, зөвхөн
 * өөрийн бараагаар.
 */
export const postProductlisting = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const body = await c.req.json()
        const { product_id, live_show_id, starting_price_coins, duration_seconds } = body

        if (!product_id || !live_show_id || starting_price_coins === undefined) {
            return c.json({ message: "shaardlagtai medeelel dutuu bn" }, 400)
        }

        const startingPrice = Number(starting_price_coins)
        if (!Number.isFinite(startingPrice) || startingPrice < 0) {
            return c.json({ message: "Эхлэх үнэ буруу байна" }, 400)
        }

        const show = await Live_Show.findById(live_show_id)
        if (!show) {
            return c.json({ message: "Live show olsongvi" }, 404)
        }
        if (String(show.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ лайвыг өөрчлөх эрхгүй байна" }, 403)
        }

        const product = await Product.findById(product_id)
        if (!product) {
            return c.json({ message: "Бараа олдсонгүй" }, 404)
        }
        if (String(product.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ бараа таных биш байна" }, 403)
        }

        // Нэг лайв дээр нэгэн зэрэг зөвхөн нэг аукцион явна — үзэгчид юун дээр
        // санал болгож буй нь ойлгомжтой байх ёстой.
        await settleExpiredListings({ live_show_id })
        const running = await ProductListing.findOne({
            live_show_id,
            status: LISTING_STATUS.active,
        })
        if (running) {
            return c.json({ message: "Өмнөх аукцион хараахан дуусаагүй байна" }, 409)
        }

        const seconds = Math.min(
            Math.max(Number(duration_seconds) || DEFAULT_DURATION_SECONDS, 10),
            MAX_DURATION_SECONDS,
        )

        const data = await ProductListing.create({
            product_id,
            live_show_id,
            sale_type: "auction",
            starting_price_coins: startingPrice,
            current_highest_bid_coins: null,
            current_winner_id: null,
            timer_ends_at: new Date(Date.now() + seconds * 1000),
            status: LISTING_STATUS.active,
        })

        const populated = await data.populate("product_id", "name description price_coins images")
        return c.json({ message: "Amjilttai hadgallaa", data: populated }, 201)
    } catch (error) {
        console.error("postProductlisting алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}

/** Аукционыг хугацаанаас нь өмнө хаах — зөвхөн лайвын эзэн. */
export const closeProductlisting = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const id = c.req.param("id")

        const listing = await ProductListing.findById(id)
        if (!listing) {
            return c.json({ message: "Аукцион олдсонгүй" }, 404)
        }

        const show = await Live_Show.findById(listing.live_show_id)
        if (!show || String(show.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ аукционыг хаах эрхгүй байна" }, 403)
        }

        if (listing.status === LISTING_STATUS.active) {
            // Хугацааг нь дуусгаад ердийн хаалтын урсгалаар оруулна — ингэснээр
            // ялагчийн төлбөр нэг л газар боловсрогдоно.
            await ProductListing.updateOne({ _id: id }, { timer_ends_at: new Date() })
            await settleExpiredListings({ _id: id })
        }

        const data = await ProductListing.findById(id)
            .populate("product_id", "name description price_coins images")
            .populate("current_winner_id", "display_name avatar_url")

        return c.json({ message: "Amjilttai haalaa", data }, 200)
    } catch (error) {
        console.error("closeProductlisting алдаа:", error)
        return c.json({ message: "Aldaa garlaa" }, 500)
    }
}
