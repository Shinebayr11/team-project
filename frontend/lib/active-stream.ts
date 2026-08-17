import type { Stream } from "@/types/stream"

export type ActiveStream = { roomName: string; title: string }

export function getActiveStream(): ActiveStream | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("activeStream")
  return raw ? JSON.parse(raw) : null
}

export function toStreamCard(active: ActiveStream, username: string): Stream {
  return {
    id: active.roomName,
    title: active.title,
    thumbnailUrl: "https://picsum.photos/seed/mylive/800/600",
    seller: { username, rating: 5.0 },
    categorySlug: "live",
    status: { kind: "live", viewers: 1 },
    auction: {
      currentBidMnt: 0,
      bidCount: 0,
      endsAt: new Date(Date.now() + 3_600_000).toISOString(),
    },
  }
}
