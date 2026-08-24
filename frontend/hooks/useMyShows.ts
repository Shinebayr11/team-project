"use client"

import { useCallback, useEffect, useState } from "react"
import { useApiClient } from "./useApiClient"

export interface PastShow {
  _id: string
  title: string
  category?: string
  viewer_count?: number
  ended_at?: string
  started_at?: string
}

/**
 * Худалдагчийн дуусгасан шоунуудаас хамгийн их үзэлттэй 3. /sell дээр шинэ
 * шоу эхлүүлэхийн өмнө өмнөх дүнгээ харах зорилготой.
 */
export function useMyShows() {
  const { callApi } = useApiClient()
  const [shows, setShows] = useState<PastShow[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { data } = await callApi<{ data: PastShow[] }>("/api/liveshow/mine")
      setShows(data)
    } catch (error) {
      console.error("Өмнөх шоу уншиж чадсангүй:", error)
    } finally {
      setLoading(false)
    }
  }, [callApi])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { shows, loading, refresh }
}
