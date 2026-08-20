"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useApiClient } from "@/hooks/useApiClient"
import { readDisplayName } from "@/hooks/useDisplayName"

export const UserSync: React.FC = () => {
  const { isLoaded, user } = useUser()
  const { callApi } = useApiClient()
  const syncedFor = useRef<string | null>(null)

  // The name the user typed for themselves wins; re-sync whenever it changes so
  // our copy never lags behind Clerk.
  const chosenName = readDisplayName(user?.unsafeMetadata)
  const displayName =
    chosenName ?? user?.fullName ?? user?.username ?? "Хэрэглэгч"

  useEffect(() => {
    if (!isLoaded || !user) return
    const syncKey = `${user.id}:${displayName}`
    if (syncedFor.current === syncKey) return
    syncedFor.current = syncKey

    callApi("/api/users", {
      method: "POST",
      body: JSON.stringify({
        display_name: displayName,
        avatar_url: user.imageUrl,
      }),
    }).catch((error) => {
      console.error("User sync failed:", error)
      syncedFor.current = null
    })
  }, [isLoaded, user, callApi, displayName])

  return null
}
