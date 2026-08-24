"use client"

import { BarChart3, Eye } from "lucide-react"
import { useMyShows } from "@/hooks/useMyShows"

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return ""
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${Math.max(diffMin, 0)} мин өмнө`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} цагийн өмнө`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 30) return `${diffDay} өдрийн өмнө`
  const diffMonth = Math.floor(diffDay / 30)
  return `${diffMonth} сарын өмнө`
}

/**
 * Худалдагчийн хамгийн их үзэлттэй 3 шоу. Шинэ шоу эхлүүлэхийн өмнө хамгийн
 * амжилттай байснаа санах боломж өгнө.
 */
export function PastShows({ className = "" }: { className?: string }) {
  const { shows, loading } = useMyShows()

  return (
    <div
      className={`relative overflow-x-hidden overflow-y-auto rounded-[24px] border border-[var(--wn-line)] bg-[linear-gradient(160deg,#ffffff_0%,#eff6ff_50%,#f5f0ff_100%)] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
    >
      <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-[#6366f1]/10 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0ea5e9_0%,#6366f1_50%,#5b3fe0_100%)]" />

      <div className="relative">
        <h2 className="font-display text-[18px] font-[800] tracking-tight text-[var(--wn-ink)]">
          Хамгийн их үзэлттэй шоунууд
        </h2>
        <p className="mt-1 text-[14px] text-[var(--wn-ink-3)]">
          Өмнөх шоунуудаасаа хамгийн амжилттай 3-ыг харна уу.
        </p>
      </div>

      <div className="relative mt-4 flex flex-col gap-2">
        {loading ? (
          <p className="text-[14px] text-[var(--wn-ink-3)]">Уншиж байна...</p>
        ) : shows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--wn-line-3)] p-6 text-center">
            <BarChart3 className="mx-auto size-6 text-[var(--wn-ink-3)]" />
            <p className="mt-2 text-[14px] text-[var(--wn-ink-3)]">
              Дуусгасан шоу байхгүй байна.
            </p>
          </div>
        ) : (
          shows.map((show) => (
            <div
              key={show._id}
              className="flex items-center gap-3 rounded-xl border border-[var(--wn-line)] bg-white px-4 py-3"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff]">
                <Eye className="size-4 text-[#6366f1]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-[600] text-[var(--wn-ink)]">
                  {show.title}
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--wn-ink-3)]">
                  {show.category ? `${show.category} · ` : ""}
                  {formatRelativeTime(show.ended_at ?? show.started_at)}
                </p>
              </div>
              <span className="shrink-0 text-[14px] font-[700] text-[var(--wn-ink-3)]">
                {show.viewer_count ?? 0} үзэгч
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
