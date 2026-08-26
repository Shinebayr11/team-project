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
 * Худалдагчийн хамгийн их үзэлттэй 3 лайв. Шинэ лайв эхлэхийн өмнө хамгийн
 * амжилттай байснаа санах боломж өгнө.
 */
export function PastShows({ className = "" }: { className?: string }) {
  const { shows, loading } = useMyShows()

  return (
    <div
      className={`overflow-x-hidden overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div>
        <h2 className="text-[16px] font-[800] text-black">
          Хамгийн их үзэлттэй лайвууд
        </h2>
        <p className="mt-1 text-[14px] font-[500] text-gray-500">
          Өмнөх лайвуудаасаа хамгийн амжилттай 3-ыг харна уу.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {loading ? (
          <p className="text-[14px] font-[500] text-gray-500">Уншиж байна...</p>
        ) : shows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
            <BarChart3 className="mx-auto size-6 text-gray-500" />
            <p className="mt-2 text-[14px] font-[500] text-gray-500">
              Дуусгасан лайв байхгүй байна.
            </p>
          </div>
        ) : (
          shows.map((show) => (
            <div
              key={show._id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Eye className="size-4 text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-[600] text-black">
                  {show.title}
                </p>
                <p className="mt-0.5 text-[12px] font-[500] text-gray-500">
                  {show.category ? `${show.category} · ` : ""}
                  {formatRelativeTime(show.ended_at ?? show.started_at)}
                </p>
              </div>
              <span className="shrink-0 text-[14px] font-[700] text-gray-500">
                {show.viewer_count ?? 0} үзэгч
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
