import { ArrowRight } from "lucide-react"

import { Link } from "@/lib/router"
import type { HomeShow } from "@/types"

import { LiveShowCard } from "./LiveShowCard"

export function LiveNow({ shows }: { shows: HomeShow[] }) {
  if (shows.length === 0) return null

  return (
    <section className="border-t border-[var(--wn-line)] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[30px] font-[800] tracking-[-0.03em] text-[var(--wn-ink)]">
              Одоо шууд эфирт
            </h2>
            <p className="mt-1.5 text-[15px] text-[var(--wn-ink-3)]">
              Нэвтрэхгүйгээр шууд орж үзээрэй.
            </p>
          </div>

          <Link
            to="/live-show"
            className="hidden shrink-0 items-center gap-1.5 text-[15px] font-[700] text-[var(--wn-accent)] hover:underline sm:inline-flex"
          >
            Бүгдийг үзэх
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {shows.map((show) => (
            <LiveShowCard key={show.seller} show={show} />
          ))}
        </div>
      </div>
    </section>
  )
}
