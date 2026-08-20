"use client"

import { useEffect, useState } from "react"

/** Mints a LiveKit access token for a room. Hosts get publish rights, viewers don't. */
export function useLiveKitToken(roomName: string, isHost: boolean) {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/livekit/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomName,
        identity: `${isHost ? "host" : "viewer"}-${Math.random().toString(36).slice(2, 8)}`,
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
  }, [roomName, isHost])

  return { token, error }
}
