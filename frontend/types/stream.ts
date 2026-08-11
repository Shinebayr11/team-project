export type StreamStatus =
  | { kind: "live"; viewers: number }
  | { kind: "scheduled"; startsAt: string; savedCount?: number }

export type StreamBadge = "sponsored" | "estate_sales"

export interface Seller {
  username: string
  avatarUrl?: string
}

export interface Stream {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  seller: Seller
  categorySlug: string
  badge?: StreamBadge
  status: StreamStatus
}

export interface Category {
  slug: string
  name: string
  icon: string
}
