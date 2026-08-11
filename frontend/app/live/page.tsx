"use client"

import { useEffect, useState } from "react"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"

export default function LivePage() {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/livekit/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomName: "test",
        identity: `user-${Math.random().toString(36).slice(2, 8)}`,
        canPublish: true,
      }),
    })
      .then((r) => r.json())
      .then((d) => setToken(d.token))
      .catch((e) => setError(String(e)))
  }, [])

  if (error) return <div className="p-6 text-red-500">Алдаа: {error}</div>
  if (!token) return <div className="p-6">Холбогдож байна...</div>

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      video
      audio
      data-lk-theme="default"
      style={{ height: "100svh" }}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
