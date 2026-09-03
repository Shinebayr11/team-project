"use client"

import { useEffect, useState } from "react"
import { LiveShowDoc } from "@/lib/liveShows"

/**
 * One live show straight from the API. Uses a plain fetch (not useApiClient) so
 * signed-out visitors arriving from the landing page can watch too — the
 * GET route is public.
 */
export function useLiveShowDetail(showId?: string) {
  const [show, setShow] = useState<LiveShowDoc | null>(null)

  useEffect(() => {
    if (!showId) return
    let cancelled = false

    const fetchShow = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/liveshow/${showId}`)
        const d = await res.json()
        if (!cancelled) setShow(d.data ?? null)
      } catch {
        // A missing show just means the side panel falls back to URL params.
      }
    }

    // Үзэгчийн тоо зэрэг шууд өөрчлөгддөг өгөгдлийг сэргээж байхын тулд давтан татна.
    fetchShow()
    const interval = setInterval(fetchShow, 2000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [showId])

  return show
}
