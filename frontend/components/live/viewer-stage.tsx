"use client"

import { useState } from "react"
import {
  useRemoteParticipants,
  useTracks,
  VideoTrack,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { LiveDot } from "@/components/ui/LiveDot"

/**
 * Худалдагчийн камер тайзыг дүүргэнэ. Дуудлага худалдааны UI үүн дээр давхарлана.
 *
 * Гар утсан дээр тайз бүх дэлгэцийг эзэлнэ (Browse-ийн reel шиг). Видео нь
 * тэнд `object-contain`: худалдагчид ихэвчлэн зөөврийн компьютерийн камераар
 * (хэвтээ) дамжуулдаг тул босоо дэлгэцэнд `cover` хийвэл голын гуравны нэгээс
 * бусад нь — бараа, хүмүүс нь — тасарна. Утсаар дамжуулбал дэлгэцийг бараг
 * бүтэн дүүргэнэ.
 */
export function ViewerStage({
  shareLabel,
  onClose,
  className,
  children,
}: {
  shareLabel: string
  /** Гар утсан дээрх хаах товч — бүтэн дэлгэцэд Topbar харагдахгүй тул эндээс гарна. */
  onClose?: () => void
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
        "relative size-full overflow-hidden bg-black lg:w-auto lg:flex-1 lg:rounded-[20px] lg:bg-[var(--wn-shot-deep)]",
        className
      )}
    >
      {track ? (
        <VideoTrack
          trackRef={track}
          className="size-full object-contain lg:object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-sm text-white/60">
          Шууд дамжуулалт хүлээгдэж байна...
        </div>
      )}

      {/* Гар утсан дээр доошоо бүдгэрэх сүүдэр нь тод видеон дээр ч товчийг
          уншигдуулна; `safe-area-inset-top` нь notch-ийн доор оруулахгүй. */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 bg-gradient-to-b from-black/50 to-transparent px-3 pt-[max(12px,env(safe-area-inset-top))] pb-8 lg:bg-none lg:p-4">
        <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[12px] font-[600] text-white backdrop-blur-md">
          <LiveDot className="h-2 w-2" />
          <span>Шууд</span>
          <span className="ml-1 opacity-60">{participants.length} үзэж байна</span>
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="ml-auto flex h-8 max-w-[45%] items-center gap-2 truncate rounded-full bg-black/40 px-3 text-[12px] font-[600] text-white backdrop-blur-md transition-colors hover:bg-black/60"
        >
          {copied ? "Холбоос хуулагдлаа" : shareLabel}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 lg:hidden"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {children}
    </div>
  )
}
