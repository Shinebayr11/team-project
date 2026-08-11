import { StreamCard } from "./stream-card"
import type { Stream } from "@/types/stream"

export function StreamGrid({ streams }: { streams: Stream[] }) {
  if (streams.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Одоогоор шоу байхгүй байна.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {streams.map((s) => (
        <StreamCard key={s.id} stream={s} />
      ))}
    </div>
  )
}
