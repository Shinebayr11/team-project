"use client"

import { useEffect, useState } from "react"
import { useDisplayName } from "./useDisplayName"

/**
 * Mints a LiveKit access token for a room. Hosts get publish rights, viewers
 * don't. The signed-in user's name rides along so chat shows people rather
 * than random identities.
 */
export function useLiveKitToken(roomName: string, isHost: boolean) {
  const { displayName, isLoaded } = useDisplayName()
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Wait for Clerk: fetching first would mint a token named "Зочин" and then
    // reconnect the room once the real name arrived.
    if (!isLoaded) return
    let cancelled = false

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/livekit/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomName,
        // Identity must be unique within a room — two tabs of one user would
        // otherwise evict each other, so it stays random.
        identity: `${isHost ? "host" : "viewer"}-${Math.random().toString(36).slice(2, 8)}`,
        name: displayName,
        canPublish: isHost,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setToken(d.token)
      })
      .catch((e) => {
        if (!cancelled) setError(String(e))
      })

    return () => {
      cancelled = true
    }
  }, [roomName, isHost, displayName, isLoaded])

  return { token, error }
}
