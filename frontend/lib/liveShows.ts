import { HomeShow } from "@/types"

export interface LiveShowSeller {
  display_name?: string
  avatar_url?: string
}

export interface LiveShowDoc {
  _id: string
  title: string
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

export const toHomeShow = (doc: LiveShowDoc): HomeShow => {
  const seller =
    typeof doc.seller_id === "object" && doc.seller_id?.display_name
      ? doc.seller_id.display_name
      : "Seller"
  const isLive = doc.status === "live"

  return {
    seller,
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
    // `/sell`-ээс эхлүүлсэн шоу `started_at`-гүй үүсэж болох тул `createdAt`
    // нөөцөд байна — аль нэг нь үргэлж байдаг (schema дээр `timestamps: true`).
    startedAt: doc.started_at ?? doc.createdAt,
  }
}

// Browse (`/live-show`) ямар ч LiveKit өгөгдөл ашигладаггүй, зөвхөн хатуу
// тогтоосон REEL_SHOWS mock-оор ажилладаг тул бодит дамжуулалтыг зөв
// харуулж чадахгүй — тиймээс бодит room-той (roomId) шоуг зөвхөн жинхэнэ
// видео дэлгэц рүү, roomId-гүй (mock/жишээ) шоуг Browse рүү оруулна.
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
