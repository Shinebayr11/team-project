"use client"

import { useEffect, useState } from "react"
import {
  LiveKitRoom,
  useTracks,
  VideoTrack,
  ControlBar,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import "@livekit/components-styles"

function Stage() {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false })
  const track = tracks[0]

  if (!track) {
    return (
      <div className="flex size-full items-center justify-center text-sm text-white/60">
        Дамжуулалт хүлээгдэж байна...
      </div>
    )
  }

  return <VideoTrack trackRef={track} className="size-full object-cover" />
}

export function VideoStage({
  roomName,
  isHost = false,
}: {
  roomName: string
  isHost?: boolean
}) {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
      .then((d) => setToken(d.token))
      .catch((e) => setError(String(e)))
  }, [roomName, isHost])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {error ? (
        <div className="flex size-full items-center justify-center px-6 text-center text-sm text-red-400">
          Холбогдож чадсангүй. Сервер (3001) ажиллаж байгаа эсэхийг шалгана уу.
        </div>
      ) : !token ? (
        <div className="flex size-full items-center justify-center text-sm text-white/60">
          Холбогдож байна...
        </div>
      ) : (
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          connect
          video={isHost}
          audio={isHost}
          className="size-full"
        >
          <Stage />
          {isHost && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <ControlBar
                controls={{
                  camera: true,
                  microphone: true,
                  screenShare: false,
                  leave: false,
                  chat: false,
                }}
              />
            </div>
          )}
        </LiveKitRoom>
      )}
    </div>
  )
}
