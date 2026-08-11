"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { StreamCard } from "./stream-card"
import { cn } from "@/lib/utils"
import type { Stream } from "@/types/stream"

interface StreamRowProps {
  title: string
  streams: Stream[]
  href?: string
  live?: boolean
}

export function StreamRow({ title, streams, href, live }: StreamRowProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = () => {
    const el = scroller.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    update()
    const el = scroller.current
    if (!el) return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [streams.length])

  const scroll = (dir: -1 | 1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  if (streams.length === 0) return null

  return (
    <section className="group/row">
      <div className="mb-3 flex items-center gap-3 px-10">
        {live && (
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
        )}

        <h2 className="text-lg font-bold tracking-tight">{title}</h2>

        {href && (
          <Link
            href={href}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Бүгдийг үзэх
          </Link>
        )}

        <div className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover/row:opacity-100">
          <button
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            aria-label="Зүүн тийш"
            className="rounded-full border p-1.5 transition-colors hover:bg-accent disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canRight}
            aria-label="Баруун тийш"
            className="rounded-full border p-1.5 transition-colors hover:bg-accent disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={update}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto px-10 pb-2",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {streams.map((s) => (
          <div
            key={s.id}
            className="w-[220px] shrink-0 snap-start sm:w-[240px]"
          >
            <StreamCard stream={s} />
          </div>
        ))}
      </div>
    </section>
  )
}
