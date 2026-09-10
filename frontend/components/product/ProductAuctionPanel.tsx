"use client"

import React, { useState } from "react"
import { Gavel } from "lucide-react"

import { useApiClient } from "@/hooks/useApiClient"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useWallet } from "@/hooks/useWallet"
import { Listing, isActive } from "@/hooks/useAuction"
import { AuctionBidModal } from "@/components/live/auction-bid-modal"
import { CountdownRing, useCountdown } from "@/components/live/auction-countdown"

/** Үлдсэн хугацааг хоног/цагаар. Пост хэлбэр нь хоногоор үргэлжилдэг тул зөвхөн секунд хангалтгүй. */
const remainingLabel = (seconds: number) => {
  if (seconds <= 0) return "Дууссан"
  const days = Math.floor(seconds / 86_400)
  const hours = Math.floor((seconds % 86_400) / 3_600)
  const minutes = Math.floor((seconds % 3_600) / 60)
  if (days > 0) return `${days} хоног ${hours} цаг`
  if (hours > 0) return `${hours} цаг ${minutes} мин`
  return `${minutes} мин ${seconds % 60} с`
}

/**
 * Барааны хуудсан дээрх дуудлага худалдаа.
 *
 * Эфирийн лот секундээр явдаг бол энэ нь хоногоор үргэлжилнэ — Yahoo Auctions
 * шиг. Санал өгөх цонх, тоолуур, серверийн дүрэм нь эфирийнхтэй ЯГ ижил тул
 * `AuctionBidModal`-ыг дахин ашиглана.
 */
export const ProductAuctionPanel: React.FC<{
  listing: Listing
  onBidPlaced: () => void
}> = ({ listing, onBidPlaced }) => {
  const { callApi } = useApiClient()
  const { requireAuth } = useRequireAuth()
  const {
    available,
    loading: walletLoading,
    failed: walletFailed,
    refresh: refreshWallet,
  } = useWallet()
  const [open, setOpen] = useState(false)

  const running = isActive(listing)
  const { seconds, progress, urgent } = useCountdown(
    running ? listing.timer_ends_at : undefined
  )

  const current = listing.current_highest_bid_coins
  const starting = listing.starting_price_coins ?? 0

  const placeBid = async (amount: number) => {
    try {
      await callApi("/api/bids", {
        method: "POST",
        body: JSON.stringify({ listing_id: listing._id, amount_coins: amount }),
      })
      // Үнэ, ялагч хоёуланг серверээс дахин уншина — локал таамаглал нь өөр
      // хүн зэрэг санал өгсөн үед худал үзүүлнэ.
      onBidPlaced()
      refreshWallet()
      return { ok: true }
    } catch (error) {
      onBidPlaced()
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Санал өгч чадсангүй",
      }
    }
  }

  return (
    <>
      <div className="mb-6 rounded-2xl border border-[var(--wn-line)] bg-[var(--wn-surface-2)] p-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase">
          <Gavel className="size-3.5" />
          Дуудлага худалдаа
        </div>

        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-[600] text-[var(--wn-ink-3)]">
              {current != null ? "Одоогийн санал" : "Эхлэх үнэ"}
            </div>
            <div className="text-[28px] leading-tight font-[800] text-[var(--wn-ink)] tabular-nums">
              ₮{(current ?? starting).toLocaleString()}
            </div>
            <div className="mt-0.5 text-[12px] font-[600] text-[var(--wn-ink-3)]">
              Үлдсэн: {remainingLabel(seconds)}
            </div>
          </div>

          <CountdownRing seconds={seconds} progress={progress} urgent={urgent} />
        </div>

        <button
          onClick={() => requireAuth(() => setOpen(true))}
          disabled={!running}
          className="mt-4 h-[52px] w-full rounded-xl bg-[var(--wn-accent)] text-[15px] font-[800] text-white transition-colors hover:bg-[var(--wn-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? "Үнийн санал өгөх" : "Хугацаа дууслаа"}
        </button>
      </div>

      {open && (
        <AuctionBidModal
          listing={listing}
          balance={available}
          balanceLoading={walletLoading}
          balanceFailed={walletFailed}
          onRetryBalance={refreshWallet}
          onBid={placeBid}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
