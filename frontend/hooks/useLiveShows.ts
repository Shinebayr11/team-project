"use client"

import { useEffect, useState } from "react"
import { HomeShow } from "@/types"
import { LiveShowDoc, toHomeShow } from "@/lib/liveShows"
import { MOCK_SHOWS } from "@/data/mockShows"
import { useApiClient } from "./useApiClient"

export function useLiveShows() {
  const { callApi } = useApiClient()
  const [shows, setShows] = useState<HomeShow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    callApi<{ data: LiveShowDoc[] }>("/api/liveshow")
      .then((res) => {
        // Үзүүлэн эфирүүд ЖИНХЭНЭ өгөгдлийн АРД залгагдана: бодит дамжуулалт
        // ангилал дотроо үргэлж түрүүлж харагдана. Дэлгэрэнгүйг
        // `data/mockShows.ts`-ээс.
        if (!cancelled) setShows([...res.data.map(toHomeShow), ...MOCK_SHOWS])
      })
      .catch((err) => {
        // Backend унасан ч нүүр хуудас хоосон харагдахгүй.
        if (!cancelled) {
          setError(String(err))
          setShows(MOCK_SHOWS)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [callApi])

  return { shows, loading, error }
}
