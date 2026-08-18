import { Eye } from "lucide-react"

import { Link } from "@/lib/router"
import { LiveDot } from "@/components/ui/LiveDot"
import type { HomeShow } from "@/types"

/**
 * A single live show on the landing page. Deliberately links straight into the
 * public watch page — signing in is only asked for later, at bid time.
 */
export function LiveShowCard({ show }: { show: HomeShow }) {
  return (
    <Link to={`/live-show?show=${show.seller}`} className="group flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-[var(--wn-shot)]">
        {show.thumbnail && (
          <img
            src={show.thumbnail}
            alt={show.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-[600] text-white backdrop-blur-md">
          <LiveDot />
          <span>Шууд</span>
        </div>

        <div className="absolute right-3 bottom-3 z-10 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-[600] text-white backdrop-blur-md">
          <Eye className="h-3.5 w-3.5" />
          {show.live}
        </div>
      </div>

      <h3 className="mt-3 text-[15px] leading-tight font-[700] text-[var(--wn-ink)]">
        {show.title}
      </h3>
      <div className="mt-1 flex items-center gap-1.5 text-[13px]">
        <span className="font-[600] text-[var(--wn-accent)]">
          {show.category}
        </span>
        <span className="text-[var(--wn-ink-4)]">•</span>
        <span className="truncate text-[var(--wn-ink-3)]">@{show.seller}</span>
      </div>
    </Link>
  )
}
