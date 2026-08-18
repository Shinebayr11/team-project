"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "@/lib/router"
import { ReelProduct, ReelShow, ReelTab } from "@/types"
import { REEL_SHOWS } from "@/data"
import { useStore } from "@/store"
import { useReelPlayer } from "@/hooks/useReelPlayer"
import { ShowInfoPanel } from "@/components/liveshow/ShowInfoPanel"
import { ShowProductList } from "@/components/liveshow/ShowProductList"
import { ReelStage } from "@/components/liveshow/ReelStage"
import { ChatPanel } from "@/components/liveshow/ChatPanel"

const VIEWER_NAME = "junglefinds"
const SCROLL_HINT_MS = 4200

export const LiveShow: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { openModal, isFollowing, toggleFollow, addToast } = useStore()

  const requestedSlug = searchParams.get("show")
  const startIndex = Math.max(
    0,
    REEL_SHOWS.findIndex((s) => s.slug === requestedSlug)
  )

  const [tab, setTab] = useState<ReelTab>("buynow")
  const [showScrollHint, setShowScrollHint] = useState(true)

  const {
    currentIndex,
    currentShow,
    countdown,
    viewers,
    chatLines,
    goTo,
    handleWheel,
    pushChatLine,
  } = useReelPlayer(REEL_SHOWS, startIndex)

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

  // The reel's own item uses 'buynow', while the modal registry keys on 'buy'.
  const handleItemAction = (show: ReelShow) => {
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
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-68px)] max-w-[1440px] gap-4 px-4 py-4">
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
        shows={REEL_SHOWS}
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
  )
}
