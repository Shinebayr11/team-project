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
  }
}

export const getWatchPath = (show: HomeShow): string =>
  show.showId
    ? `/live-view/${show.showId}`
    : `/`
