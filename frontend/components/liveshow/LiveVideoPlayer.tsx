'use client'

import {
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react'
import { Track } from 'livekit-client'
import { useEffect, useState } from 'react'

import { useApiClient } from '@/hooks/useApiClient'

interface LiveVideoPlayerProps {
  showId: string
  userName: string
}

interface TokenResponse {
  token: string
  url: string
  roomName: string
}

const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full h-screen bg-black flex items-center justify-center">
    {children}
  </div>
)

/**
 * Зөвхөн худалдагчийн track-уудыг харуулна. Үзэгч юу ч нийтлэхгүй тул
 * `VideoConference`-ийн камер/микрофон/дэлгэц хуваалцах товчнууд энд утгагүй —
 * token дээр `canPublish: false` байдаг тул тэдгээр нь ямар ч байсан амжилтгүй
 * болно.
 */
function ViewerStage() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: true }
  )

  if (tracks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-white">Дамжуулалт хүлээгдэж байна...</p>
      </div>
    )
  }

  return (
    <GridLayout tracks={tracks} style={{ height: '100%' }}>
      <ParticipantTile />
    </GridLayout>
  )
}

export function LiveVideoPlayer({ showId, userName }: LiveVideoPlayerProps) {
  const { callApi } = useApiClient()
  const [token, setToken] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    const getToken = async () => {
      try {
        // Нэвтэрсэн бол Clerk-ийн token хамт явна — сервер нэрийг профайлаас нь
        // авна. Зочин хэвээр үзэх боломжтой тул энэ нь заавал биш.
        const data = await callApi<TokenResponse>(`/api/liveshow/${showId}/token`, {
          method: 'POST',
          body: JSON.stringify({ name: userName }),
        })
        if (cancelled) return
        setToken(data.token)
        setUrl(data.url)
      } catch (err) {
        if (!cancelled) setError((err as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    getToken()
    return () => {
      cancelled = true
    }
  }, [showId, userName, callApi])

  if (loading) return <Screen><p className="text-white">Холбогдож байна...</p></Screen>
  if (error) return <Screen><p className="text-red-500">{error}</p></Screen>
  if (!token || !url) return <Screen><p className="text-white">Дамжуулалт олдсонгүй</p></Screen>

  return (
    <div className="w-full h-screen bg-black">
      <LiveKitRoom
        // Үзэгч нийтлэхгүй: `true` бол хөтөч камер/микрофоны зөвшөөрөл гуйж,
        // дараа нь token-ий `canPublish: false` улмаас амжилтгүй болдог.
        video={false}
        audio={false}
        connect
        token={token}
        serverUrl={url}
        data-lk-theme="dark"
        style={{ height: '100%' }}
      >
        <ViewerStage />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  )
}
