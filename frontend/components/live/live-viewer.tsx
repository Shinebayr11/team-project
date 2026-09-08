"use client"

import { useState } from "react"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"
import "@livekit/components-styles"

import { buildProducts } from "@/lib/reelProducts"
import { useAuction } from "@/hooks/useAuction"
import { useShowProducts } from "@/hooks/useShowProducts"
import { LiveShowDoc } from "@/lib/liveShows"
import { ReelTab } from "@/types"
import { ShowProductList } from "@/components/liveshow/ShowProductList"
import { LiveChat } from "@/components/live/live-chat"
import { AuctionBidPanel } from "@/components/live/auction-bid-panel"
import { SellerPanel } from "@/components/live/seller-panel"
import { ViewerStage } from "@/components/live/viewer-stage"

/**
 * Бодит шууд дамжуулалт үзэх дэлгэц, Browse-ийн reel-тэй ижил байрлалтай:
 * зүүнд худалдагч, барааны жагсаалт; голд видео; баруунд чат.
 *
 * Token нь эцэг хуудсаас props-оор ирнэ — эрхийг сервер шийддэг тул энэ
 * component өөрөө хүсэлт явуулахгүй.
 */
export function LiveViewer({
  token,
  serverUrl,
  show,
  showId,
  title,
}: {
  token: string
  serverUrl: string
  show: LiveShowDoc | null
  showId?: string
  title?: string
}) {
  const { listing, bids, placeBid } = useAuction(showId)
  const { entries } = useShowProducts(showId)
  const [tab, setTab] = useState<ReelTab>("buynow")

  const sellerDoc =
    typeof show?.seller_id === "object" ? show.seller_id : undefined
  const seller = sellerDoc?.shop_name || sellerDoc?.display_name || "Худалдагч"
  const sellerId = sellerDoc?._id
  const shownTitle = show?.title ?? title ?? "Шууд дамжуулалт"
  const category = show?.category || "Ерөнхий"

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect
      video={false}
      audio={false}
    >
      {/* Дэлгэц дээрх баганын дараалал Browse (`screens/LiveShow.tsx`)-тэй
          ижил байх ёстой: худалдагчийн самбар → видео → чат. DOM дараалал нь
          гар утсанд зориулж видеог эхэнд байлгадаг тул зөвхөн lg дээр `order`-оор
          сольж байна. */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 lg:h-[calc(100vh-68px)] lg:flex-row">
        <ViewerStage shareLabel={`whynot.live/${seller}`} className="lg:order-2">
          <AuctionBidPanel listing={listing} bids={bids} onBid={placeBid} />
        </ViewerStage>

        {/* `lg:contents` — дэлгэц дээр энэ бүрхүүл layout-аас арилж, гурван
            самбар мөрийн шууд хүүхэд болно. Гар утсан дээр л өндөр өгнө. */}
        <div className="flex h-[360px] gap-4 overflow-x-auto lg:contents">
          <div className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[var(--wn-line)] bg-white lg:order-1">
            <SellerPanel
              title={shownTitle}
              seller={seller}
              sellerId={sellerId}
              category={category}
            />
            <ShowProductList
              products={buildProducts(entries, listing)}
              activeTab={tab}
              onTabChange={setTab}
              onSelect={() => {}}
            />
          </div>

          <LiveChat hostName={seller} className="lg:order-3" />
        </div>
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
