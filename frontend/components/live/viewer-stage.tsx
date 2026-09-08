"use client"

import { useState } from "react"
import {
  useRemoteParticipants,
  useTracks,
  VideoTrack,
} from "@livekit/components-react"
import { Track } from "livekit-client"

import { cn } from "@/lib/utils"
import { LiveDot } from "@/components/ui/LiveDot"

/** Худалдагчийн камер тайзыг дүүргэнэ. Дуудлага худалдааны UI үүн дээр давхарлана. */
export function ViewerStage({
  shareLabel,
  className,
  children,
}: {
  shareLabel: string
  className?: string
  children?: React.ReactNode
}) {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false })
  const track = tracks[0]
  const participants = useRemoteParticipants()
  const [copied, setCopied] = useState(false)

  // Browse дээрх тайзтай ижил байрлалд хуваалцах товч. Тэнд зөвхөн чимэглэл
  // байсан бол энд бодит холбоосыг хуулна.
  const copyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  return (
    <div
      className={cn(
        "relative aspect-video w-full shrink-0 overflow-hidden rounded-[20px] bg-[var(--wn-shot-deep)] lg:aspect-auto lg:h-full lg:w-auto lg:flex-1 lg:shrink",
        className
      )}
    >
      {track ? (
        <VideoTrack trackRef={track} className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-sm text-white/60">
          Шууд дамжуулалт хүлээгдэж байна...
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[12px] font-[600] text-white backdrop-blur-md">
        <LiveDot className="h-2 w-2" />
        <span>Шууд</span>
        <span className="ml-1 opacity-60">{participants.length} үзэж байна</span>
      </div>

      <button
        type="button"
        onClick={copyLink}
        className="absolute top-4 right-4 z-10 flex h-8 max-w-[45%] items-center gap-2 truncate rounded-full bg-black/40 px-3 text-[12px] font-[600] text-white backdrop-blur-md transition-colors hover:bg-black/60"
      >
        {copied ? "Холбоос хуулагдлаа" : shareLabel}
      </button>

      {children}
    </div>
  )
}
