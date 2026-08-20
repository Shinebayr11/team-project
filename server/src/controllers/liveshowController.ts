import { Context } from "hono"
import { RoomServiceClient } from "livekit-server-sdk"
import { Live_Show } from "../models/Live_show.js"

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

export const getliveshow = async (c: Context) => {
    try {
        // Home feed-д зөвхөн одоо шууд явж буй (status: "live"), эсвэл эхлэх цаг нь
        // тохируулагдсан (started_at) шоунуудыг харуулна — цаг/төлөвгүй бэлэн бус
        // (draft) баримтуудыг нуух. Дууссан (ended) шоуг үргэлж хасна.
        const data = await Live_Show.find({
            status: { $ne: "ended" },
            $or: [{ status: "live" }, { started_at: { $ne: null } }],
        }).populate("seller_id", "display_name avatar_url shop_name")

        // status: "live" гэдэг нь зөвхөн DB-д ингэж тэмдэглэгдсэн гэсэн үг —
        // хэрэглэгч "Дуусгах"-г дарахгүйгээр таб-аа хаавал мөр нь мөнхөд "live"
        // хэвээр үлддэг. Иймд LiveKit-ээс яг одоо идэвхтэй байгаа room-уудтай
        // тулгаж, бодитоор дамжуулж буй биш "live" мөрүүдийг хасаж, DB-г засна.
        // livekit_room_name-гүй "live" мөрүүд бодит дамжуулалт хэзээ ч байгаагүй
        // (жишээ нь mock/demo өгөгдөл) тул шалгах room алга — эдгээрийг алгасна.
        // Дөнгөж үүссэн (GRACE хугацаанаас цөөн) мөрүүдийг ч алгасна — race condition-оос сэргийлнэ.
        const liveDocs = data.filter(
            (show) =>
                show.status === "live" &&
                show.livekit_room_name &&
                Date.now() - new Date(show.createdAt).getTime() > STALE_CHECK_GRACE_MS,
        )
        if (liveDocs.length > 0) {
            try {
                const activeRooms = await roomService.listRooms()
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
        const { status, viewer_count, ended_at } = body

        const show = await Live_Show.findById(id)
        if (!show) {
            return c.json({ message: "Live show olsongvi" }, 404)
        }
        if (String(show.seller_id) !== String(userId)) {
            return c.json({ message: "Энэ шоуг өөрчлөх эрхгүй байна" }, 403)
        }

        if (status !== undefined) show.status = status
        if (viewer_count !== undefined) show.viewer_count = viewer_count
        if (ended_at !== undefined) show.ended_at = ended_at

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