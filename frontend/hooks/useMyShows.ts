"use client"

import { useCallback, useState } from "react"
import { useApiClient } from "./useApiClient"
import { useLoad } from "./useLoad"

export interface PastShow {
  _id: string
  title: string
  category?: string
  viewer_count?: number
  ended_at?: string
  started_at?: string
}

/**
 * Худалдагчийн дуусгасан шууд дамжуулалтуудаас хамгийн их үзэлттэй 3. /sell дээр шинэ
 * шууд дамжуулалт эхлүүлэхийн өмнө өмнөх дүнгээ харах зорилготой.
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
      console.error("Өмнөх шууд дамжуулалт уншиж чадсангүй:", error)
    } finally {
      setLoading(false)
    }
  }, [callApi])

  useLoad(refresh)

  return { shows, loading, refresh }
}
