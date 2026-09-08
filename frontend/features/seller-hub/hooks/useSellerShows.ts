"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "@/hooks/useApiClient"

/** Дууссан шууд дамжуулалт, түүний борлуулалтын дүнтэй хамт. */
export interface SellerShowSummary {
  _id: string
  title?: string
  category?: string
  viewer_count?: number
  started_at?: string
  ended_at?: string
  createdAt?: string
  /** Тухайн шууд дамжуулалт дээр зарагдсан лотын тоо, нийлбэр орлого. */
  soldCount: number
  revenue: number
}

const RECENT_LIMIT = 6

/**
 * Худалдагчийн сүүлийн шууд дамжуулалтууд — Ерөнхий тойм хуудсанд.
 *
 * Шууд дамжуулалт тус бүрийн орлогыг сервер дээр нэг л удаа тооцно; урьд нь энэ хуудас
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
      .catch((error) => console.error("Шууд дамжуулалтууд уншиж чадсангүй:", error))
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
