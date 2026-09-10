"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useSearchParams, useNavigate } from "@/lib/router"
import { ReelProduct, ReelShow, ReelTab } from "@/types"
import { REEL_SHOWS } from "@/data"
import { useStore } from "@/store"
import { useLiveShows } from "@/hooks/useLiveShows"
import { toReelShow } from "@/lib/reelFromLive"
import { useReelPlayer } from "@/hooks/useReelPlayer"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { ShowInfoPanel } from "@/components/liveshow/ShowInfoPanel"
import { ShowProductList } from "@/components/liveshow/ShowProductList"
import { ReelStage } from "@/components/liveshow/ReelStage"
import { ChatPanel } from "@/components/liveshow/ChatPanel"
import { ReelMobileTopOverlay } from "@/components/liveshow/ReelMobileTopOverlay"
import { ReelSellerRow } from "@/components/liveshow/ReelSellerRow"
import { ReelActionRail } from "@/components/liveshow/ReelActionRail"
import { ReelMobileChat } from "@/components/liveshow/ReelMobileChat"
import { ReelMobileBottomBar } from "@/components/liveshow/ReelMobileBottomBar"
import { ReelItemSheet } from "@/components/liveshow/ReelItemSheet"
import { RouteFallback } from "@/components/layout/AppShell"

const VIEWER_NAME = "junglefinds"
const SCROLL_HINT_MS = 4200

export const LiveShow: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { openModal, isFollowing, toggleFollow, addToast, cartCount } = useStore()
  const { requireAuth } = useRequireAuth()

  // Жинхэнэ эфир байвал жагсаалтын ЭХЭНД гарна — mock-ууд доошоо шилжинэ.
  // Үзэгч "Шууд" таб руу орохдоо яг одоо явж байгаа хүнийг эхлээд харах ёстой.
  const { shows: liveShows, loading: liveLoading } = useLiveShows()

  const shows = useMemo(() => {
    const live = liveShows
      .filter((show) => show.live !== undefined)
      .sort((a, b) => (b.live ?? 0) - (a.live ?? 0))
      .map(toReelShow)
    return [...live, ...REEL_SHOWS]
  }, [liveShows])

  const requestedSlug = searchParams.get("show")
  const startIndex = Math.max(
    0,
    shows.findIndex((s) => s.slug === requestedSlug)
  )

  const [tab, setTab] = useState<ReelTab>("buynow")
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [chatVisible, setChatVisible] = useState(true)

  const {
    currentIndex,
    currentShow,
    countdown,
    viewers,
    chatLines,
    goTo,
    handleWheel,
    pushChatLine,
  } = useReelPlayer(shows, startIndex)

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), SCROLL_HINT_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleProductSelect = (product: ReelProduct) => {
    if (tab === "sold") {
      addToast(`${product.name} already sold`)
      return
    }
    navigate(
      `/product?seller=${currentShow.slug}&product=${encodeURIComponent(product.name)}`
    )
  }

  const handleItemAction = (show: ReelShow) => {
    // Жинхэнэ эфирт энд худалдах зүйл алга — бараа, дуудлага худалдаа нь
    // `/live/<room>` дээр бодитоор явж байгаа тул тэр рүү нь оруулна.
    if (show.item.mode === "watch") {
      if (show.watchPath) navigate(show.watchPath)
      // Room-гүй эфир нь өгөгдлийн сан дахь жишээ мөр — үзэх дамжуулалт алга.
      else addToast("Энэ эфирийг одоогоор үзэх боломжгүй байна.")
      return
    }

    return requireAuth(() => {
      if (show.item.mode === "bid") {
        openModal("bid", { show })
        return
      }
      openModal("buy", {
        product: {
          name: show.item.name,
          price: show.item.price,
          tag: "Buy now" as const,
        },
        seller: show.seller,
        qty: 1,
      })
    })
  }

  // Жинхэнэ эфирүүд ирэхээс өмнө зурвал жагсаалт нь дараа нь урдаасаа уртсаж,
  // үзэгчийн харж байсан мөр өөр рүү үсэрнэ. Уншиж дуустал хүлээнэ.
  if (liveLoading) return <RouteFallback />

  const shareUrl = `whynot.live/${currentShow.slug}`
  const itemCount = currentShow.products.buynow.length

  return (
    <>
      {/* Mobile layout (below lg) */}
      <div
        className="lg:hidden w-screen fixed inset-0 bg-black"
        style={{ height: '100dvh', maxHeight: '100dvh' }}
      >
        <ReelStage
          shows={shows}
          currentIndex={currentIndex}
          countdown={countdown}
          viewers={viewers}
          showScrollHint={showScrollHint}
          onWheel={handleWheel}
          onGoTo={goTo}
          onItemAction={handleItemAction}
        />

        {/* Overlays */}
        <ReelMobileTopOverlay
          viewers={viewers}
          shareUrl={shareUrl}
          onClose={() => navigate("/home")}
        />

        {chatVisible && (
          <ReelMobileChat lines={chatLines} hostName={currentShow.seller} />
        )}

        <ReelSellerRow
          sellerName={currentShow.seller}
          rating={currentShow.rating}
          following={isFollowing(currentShow.slug)}
          onToggleFollow={() => toggleFollow(currentShow.slug)}
        />

        <ReelActionRail
          itemCount={itemCount}
          cartCount={cartCount()}
          onShop={() => setIsSheetOpen(true)}
          onChatToggle={() => setChatVisible(!chatVisible)}
          onCart={() => openModal("cart")}
          onShare={() => {
            navigator.clipboard.writeText(shareUrl)
            addToast("Link copied!")
          }}
        />

        <ReelMobileBottomBar
          item={currentShow.item}
          countdown={countdown}
          onAction={() => handleItemAction(currentShow)}
          onSendChat={(text) => pushChatLine({ name: VIEWER_NAME, text })}
        />

        <ReelItemSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          show={currentShow}
          products={currentShow.products}
          activeTab={tab}
          onTabChange={setTab}
          onProductSelect={handleProductSelect}
          following={isFollowing(currentShow.slug)}
          onToggleFollow={() => toggleFollow(currentShow.slug)}
        />
      </div>

      {/* Desktop layout (lg and above) */}
      <div className="hidden lg:flex mx-auto h-[calc(100vh-68px)] max-w-[1440px] gap-4 px-4 py-4">
        <div className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[var(--wn-line)] bg-white">
          <ShowInfoPanel
            show={currentShow}
            following={isFollowing(currentShow.slug)}
            onToggleFollow={() => toggleFollow(currentShow.slug)}
            onOpenShop={() => navigate(`/shop?seller=${currentShow.slug}`)}
          />
          <ShowProductList
            products={currentShow.products}
            activeTab={tab}
            onTabChange={setTab}
            onSelect={handleProductSelect}
          />
        </div>

        <ReelStage
          shows={shows}
          currentIndex={currentIndex}
          countdown={countdown}
          viewers={viewers}
          showScrollHint={showScrollHint}
          onWheel={handleWheel}
          onGoTo={goTo}
          onItemAction={handleItemAction}
        />

        <ChatPanel
          lines={chatLines}
          viewers={viewers}
          hostName={currentShow.seller}
          onSend={(text) => pushChatLine({ name: VIEWER_NAME, text })}
        />
      </div>
    </>
  )
}
