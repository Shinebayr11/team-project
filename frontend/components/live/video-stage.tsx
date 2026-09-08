"use client"

import { useRouter } from "next/navigation"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"
import "@livekit/components-styles"

import { useApiClient } from "@/hooks/useApiClient"
import { writeActiveStream } from "@/hooks/useActiveStream"
import { useDisplayName } from "@/hooks/useDisplayName"
import { useAuction } from "@/hooks/useAuction"
import { LiveChat } from "@/components/live/live-chat"
import { BidsPanel } from "@/components/live/bids-panel"
import { HostControls } from "@/components/live/host-controls"
import { HostStage } from "@/components/live/host-stage"

/**
 * Худалдагчийн дамжуулах самбар: зүүнд өөрийн камер, баруунд үзэгчид,
 * сэтгэгдэл, дуудлага худалдааны хяналт.
 *
 * Token нь эцэг хуудсаас props-оор ирнэ; `isHost` нь СЕРВЕРИЙН шийдвэр
 * (лайвын эзэн мөн эсэх) бөгөөд URL дэх `?host=1` биш.
 */
export function VideoStage({
  token,
  serverUrl,
  isHost,
  showId,
}: {
  token: string
  serverUrl: string
  isHost: boolean
  showId?: string
}) {
  const router = useRouter()
  const { callApi } = useApiClient()
  const { displayName } = useDisplayName()
  const { listing, bids, startAuction, closeAuction } = useAuction(showId)

  const endStream = () => {
    if (showId) {
      callApi(`/api/liveshow/${showId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "ended",
          ended_at: new Date().toISOString(),
        }),
      }).catch((error) => console.error("Failed to end live show:", error))
    }
    writeActiveStream(null)
    router.push("/seller/shows/start")
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect
      video={isHost}
      audio={isHost}
    >
      <div className="flex flex-col gap-4 lg:h-full lg:flex-row">
        <div className="relative aspect-video overflow-hidden rounded-[20px] bg-black lg:aspect-auto lg:flex-1">
          <HostStage showId={showId} isHost={isHost} />
          {isHost && <HostControls onEnd={endStream} />}
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
