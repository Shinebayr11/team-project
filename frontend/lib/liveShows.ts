import { HomeShow } from "@/types"

export interface LiveShowSeller {
  /** Дагах/чат зэрэг бодит үйлдлүүд нэрээр биш, зөвхөн үүгээр ажиллана. */
  _id?: string
  display_name?: string
  shop_name?: string
  avatar_url?: string
}

/**
 * Худалдааны хэлбэр. Худалдагч эфирт орохын өмнө сонгодог (`ShowTypePicker`)
 * бөгөөд эфирийн ДОТОР юу харагдахыг энэ шийднэ.
 */
export type ShowType = "auction" | "buy_it_now" | "mixed"

/** Дуудлага худалдааны самбар, лот гаргах хэсэг харагдах эсэх. */
export const allowsAuction = (type?: ShowType | string) => type !== "buy_it_now"

/** Барааг тогтсон үнээр шууд авах товч гарах эсэх. */
export const allowsBuyNow = (type?: ShowType | string) => type !== "auction"

export interface LiveShowDoc {
  _id: string
  title: string
  type?: ShowType
  status?: string
  thumbnail_url?: string
  viewer_count?: number
  started_at?: string
  category?: string
  tags?: string
  sponsored?: boolean
  seller_id?: LiveShowSeller | string
  livekit_room_name?: string
  createdAt?: string
}

/**
 * Шууд эфир хамгийн ихдээ хэдэн цаг үргэлжлэх боломжтой вэ. Үүнээс хэтэрсэн
 * "live" бичлэг бол эфир нь тасарсан/унтарсан ч төлөв нь буцаж шинэчлэгдээгүй
 * гацсан мөр гэсэн үг.
 */
const LIVE_MAX_HOURS = 12

/**
 * Нүүрний тэжээлд гаргах эсэх.
 *
 * `/api/liveshow` нь хэзээ ч үүссэн БҮХ эфирийг буцаадаг — дууссан нь ч,
 * өгөгдлийн санд гараар нэмэгдсэн туршилтын мөр ч. Хоёр тохиолдлыг шүүнэ:
 *
 * 1. Төлөвгүй мөр — аппаар үүссэн эфир үргэлж төлөвтэй байдаг тул эдгээр нь
 *    бодит дамжуулалт биш (`toHomeShow` тэднийг "Scheduled" гэсэн хуурамч
 *    ангилалд хийж, нүүрний эхэнд гаргачихдаг).
 * 2. Хэт удаан "live" байгаа мөр — доорх хугацаанаас хэтэрсэн бол гацсан.
 */
export const isOnAir = (doc: LiveShowDoc): boolean => {
  if (doc.status !== "live") return false
  const startedAt = doc.started_at ?? doc.createdAt
  if (!startedAt) return false
  const hours = (Date.now() - new Date(startedAt).getTime()) / 3_600_000
  return hours < LIVE_MAX_HOURS
}

export const toHomeShow = (doc: LiveShowDoc): HomeShow => {
  const seller =
    typeof doc.seller_id === "object" && doc.seller_id?.display_name
      ? doc.seller_id.display_name
      : "Seller"
  const sellerId =
    typeof doc.seller_id === "string" ? doc.seller_id : doc.seller_id?._id
  const isLive = doc.status === "live"

  return {
    seller,
    sellerId,
    title: doc.title,
    category: doc.category || (isLive ? "General" : "Scheduled"),
    tags: doc.tags || "",
    thumbnail: doc.thumbnail_url,
    sponsored: doc.sponsored,
    live: isLive ? (doc.viewer_count ?? 0) : undefined,
    at:
      !isLive && doc.started_at
        ? new Date(doc.started_at).toLocaleString()
        : undefined,
    roomId: doc.livekit_room_name,
    showId: doc._id,
    // `/sell`-ээс эхлүүлсэн шууд дамжуулалт `started_at`-гүй үүсэж болох тул `createdAt`
    // нөөцөд байна — аль нэг нь үргэлж байдаг (schema дээр `timestamps: true`).
    startedAt: doc.started_at ?? doc.createdAt,
  }
}

// Browse (`/live-show`) ямар ч LiveKit өгөгдөл ашигладаггүй, зөвхөн хатуу
// тогтоосон REEL_SHOWS mock-оор ажилладаг тул бодит шууд дамжуулалтыг зөв
// харуулж чадахгүй — тиймээс бодит room-той (roomId) шууд дамжуулалтыг зөвхөн жинхэнэ
// видео дэлгэц рүү, roomId-гүй (mock/жишээ) шууд дамжуулалтыг Browse рүү оруулна.
//
// `/live/:room?host=0` нь ХУДАЛДАГЧИЙН биш — `host=0` үед `LiveViewer`
// (худалдагчийн самбар, барааны жагсаалт, дуудлага худалдаа, чат) ордог.
// `ba41d93` үүнийг "broadcaster page" гэж андуураад OBS үеийн нүцгэн
// `/live-view/:id` рүү шилжүүлсэн тул үзэгчийн бүх загвар алга болсон юм.
export const getWatchPath = (show: HomeShow): string =>
  show.roomId
    ? `/live/${show.roomId}?host=0&title=${encodeURIComponent(show.title)}` +
      (show.showId ? `&showId=${show.showId}` : "")
    : `/live-show?show=${encodeURIComponent(show.seller)}`
