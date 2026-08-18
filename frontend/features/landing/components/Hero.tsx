import { Play } from "lucide-react"

import { Link } from "@/lib/router"
import { LiveDot } from "@/components/ui/LiveDot"
import type { HomeShow } from "@/types"

interface HeroProps {
  liveCount: number
  watching: number
  featured?: HomeShow
}

export function Hero({ liveCount, watching, featured }: HeroProps) {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--wn-live-soft)] px-3.5 py-1.5 text-[13px] font-[700] text-[var(--wn-live)]">
          <LiveDot />
          {liveCount} шоу яг одоо эфирт
        </div>

        <h1 className="font-display mt-5 text-[44px] leading-[1.05] font-[800] tracking-[-0.045em] text-[var(--wn-ink)] sm:text-[56px] lg:text-[64px]">
          Шууд эфирээс
          <br />
          шууд худалдан ав
        </h1>

        <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-[var(--wn-ink-2)]">
          Дуудлага худалдаа, ховор эд, шинэ бараа — бүгд шууд дамжуулалтаар.
          Худалдагчтай ярилцаж, үнэ хаялцаж, тухайн агшинд нь аваарай.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/live-show"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--wn-accent)] px-6 py-3.5 text-[16px] font-[700] text-white transition-colors hover:bg-[var(--wn-accent-hover)]"
          >
            <Play className="h-4 w-4 fill-current" />
            Шууд шоу үзэх
          </Link>
          <Link
            to="/sign-up"
            className="rounded-full border border-[var(--wn-line-3)] bg-white px-6 py-3.5 text-[16px] font-[700] text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-surface-2)]"
          >
            Бүртгүүлэх
          </Link>
        </div>

        <p className="mt-4 text-[14px] font-[500] text-[var(--wn-ink-4)]">
          Үзэхэд бүртгэл шаардлагагүй · {watching.toLocaleString("mn-MN")} хүн
          одоо үзэж байна
        </p>
      </div>

      {featured && (
        <Link
          to={`/live-show?show=${featured.seller}`}
          className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-[var(--wn-shot)] lg:aspect-[4/4.4]"
        >
          {featured.thumbnail && (
            <img
              src={featured.thumbnail}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

          <div className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full bg-[var(--wn-live)] px-3 py-1.5 text-[12px] font-[800] tracking-wide text-white uppercase">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
            Live
          </div>

          <div className="absolute right-5 bottom-5 left-5 text-white">
            <div className="text-[13px] font-[600] opacity-80">
              @{featured.seller} · {featured.live} үзэж байна
            </div>
            <div className="mt-1 text-[22px] leading-tight font-[800]">
              {featured.title}
            </div>
          </div>
        </Link>
      )}
    </section>
  )
}
