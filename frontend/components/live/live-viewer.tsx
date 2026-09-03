"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRemoteParticipants,
  useTracks,
  VideoTrack,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import "@livekit/components-styles"
import { useNavigate } from "@/lib/router"
import { useStore } from "@/store"
import { useLiveKitToken } from "@/hooks/useLiveKitToken"
import { useLiveShowDetail } from "@/hooks/useLiveShowDetail"
import { ReelProduct, ReelTab } from "@/types"
import { Avatar } from "@/components/ui/Avatar"
import { LiveDot } from "@/components/ui/LiveDot"
import { ShowProductList } from "@/components/liveshow/ShowProductList"
import { LiveChat } from "@/components/live/live-chat"
import { AuctionBidPanel } from "@/components/live/auction-bid-panel"
import { AuctionProduct, Listing, isActive, useAuction } from "@/hooks/useAuction"
import { ShowProduct, productOfEntry, useShowProducts } from "@/hooks/useShowProducts"

/**
 * Худалдагчийн урьдчилан эмхэлсэн жагсаалт панелийн үндэс болно; дуудлага худалдаанд
 * гарсан бараа нь "Live now", дуусcан нь "Sold" болж доошоо шилжинэ.
 */
const buildProducts = (
  entries: ShowProduct[],
  listing: Listing | null
): Record<ReelTab, ReelProduct[]> => {
  const onBlock =
    listing && typeof listing.product_id === "object" ? listing.product_id : null
  const running = isActive(listing)
  const livePrice = String(
    listing?.current_highest_bid_coins ?? listing?.starting_price_coins ?? 0
  )

  const buynow: ReelProduct[] = []
  const sold: ReelProduct[] = []

  const push = (product: AuctionProduct) => {
    const current = onBlock?._id === product._id
    const row: ReelProduct = {
      name: product.name,
      price: current ? livePrice : String(product.price_coins ?? 0),
      tag: current ? (running ? "Live now" : "Sold") : "Удахгүй",
      live: current && running,
      image: product.images?.[0],
    }
    if (current && !running) sold.push(row)
    else buynow.push(row)
  }

  const listed = new Set<string>()
  for (const entry of entries) {
    const product = productOfEntry(entry)
    if (!product) continue
    listed.add(product._id)
    push(product)
  }

  // Жагсаалтад ороогүй бараагаар дуудлага худалдаа явж байвал түүнийг ч гэсэн харуулна —
  // /sell дээр жагсаалт эмхлээгүй байсан ч панель хоосон харагдахгүй.
  if (onBlock && !listed.has(onBlock._id)) push(onBlock)

  return { buynow, giveaways: [], sold }
}

/** The host's camera, filling the stage. Any auction UI overlays it. */
function Stage({ children }: { children?: React.ReactNode }) {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: false })
  const track = tracks[0]
  const participants = useRemoteParticipants()

  return (
    <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-[20px] bg-[var(--wn-shot-deep)] lg:aspect-auto lg:h-full lg:w-auto lg:flex-1 lg:shrink">
      {track ? (
        <VideoTrack trackRef={track} className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center text-sm text-white/60">
          Дамжуулалт хүлээгдэж байна...
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[12px] font-[600] text-white backdrop-blur-md">
        <LiveDot className="h-2 w-2" />
        <span>Шууд</span>
        <span className="ml-1 opacity-60">{participants.length} watching</span>
      </div>

      {children}
    </div>
  )
}

/** Seller card above the product tabs — mirrors ShowInfoPanel, minus the mock ratings. */
function SellerPanel({
  title,
  seller,
  category,
}: {
  title: string
  seller: string
  category: string
}) {
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useStore()
  const following = isFollowing(seller)

  return (
    <div className="border-b border-[var(--wn-line)] p-4">
      <div className="mb-1 text-[10px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase">
        {category}
      </div>
      <h1 className="mb-3 text-[20px] leading-tight font-[800] text-[var(--wn-ink)]">
        {title}
      </h1>

      <div
        className="group mb-3 flex cursor-pointer items-center gap-3"
        onClick={() => navigate(`/shop?seller=${seller}`)}
      >
        <Avatar name={seller} size={36} tint="var(--wn-accent-soft)" />
        <div>
          <div className="text-[14px] font-[700] text-[var(--wn-ink)] transition-colors group-hover:text-[var(--wn-accent)]">
            {seller}
          </div>
          <div className="flex items-center gap-1 text-[12px] text-[var(--wn-ink-3)]">
            <Star className="h-3 w-3 fill-[var(--wn-accent)] text-[var(--wn-accent)]" />
            <span>Шинэ худалдагч</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => toggleFollow(seller)}
        className={`w-full rounded-xl py-2 text-[13px] font-[700] transition-colors ${
          following
            ? "bg-[var(--wn-surface-2)] text-[var(--wn-ink)]"
            : "bg-[var(--wn-ink)] text-white hover:bg-[var(--wn-ink-2)]"
        }`}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  )
}

/**
 * Watching a real broadcast, laid out like the browse reel: seller and products
 * on the left, the live video in the middle, chat on the right.
 */
export function LiveViewer({
  roomName,
  showId,
  title,
}: {
  roomName: string
  showId?: string
  title?: string
}) {

  const { token: liveKitToken, error } = useLiveKitToken(roomName, false)
  const show = useLiveShowDetail(showId)
  const { listing, placeBid } = useAuction(showId)
  const { entries } = useShowProducts(showId)
  const [tab, setTab] = useState<ReelTab>("buynow")

  const seller =
    typeof show?.seller_id === "object" && show.seller_id?.display_name
      ? show.seller_id.display_name
      : "Seller"
  const shownTitle = show?.title ?? title ?? "Шууд дамжуулалт"
  const category = show?.category || "General"

  if (error || !liveKitToken) {
    return (
      <div className="mx-auto flex h-[calc(100vh-68px)] max-w-[1440px] items-center justify-center px-4">
        <p className="text-sm text-[var(--wn-ink-3)]">
          {error ? "Холбогдож чадсангүй." : "Холбогдож байна..."}
        </p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={liveKitToken}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      video={false}
      audio={false}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 lg:h-[calc(100vh-68px)] lg:flex-row">
        <Stage>
          <AuctionBidPanel listing={listing} onBid={placeBid} />
        </Stage>

        {/* `lg:contents` — дэлгэц дээр энэ бүрхүүл layout-аас арилж, гурван
            самбар мөрийн шууд хүүхэд болно. Гар утсан дээр л өндөр өгнө. */}
        <div className="flex h-[360px] gap-4 overflow-x-auto lg:contents">
          <div className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[var(--wn-line)] bg-white">
            <SellerPanel
              title={shownTitle}
              seller={seller}
              category={category}
            />
            <ShowProductList
              products={buildProducts(entries, listing)}
              activeTab={tab}
              onTabChange={setTab}
              onSelect={() => {}}
            />
          </div>

          <LiveChat hostName={seller} />
        </div>
      </div>

      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
