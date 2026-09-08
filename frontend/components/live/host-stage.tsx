"use client"

import { useRef } from "react"
import {
  useRemoteParticipants,
  useTracks,
  VideoTrack,
} from "@livekit/components-react"
import { Track } from "livekit-client"

import { LiveDot } from "@/components/ui/LiveDot"
import { useLiveThumbnail } from "@/hooks/useLiveThumbnail"

/** Худалдагчийн өөрийнх нь камер, үзэгчийн тоотой. */
export function HostStage({
  showId,
  isHost,
}: {
  showId?: string
  isHost: boolean
}) {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false })
  const track = tracks[0]
  const participants = useRemoteParticipants()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Зөвхөн дамжуулж буй худалдагчийн хөтөч зураг авна — үзэгчид ямар ч
  // нэмэлт ажил унахгүй. Камераа түр унтраасан үед track үлддэг ч кадр нь хар
  // болдог тул зураг авахаа зогсооно — эс тэгвэл өмнөх сайн зургийг хараар
  // дарж бичнэ.
  useLiveThumbnail(
    videoRef,
    showId,
    isHost && !!track && !track.publication?.isMuted
  )

  return (
    <>
      {track ? (
        <VideoTrack
          ref={videoRef}
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
        <span>Шууд</span>
        <span className="ml-1 opacity-60">{participants.length} үзэж байна</span>
      </div>
    </>
  )
}
