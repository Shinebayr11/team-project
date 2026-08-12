"use client"

import { CategorySidebar } from "@/components/layout/category-sidebar"
import { StreamRow } from "@/components/browse/stream-row"
import { CATEGORIES, MOCK_STREAMS, MOCK_FOLLOWED } from "@/lib/mock-data"

export default function HomePage() {
  const followedNames = new Set(MOCK_FOLLOWED.map((f) => f.username))

  const followedLive = MOCK_STREAMS.filter(
    (s) => s.status.kind === "live" && followedNames.has(s.seller.username)
  )
  const live = MOCK_STREAMS.filter(
    (s) => s.status.kind === "live" && !followedNames.has(s.seller.username)
  )
  const soon = MOCK_STREAMS.filter((s) => s.status.kind === "scheduled")

  return (
    <div className="flex">
      <CategorySidebar categories={CATEGORIES} />

      <main className="min-w-0 flex-1 space-y-10 py-8">
        <StreamRow
          title="Дагаж буй хүмүүс шууд"
          streams={followedLive}
          href="/following"
          live
        />
        <StreamRow title="Одоо шууд" streams={live} href="/browse" live />
        <StreamRow title="Удахгүй эхлэх" streams={soon} href="/browse" />
      </main>
    </div>
  )
}
