import { randomUUID } from "node:crypto"
import { Context } from "hono"
import { RoomServiceClient, AccessToken } from "livekit-server-sdk"
import { Live_Show } from "../models/Live_show.js"
import { ProductListing } from "../models/ProductListing.js"

const roomService = new RoomServiceClient(
    (process.env.LIVEKIT_URL || "").replace(/^ws/, "http"),
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
)

// Seller "Эхлүүлэх" дарснаас хойш LiveKit-д бодитоор холбогдож room үүсгэх
// хүртэл хэдхэн секунд зарцуулагддаг (token авах, /live/[id] рүү шилжих,
// камер/микрофон хүсэх). Энэ хугацаанд staleness шалгалт хийвэл LiveKit дээр
// room хараахан үүсээгүй байгаа тул шинэхэн live-ийг андуураад "ended" болгож
// болзошгүй тул — үүссэнээс хойш GRACE хугацаанд шалгалтад оруулахгүй.
const STALE_CHECK_GRACE_MS = 30_000

/**
 * Шууд дамжуулалт staleness шалгалтад орох хангалттай хуучин болсон эсэх.
 *
 * `createdAt` нь Mongoose-ийн `timestamps` -аас ирдэг ч Mongo руу шууд (жишээ нь
 * гар аргаар, эсвэл тестийн script-ээр) оруулсан баримтад огт байхгүй байж
 * болно. Тэр үед `new Date(undefined).getTime()` нь `NaN` буцаадаг ба ямар ч
 * харьцуулалт `false` болдог тул тийм мөр staleness шалгалтаас МӨНХӨД мултарч,
 * LiveKit дээр өрөө нь хэзээ ч байгаагүй ч "live" хэвээр үлддэг байв.
 * Огноогүй баримтыг "хуучин" гэж үзэж, шалгалтад оруулна.
 */
const isPastGrace = (show: { createdAt?: unknown; started_at?: unknown }) => {
    const raw = show.createdAt ?? show.started_at
    const ms = raw ? new Date(raw as string).getTime() : NaN
    if (Number.isNaN(ms)) return true
    return Date.now() - ms > STALE_CHECK_GRACE_MS
}

// `listRooms()` нь үзэгч бүр 5 секунд тутам оролцогчийн тоог асуухад дуудагддаг
// тул үзэгчийн тоо өсөх тусам LiveKit рүү хийх дуудлага шугаман өснө. Хариуг нь
// богино хугацаанд кэшлэж, зэрэг ирсэн хүсэлтүүд нэг дуудлага хуваалцана.
const ROOMS_CACHE_MS = 4_000
let roomsCache:
    | { at: number; rooms: ReturnType<typeof roomService.listRooms> }
    | null = null

const listRoomsCached = () => {
    if (!roomsCache || Date.now() - roomsCache.at > ROOMS_CACHE_MS) {
        const rooms = roomService.listRooms()
        // Амжилтгүй хариу кэшэнд гацвал дараагийн бүх хүсэлт мөн унана — иймд
        // алдаа гарвал кэшийг шууд цэвэрлэж, дараагийн хүсэлт дахин оролдоно.
        rooms.catch(() => {
            roomsCache = null
        })
        roomsCache = { at: Date.now(), rooms }
    }
    return roomsCache.rooms
}

export const getliveshow = async (c: Context) => {
    try {
        // Home feed-д зөвхөн одоо шууд явж буй (status: "live"), эсвэл эхлэх цаг нь
        // тохируулагдсан (started_at) шууд дамжуулалтуудыг харуулна — цаг/төлөвгүй бэлэн бус
        // (draft) баримтуудыг нуух. Дууссан (ended) шууд дамжуулалтыг үргэлж хасна.
        const data = await Live_Show.find({
            status: { $ne: "ended" },
            $or: [{ status: "live" }, { started_at: { $ne: null } }],
        }).populate("seller_id", "display_name avatar_url shop_name")

        // status: "live" гэдэг нь зөвхөн DB-д ингэж тэмдэглэгдсэн гэсэн үг —
        // хэрэглэгч "Дуусгах"-г дарахгүйгээр таб-аа хаавал мөр нь мөнхөд "live"
        // хэвээр үлддэг. Иймд LiveKit-ээс яг одоо идэвхтэй байгаа room-уудтай
        // тулгаж, бодитоор дамжуулж буй биш "live" мөрүүдийг хасаж, DB-г засна.
        // livekit_room_name-гүй "live" мөрүүд бодит шууд дамжуулалт хэзээ ч байгаагүй
        // (жишээ нь mock/demo өгөгдөл) тул шалгах room алга — эдгээрийг алгасна.
        // Дөнгөж үүссэн (GRACE хугацаанаас цөөн) мөрүүдийг ч алгасна — race condition-оос сэргийлнэ.
        const liveDocs = data.filter(
            (show) => show.status === "live" && show.livekit_room_name && isPastGrace(show),
        )
        if (liveDocs.length > 0) {
            try {
                const activeRooms = await listRoomsCached()
                const activeRoomNames = new Set(activeRooms.map((r) => r.name))
                const staleIds = liveDocs
                    .filter((show) => !activeRoomNames.has(show.livekit_room_name ?? ""))
                    .map((show) => show._id)

                if (staleIds.length > 0) {
                    Live_Show.updateMany(
                        { _id: { $in: staleIds } },
                        { status: "ended", ended_at: new Date() },
                    ).catch(() => {})

                    const staleIdSet = new Set(staleIds.map(String))
                    return c.json(
                        { data: data.filter((show) => !staleIdSet.has(String(show._id))) },
                        200,
                    )
                }
            } catch (livekitError) {
                // LiveKit-тэй холбогдож чадаагүй бол DB-ийн өгөгдлөөр буцаана —
                // feed-ийг бүрэн эвдэхээс сэргийлнэ.
                console.error("LiveKit listRooms алдаа:", livekitError)
            }
        }

        return c.json({ data }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"

        }, 500)
    }

}
/**
 * GET /api/liveshow/mine
 *
 * Худалдагчийн өөрийн шууд дамжуулалтууд. Анхдагч нь `/sell` дээрх "хамгийн их үзэлттэй
 * 3 дууссан шууд дамжуулалт" — параметргүй хуучин дуудлагууд хэвээр ажиллана.
 *
 *   ?sort=recent   — шинэ нь эхэндээ (анхдагч: үзэгчээр)
 *   ?limit=6       — хэдийг буцаах (дээд тал нь 50)
 *   ?stats=1       — шууд дамжуулалт тус бүрийн зарагдсан лот, орлогыг хамт тооцно
 */
export const getMyLiveshows = async (c: Context) => {
    try {
        const userId = c.get("userId")
        const limit = Math.min(Math.max(Number(c.req.query("limit")) || 3, 1), 50)
        const recent = c.req.query("sort") === "recent"

        const shows = await Live_Show.find({ seller_id: userId, status: "ended" })
            .sort(recent ? { ended_at: -1, createdAt: -1 } : { viewer_count: -1 })
            .limit(limit)
            .lean()

        if (c.req.query("stats") !== "1") {
            return c.json({ data: shows }, 200)
        }

        // Шууд дамжуулалт тус бүрийн орлого нь тухайн шууд дамжуулалт дээр ЗАРАГДСАН лотуудын нийлбэр.
        const sold = await ProductListing.aggregate([
            {
                $match: {
                    status: "sold",
                    live_show_id: { $in: shows.map((show) => show._id) },
                },
            },
            {
                $group: {
                    _id: "$live_show_id",
                    soldCount: { $sum: 1 },
                    revenue: { $sum: { $ifNull: ["$current_highest_bid_coins", 0] } },
                },
            },
        ])

        const statsByShow = new Map(
            sold.map((row) => [String(row._id), { soldCount: row.soldCount, revenue: row.revenue }])
        )

        const data = shows.map((show) => ({
            ...show,
            ...(statsByShow.get(String(show._id)) ?? { soldCount: 0, revenue: 0 }),
        }))

        return c.json({ data }, 200)
    } catch (error) {
        console.error("getMyLiveshows алдаа:", error)
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }
}

export const getliveshowById = async (c: Context) => {
    try {
        const id = c.req.param("id")
        const data = await Live_Show.findById(id).populate("seller_id", "display_name avatar_url shop_name")
        if (!data) {
            return c.json({ message: "Live show olsongvi" }, 404)
        }
        return c.json({ data }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }

}
export const patchliveshow = async (c: Context) => {
    try {
        const id = c.req.param("id")
        const userId = c.get("userId")
        const body = await c.req.json()
        const { status, viewer_count, ended_at, thumbnail_url } = body

        const show = await Live_Show.findById(id)
        if (!show) {
            return c.json({ message: "Live show olsongvi" }, 404)
        }
        if (String(show.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ шууд дамжуулалтыг өөрчлөх эрхгүй байна" }, 403)
        }

        if (status !== undefined) show.status = status
        if (viewer_count !== undefined) show.viewer_count = viewer_count
        if (ended_at !== undefined) show.ended_at = ended_at
        // Шууд дамжуулалтын явцад худалдагчийн хөтөч камерын кадрыг тогтмол илгээж
        // байдаг (`useLiveThumbnail`) — картууд үүнийг зурна.
        if (thumbnail_url !== undefined) show.thumbnail_url = thumbnail_url

        await show.save()

        return c.json({ message: "Amjilttai shinechlelee", data: show }, 200)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }

}
export const postliveshow = async (c: Context) => {
    try {
        const seller_id = c.get("userId")
        const body = await c.req.json()
        const { title, thumbnail_url, livekit_room_name, viewer_count, category, tags, sponsored, status, started_at } = body
        if (!seller_id || !title || !livekit_room_name) {
            return c.json({
                message: "shaardlagtai medeelel dutuu bn"
            }, 400)

        }
        const data = await Live_Show.create({
            seller_id, title, thumbnail_url, livekit_room_name, viewer_count, category, tags, sponsored, status, started_at
        })
        return c.json({
            message: "Amjilttai hadgallaa", data
        }, 201)
    } catch (error) {
        return c.json({
            message: "Aldaa garlaa"
        }, 500)
    }

}

export const getParticipants = async (c: Context) => {
    try {
        const showId = c.req.param("id")

        let show = null
        try {
            show = await Live_Show.findById(showId)
        } catch (e) {
            console.log("Invalid showId format, trying fallback query:", showId)
        }

        if (!show) {
            return c.json({ error: "Live show not found" }, 404)
        }

        let viewerCount = 0

        if (show.livekit_room_name && show.status === "live") {
            try {
                const rooms = await listRoomsCached()
                const activeRoom = rooms.find((r) => r.name === show.livekit_room_name)

                if (activeRoom) {
                    viewerCount = activeRoom.numParticipants || 0
                    // Тоо өөрчлөгдөөгүй байхад бичих нь үзэгч бүрийн polling тутамд
                    // нэг бичилт үүсгэдэг — зөвхөн бодитоор өөрчлөгдсөн үед хадгална.
                    if (show.viewer_count !== viewerCount) {
                        show.viewer_count = viewerCount
                        await show.save()
                    }
                }
            } catch (error) {
                console.error("LiveKit өрөөний мэдээлэл авч чадсангүй:", error)
            }
        }

        return c.json({
            showId,
            viewerCount,
            participantCount: viewerCount,
            status: show.status,
            roomName: show.livekit_room_name
        }, 200)
    } catch (error) {
        console.error("getParticipants алдаа:", error)
        return c.json({ message: "Үзэгчийн тоог уншиж чадсангүй" }, 500)
    }
}

export const getAccessToken = async (c: Context) => {
    try {
        const showId = c.req.param("id")
        const body = await c.req.json().catch(() => ({}))
        const user = c.get("user")

        let show = null
        try {
            show = await Live_Show.findById(showId)
        } catch (e) {
            console.log("Invalid showId format:", showId)
        }

        if (!show) {
            return c.json({ message: "Live show olsongvi" }, 404)
        }

        if (!show.livekit_room_name) {
            return c.json({ message: "Энэ шууд дамжуулалт шууд дамжуулалттай холбогдоогүй байна" }, 400)
        }

        // Дамжуулах эрхийг ЗӨВХӨН сервер шийднэ: шууд дамжуулалтын эзэн мөн эсэх.
        // Өмнө нь клиент `canPublish`-ээ өөрөө сонгож, `/live/:room?host=1`
        // гэж хаяг бичсэн ямар ч хүн өөр хүний өрөөнд нэвтэрч дамжуулах
        // боломжтой байв.
        const isHost = !!user && String(show.seller_id) === String(user._id)

        // Эхлээгүй/дууссан шууд дамжуулалтыг үзэгчид үзэх зүйлгүй. Харин эзэн нь орж
        // чадах ёстой — staleness цэвэрлэгээ шууд дамжуулалтыг "ended" болгосон ч
        // худалдагч дахин холбогдож үргэлжлүүлнэ.
        if (!isHost && show.status !== "live") {
            return c.json({ message: "Шууд дамжуулалт одоогоор явагдаагүй байна" }, 409)
        }

        // Identity-г ХЭЗЭЭ Ч клиентээс авахгүй: өмнө нь бие дэх `identity`-г
        // шууд token-д бичдэг байсан тул хэн ч эвэнтийн эзний identity-г дуурайж
        // дамжуулж буй худалдагчийг өрөөнөөс шахаж гаргах боломжтой байв.
        // LiveKit-д нэг өрөөнд identity давхцвал өмнөх холболт таслагддаг.
        const identity = isHost ? `host-${user._id}` : `viewer-${randomUUID()}`

        // Нэр зөвхөн харагдацын зориулалттай — нэвтэрсэн бол профайлаас нь авна,
        // зочны өгсөн нэрийг хязгаарлаж цэвэрлэнэ.
        const name =
            user?.display_name ||
            (typeof body?.name === "string" ? body.name.trim().slice(0, 40) : "") ||
            "Зочин"

        const at = new AccessToken(
            process.env.LIVEKIT_API_KEY!,
            process.env.LIVEKIT_API_SECRET!,
            { identity, name, ttl: "1h" }
        )

        at.addGrant({
            room: show.livekit_room_name,
            roomJoin: true,
            canPublish: isHost,
            canSubscribe: true,
            canPublishData: true
        })

        const token = await at.toJwt()

        return c.json({
            token,
            url: process.env.LIVEKIT_URL,
            roomName: show.livekit_room_name,
            isHost
        }, 200)
    } catch (error) {
        console.error("GetAccessToken error:", error)
        return c.json({ message: "Шууд дамжуулалтад холбогдож чадсангүй" }, 500)
    }
}
