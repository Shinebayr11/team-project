"use client"

import { useEffect, useState } from "react"
import { HomeShow } from "@/types"
import { LiveShowDoc, toHomeShow } from "@/lib/liveShows"
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
        if (!cancelled) setShows(res.data.map(toHomeShow))
      })
      .catch((err) => {
        if (!cancelled) setError(String(err))
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
