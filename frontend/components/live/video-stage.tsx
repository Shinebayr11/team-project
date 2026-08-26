"use client"

import { useState } from "react"
import type React from "react"
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
import { Square } from "lucide-react"
import "@livekit/components-styles"
import { LiveDot } from "@/components/ui/LiveDot"
import { useApiClient } from "@/hooks/useApiClient"
import { writeActiveStream } from "@/hooks/useActiveStream"
import { useLiveKitToken } from "@/hooks/useLiveKitToken"
import { useDisplayName } from "@/hooks/useDisplayName"
import { useAuction } from "@/hooks/useAuction"
import { LiveChat } from "@/components/live/live-chat"
import { BidsPanel } from "@/components/live/bids-panel"

/**
 * LiveKit-ийн загварын хувьсагчид.
 *
 * `@livekit/components-styles` нь өнгөө БҮГДИЙГ `[data-lk-theme=default]`
 * дотор тодорхойлдог ба `LiveKitRoom` нь тэр шинжийг өөрөө ТАВЬДАГГҮЙ —
 * зөвхөн `.lk-room-container` класс өгдөг. Тиймээс одоог хүртэл `--lk-*`
 * бүр тодорхойлогдоогүй байсан: `background-color: var(--lk-control-bg)`
 * зэрэг мөр бүр computed-value үед хүчингүй болж, товчнууд хар видеон дээр
 * дэвсгэргүй, өвлөсөн бараан бэхээр гарч байв.
 *
 * Шинжийг зөвхөн ControlBar-ыг тойруулж тавьсан — `LiveKitRoom` дээр тавибал
 * `.lk-room-container { background: var(--lk-bg) }` идэвхжиж бүх талбарыг
 * #111 болгож, хажуугийн цагаан чат/дуудлага худалдааны самбарыг сүйтгэнэ.
 */
const controlBarTheme = {
  "--lk-control-bg": "rgba(255,255,255,0.16)",
  "--lk-control-hover-bg": "rgba(255,255,255,0.26)",
  "--lk-control-active-bg": "rgba(255,255,255,0.26)",
  "--lk-control-active-hover-bg": "rgba(255,255,255,0.34)",
  "--lk-control-fg": "#ffffff",
  "--lk-fg": "#ffffff",
  "--lk-bg2": "var(--wn-shot)",
  "--lk-accent-bg": "var(--wn-accent)",
  "--lk-danger": "var(--wn-live-deep)",
  "--lk-border-color": "transparent",
  "--lk-border-radius": "9999px",
  "--lk-font-family": "var(--wn-font)",
  "--lk-font-size": "14px",
} as React.CSSProperties

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
        <span>Лайв</span>
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
  const { listing, bids, startAuction, closeAuction } = useAuction(showId)
  const [confirming, setConfirming] = useState(false)

  const endStream = () => {
    if (showId) {
      callApi(`/api/liveshow/${showId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "ended", ended_at: new Date().toISOString() }),
      }).catch((error) => console.error("Failed to end live show:", error))
    }
    writeActiveStream(null)
    router.push("/seller/shows/start")
  }

  if (error) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-black px-6 text-center text-sm text-red-400 lg:aspect-auto lg:h-full">
        Холбогдож чадсангүй. Сервер (3001) ажиллаж байгаа эсэхийг шалгана уу.
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-black text-sm text-white/60 lg:aspect-auto lg:h-full">
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
      <div className="flex flex-col gap-4 lg:h-full lg:flex-row">
        <div className="relative aspect-video overflow-hidden rounded-[20px] bg-black lg:aspect-auto lg:flex-1">
          <Stage />

          {isHost && (
            <div className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-3 px-4">
              <div
                data-lk-theme="default"
                style={controlBarTheme}
                className="[&_.lk-control-bar]:p-0"
              >
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

              {confirming ? (
                <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-lg">
                  <span className="text-[14px] font-[700] text-black">
                    Лайвыг дуусгах уу?
                  </span>
                  <button
                    type="button"
                    onClick={endStream}
                    className="h-11 rounded-full bg-[var(--wn-live-deep)] px-5 text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-live)]"
                  >
                    Тийм, дуусгах
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="h-11 rounded-full border border-gray-300 px-5 text-[14px] font-[700] text-black transition-colors hover:bg-gray-50"
                  >
                    Болих
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="flex h-11 items-center gap-2 rounded-full bg-[var(--wn-live-deep)] px-5 text-[14px] font-[700] text-white shadow-lg transition-colors hover:bg-[var(--wn-live)]"
                >
                  <Square className="size-4 fill-white" />
                  Лайв дуусгах
                </button>
              )}
            </div>
          )}
        </div>

        {/* `lg:contents` — дэлгэц дээр энэ бүрхүүл layout-аас арилж, хоёр
            самбар мөрийн шууд хүүхэд болно. Гар утсан дээр л өндөр өгнө. */}
        <div className="flex h-[360px] gap-4 overflow-x-auto lg:contents">
          <LiveChat hostName={displayName} />
          <BidsPanel
            listing={listing}
            bids={bids}
            onStart={startAuction}
            onClose={closeAuction}
          />
        </div>
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
