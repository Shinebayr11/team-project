import { useState, useCallback } from "react"

export interface StreamingStatus {
  showId: string
  liveStatus: "idle" | "ingress_created" | "streaming" | "ingress_failed" | "stopped"
  roomName?: string
  ingressId?: string
  egressId?: string
  facebookEgressStatus?: string
  errors?: {
    liveError?: string
    facebookEgressError?: string
  }
}

export const useStreaming = () => {
  const [status, setStatus] = useState<StreamingStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createIngress = useCallback(
    async (showId: string, sellerName: string) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/streaming/${showId}/ingress/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ showId, sellerName }),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Failed to create ingress")
        }

        const data = await res.json()
        return data
      } catch (err: any) {
        const message = err.message || "Failed to create ingress"
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getStatus = useCallback(async (showId: string) => {
    try {
      const res = await fetch(`/api/streaming/${showId}/status`)
      if (!res.ok) throw new Error("Failed to get status")

      const data = await res.json()
      setStatus(data)
      return data
    } catch (err: any) {
      setError(err.message || "Failed to get status")
      throw err
    }
  }, [])

  const stopStreaming = useCallback(async (showId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/streaming/${showId}/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to stop streaming")
      }

      setStatus(null)
      return await res.json()
    } catch (err: any) {
      const message = err.message || "Failed to stop streaming"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    status,
    loading,
    error,
    createIngress,
    getStatus,
    stopStreaming,
  }
}
