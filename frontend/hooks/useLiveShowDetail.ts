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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/liveshow/${showId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setShow(d.data ?? null)
      })
      .catch(() => {
        // A missing show just means the side panel falls back to URL params.
      })

    return () => {
      cancelled = true
    }
  }, [showId])

  return show
}
