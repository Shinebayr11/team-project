"use client"

import { useState } from "react"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"
import "@livekit/components-styles"
import { GripHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { buildProducts } from "@/lib/reelProducts"
import { useNavigate } from "@/lib/router"
import { useStore } from "@/store"
import { useAuction } from "@/hooks/useAuction"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useShowProducts } from "@/hooks/useShowProducts"
import { LiveShowDoc, allowsAuction, allowsBuyNow } from "@/lib/liveShows"
import { ReelTab } from "@/types"
import { Avatar } from "@/components/ui/Avatar"
import { ShowProductList } from "@/components/liveshow/ShowProductList"
import { ReelActionRail } from "@/components/liveshow/ReelActionRail"
import {
  LiveChatInput,
  LiveChatLines,
  LiveChatPanel,
  useLiveChat,
} from "@/components/live/live-chat"
import { AuctionBidPanel } from "@/components/live/auction-bid-panel"
import { SellerPanel } from "@/components/live/seller-panel"
import { ViewerStage } from "@/components/live/viewer-stage"

type ViewerProps = {
  show: LiveShowDoc | null
  showId?: string
  title?: string
}

/**
 * Бодит шууд дамжуулалт үзэх дэлгэц, Browse-ийн reel (`screens/LiveShow.tsx`)-тэй
 * ижил байрлалтай: дэлгэц дээр зүүнд худалдагч, барааны жагсаалт; голд видео;
 * баруунд чат. Гар утсан дээр видео бүтэн дэлгэцийг эзэлж, чат, товчнууд
 * түүн дээр хөвнө; худалдагч, бараа нь доороос гарч ирэх sheet-д орно.
 *
 * Token нь эцэг хуудсаас props-оор ирнэ — эрхийг сервер шийддэг тул энэ
 * component өөрөө хүсэлт явуулахгүй.
 */
export function LiveViewer({
  token,
  serverUrl,
  ...props
}: ViewerProps & { token: string; serverUrl: string }) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect
      video={false}
      audio={false}
    >
      <ViewerScreen {...props} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}

/** Чат `LiveKitRoom` дотор л ажилладаг тул дэлгэц нь тусдаа component. */
function ViewerScreen({ show, showId, title }: ViewerProps) {
  const { listing, bids, placeBid } = useAuction(showId)
  const { entries } = useShowProducts(showId)
  const navigate = useNavigate()
  const { openModal, cartCount } = useStore()
  const { requireAuth } = useRequireAuth()
  // Нэг л удаа — дэлгэцийн самбар, гар утасны давхарга хоёр ижил мессежийг харуулна.
  const chat = useLiveChat()
  const [tab, setTab] = useState<ReelTab>("buynow")
  // Зөвхөн гар утсанд: дэлгэц дээр самбар, чат хоёр байнга харагддаг.
  const [sheetOpen, setSheetOpen] = useState(false)
  const [chatVisible, setChatVisible] = useState(true)

  // Худалдагчийн сонгосон хэлбэр эфирт юу харагдахыг шийднэ: цэвэр дуудлага
  // худалдаанд шууд авах товч утгагүй (үнэ нь саналаар тодорно), цэвэр шууд
  // худалдаанд дуудлага худалдааны самбар харуулах юм алга.
  const auctionOn = allowsAuction(show?.type)
  const buyNowOn = allowsBuyNow(show?.type)

  const sellerDoc =
    typeof show?.seller_id === "object" ? show.seller_id : undefined
  const seller = sellerDoc?.shop_name || sellerDoc?.display_name || "Худалдагч"
  const sellerId = sellerDoc?._id
  const shownTitle = show?.title ?? title ?? "Шууд дамжуулалт"
  const category = show?.category || "Ерөнхий"
  const products = buildProducts(entries, listing, show?.type)

  return (
    // Гар утсан дээр `fixed` + `z-[60]` нь sticky Topbar (`z-50`)-ыг бүрхэнэ;
    // худалдан авах цонх (`z-[100]`), toast (`z-[110]`) дээрээ гарсаар байна.
    // Дэлгэц дээр баганын дараалал Browse-тэй ижил: худалдагч → видео → чат.
    // DOM дараалал видеог эхэнд байлгадаг тул зөвхөн lg дээр `order`-оор сольж байна.
    <div className="fixed inset-0 z-[60] h-dvh bg-black lg:static lg:z-auto lg:mx-auto lg:flex lg:h-[calc(100svh-68px)] lg:max-w-[1440px] lg:gap-4 lg:bg-transparent lg:p-4">
      <ViewerStage
        shareLabel={`whynot.live/${seller}`}
        onClose={() => navigate("/home")}
        className="lg:order-2"
      >
        {/* Доод давхарга. Дэлгэц дээр зөвхөн дуудлага худалдааны мөр үлдэнэ.
            `pointer-events-none` нь хоосон хэсгээрээ видеог халхлахгүй — дарагдах
            ёстой хэсэг бүр өөрөө `pointer-events-auto` авна. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 pt-12 pb-[max(12px,env(safe-area-inset-bottom))] lg:bg-none lg:p-4">
          <div className="flex items-end gap-3 lg:hidden">
            {chatVisible ? (
              <LiveChatLines lines={chat.lines} hostName={seller} />
            ) : (
              <div className="flex-1" />
            )}
            <ReelActionRail
              className="pointer-events-auto static"
              itemCount={products.buynow.length}
              cartCount={cartCount()}
              onShop={() => setSheetOpen(true)}
              onChatToggle={() => setChatVisible((visible) => !visible)}
              onCart={() => openModal("cart")}
            />
          </div>

          {/* Browse-ийн `ReelSellerRow`-ийн оронд. Дагах товч нь sheet доторх
              `SellerPanel` дээр — `useFollow`-ийг хоёр газар дуудвал хоёр өөр
              төлөвтэй болж, нэг дээр дагахад нөгөө нь хуучирна. */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="pointer-events-auto flex max-w-full min-w-0 items-center gap-2 self-start rounded-full bg-black/40 py-1 pr-4 pl-1 text-left backdrop-blur-md lg:hidden"
          >
            <Avatar name={seller} size={32} tint="var(--wn-accent-soft)" />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-[700] text-white">
                {seller}
              </span>
              <span className="block truncate text-[11px] text-white/70">
                {shownTitle}
              </span>
            </span>
          </button>

          {auctionOn && (
            <div className="pointer-events-auto">
              <AuctionBidPanel listing={listing} bids={bids} onBid={placeBid} />
            </div>
          )}

          <div className="pointer-events-auto lg:hidden">
            <LiveChatInput onSend={chat.send} />
          </div>
        </div>
      </ViewerStage>

      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Гар утсан дээр доороос гарах sheet, дэлгэц дээр зүүн багана — ганц
          instance тул `SellerPanel`-ийн дагах төлөв хуваагдахгүй. Хаалттай үед
          `invisible` нь дэлгэцээс гадуур байгаа товчнуудыг Tab-аар хүрэхээс
          хамгаална; `visibility`-г хамт шилжүүлдэг тул доош гулсах нь харагдана. */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-[24px] bg-white pb-[env(safe-area-inset-bottom)] transition-[translate,visibility] duration-300 ease-out",
          sheetOpen ? "visible translate-y-0" : "invisible translate-y-full",
          "lg:visible lg:static lg:z-auto lg:order-1 lg:h-full lg:max-h-none lg:w-[280px] lg:shrink-0 lg:translate-y-0 lg:rounded-[20px] lg:border lg:border-[var(--wn-line)] lg:pb-0"
        )}
      >
        <div className="flex shrink-0 justify-center pt-2 lg:hidden">
          <GripHorizontal className="h-5 w-5 text-[var(--wn-ink-4)]" />
        </div>
        <button
          type="button"
          onClick={() => setSheetOpen(false)}
          aria-label="Хаах"
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--wn-surface-2)] text-[var(--wn-ink-3)] transition-colors hover:text-[var(--wn-ink)] lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        <SellerPanel
          title={shownTitle}
          seller={seller}
          sellerId={sellerId}
          category={category}
        />
        <ShowProductList
          products={products}
          activeTab={tab}
          onTabChange={setTab}
          onBuy={
            buyNowOn
              ? (product) =>
                  requireAuth(() =>
                    openModal("buy", {
                      product: {
                        name: product.name,
                        price: product.price,
                        tag: "Buy now" as const,
                        productId: product.id,
                      },
                      seller,
                      qty: 1,
                    })
                  )
              : undefined
          }
          // Эфирт гарч буй барааг дарахад дэлгэрэнгүй нь нээгдэнэ. Mock
          // reel-д id байдаггүй тул зөвхөн жинхэнэ бараанд ажиллана.
          onSelect={(product) => {
            if (product.id) navigate(`/product?id=${product.id}`)
          }}
        />
      </div>

      <LiveChatPanel chat={chat} hostName={seller} className="lg:order-3" />
    </div>
  )
}
