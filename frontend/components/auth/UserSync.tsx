"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useApiClient } from "@/hooks/useApiClient"

export const UserSync: React.FC = () => {
  const { isLoaded, user } = useUser()
  const { callApi } = useApiClient()
  const syncedFor = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !user || syncedFor.current === user.id) return
    syncedFor.current = user.id

    callApi("/api/users", {
      method: "POST",
      body: JSON.stringify({
        display_name: user.fullName ?? user.username ?? "Хэрэглэгч",
        avatar_url: user.imageUrl,
      }),
    }).catch((error) => {
      console.error("User sync failed:", error)
      syncedFor.current = null
    })
  }, [isLoaded, user, callApi])

  return null
}
