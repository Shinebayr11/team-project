'use client'

import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import { useEffect, useState } from 'react'

interface LiveVideoPlayerProps {
  showId: string
  userName: string
}

export function LiveVideoPlayer({ showId, userName }: LiveVideoPlayerProps) {
  const [token, setToken] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(
          `/api/liveshow/${showId}/token`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identity: `viewer-${Date.now()}`,
              name: userName
            })
          }
        )

        if (!response.ok) throw new Error('Failed to get token')

        const data = await response.json()
        setToken(data.token)
        setUrl(data.url)
      } catch (err) {
        setError((err as any).message)
      } finally {
        setLoading(false)
      }
    }

    getToken()
  }, [showId, userName])

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <p className="text-white">Connecting to live...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!token || !url) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <p className="text-white">No stream available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={url}
        data-lk-theme="dark"
        style={{ height: '100%' }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  )
}
