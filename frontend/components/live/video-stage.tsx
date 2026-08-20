"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  LiveKitRoom,
  useRemoteParticipants,
  useTracks,
  VideoTrack,
  ControlBar,
  RoomAudioRenderer,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import "@livekit/components-styles"
import { Button } from "@/components/ui/button"
import { LiveDot } from "@/components/ui/LiveDot"
import { useApiClient } from "@/hooks/useApiClient"
import { writeActiveStream } from "@/hooks/useActiveStream"
import { useLiveKitToken } from "@/hooks/useLiveKitToken"
import { useDisplayName } from "@/hooks/useDisplayName"
import { LiveChat } from "@/components/live/live-chat"
import { BidsPanel } from "@/components/live/bids-panel"

function Stage() {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false })
  const track = tracks[0]
  const participants = useRemoteParticipants()

  return (
    <>
      {track ? (
        <VideoTrack
          trackRef={track}
          className="size-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-sm text-white/60">
          Дамжуулалт хүлээгдэж байна...
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[12px] font-[600] text-white backdrop-blur-md">
        <LiveDot className="h-2 w-2" />
        <span>Live</span>
        <span className="ml-1 opacity-60">{participants.length} watching</span>
      </div>
    </>
  )
}

/**
 * The host's broadcast console: their camera on the left, and the room's
 * viewers and comments alongside it on the right.
 */
export function VideoStage({
  roomName,
  isHost = false,
  showId,
}: {
  roomName: string
  isHost?: boolean
  showId?: string
}) {
  const router = useRouter()
  const { callApi } = useApiClient()
  const { token, error } = useLiveKitToken(roomName, isHost)
  const { displayName } = useDisplayName()
  const [confirming, setConfirming] = useState(false)

  const endStream = () => {
    if (showId) {
      callApi(`/api/liveshow/${showId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "ended", ended_at: new Date().toISOString() }),
      }).catch((error) => console.error("Failed to end live show:", error))
    }
    writeActiveStream(null)
    router.push("/sell")
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center rounded-xl bg-black px-6 text-center text-sm text-red-400">
        Холбогдож чадсангүй. Сервер (3001) ажиллаж байгаа эсэхийг шалгана уу.
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center rounded-xl bg-black text-sm text-white/60">
        Холбогдож байна...
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      video={isHost}
      audio={isHost}
    >
      <div className="flex h-[calc(100vh-140px)] gap-4">
        <div className="relative flex-1 overflow-hidden rounded-[20px] bg-black">
          <Stage />

          {isHost && (
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
              <ControlBar
                controls={{
                  camera: true,
                  microphone: true,
                  screenShare: false,
                  leave: false,
                  chat: false,
                }}
              />

              {confirming ? (
                <div className="flex items-center gap-2 rounded-lg bg-background/95 p-2 backdrop-blur">
                  <span className="px-2 text-sm">Шоуг дуусгах уу?</span>
                  <Button size="sm" variant="destructive" onClick={endStream}>
                    Тийм
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirming(false)}
                  >
                    Үгүй
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setConfirming(true)}
                >
                  Дуусгах
                </Button>
              )}
            </div>
          )}
        </div>

        <LiveChat hostName={displayName} />
        <BidsPanel />
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
