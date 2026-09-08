"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "@/hooks/useApiClient"

/** Дууссан дамжуулалт, түүний борлуулалтын дүнтэй хамт. */
export interface SellerShowSummary {
  _id: string
  title?: string
  category?: string
  viewer_count?: number
  started_at?: string
  ended_at?: string
  createdAt?: string
  /** Тухайн дамжуулалт дээр зарагдсан лотын тоо, нийлбэр орлого. */
  soldCount: number
  revenue: number
}

const RECENT_LIMIT = 6

/**
 * Худалдагчийн сүүлийн дамжуулалтууд — Ерөнхий тойм хуудсанд.
 *
 * Дамжуулалт тус бүрийн орлогыг сервер дээр нэг л удаа тооцно; урьд нь энэ хуудас
 * `data/seedShows.ts` жишээ өгөгдлөөс уншдаг байсан.
 */
export function useSellerShows() {
  const { callApi } = useApiClient()
  const { isLoaded, isSignedIn } = useUser()
  const [shows, setShows] = useState<SellerShowSummary[]>([])
  const [settled, setSettled] = useState(false)

  const refresh = useCallback(async () => {
    const { data } = await callApi<{ data: SellerShowSummary[] }>(
      `/api/liveshow/mine?sort=recent&limit=${RECENT_LIMIT}&stats=1`
    )
    setShows(data)
  }, [callApi])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    refresh()
      .catch((error) => console.error("Дамжуулалтууд уншиж чадсангүй:", error))
      .finally(() => {
        if (!cancelled) setSettled(true)
      })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, refresh])

  return {
    shows,
    loading: !isLoaded || (isSignedIn === true && !settled),
    refresh,
  }
}
