"use client"

import { useCallback } from "react"
import { useAuth } from "@clerk/nextjs"
import { apiFetch } from "@/lib/api"

export function useApiClient() {
  const { getToken } = useAuth()

  const callApi = useCallback(
    async <T,>(path: string, options?: RequestInit): Promise<T> => {
      const token = await getToken()
      return apiFetch<T>(path, options, token)
    },
    [getToken]
  )

  return { callApi }
}
