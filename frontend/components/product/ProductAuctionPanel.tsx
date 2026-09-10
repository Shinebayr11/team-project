"use client"

import React, { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Gavel } from "lucide-react"

import { useApiClient } from "@/hooks/useApiClient"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useWallet } from "@/hooks/useWallet"
import { AuctionBid, Listing, bidderName, isActive } from "@/hooks/useAuction"
import { Avatar } from "@/components/ui/Avatar"
import { AuctionBidModal } from "@/components/live/auction-bid-modal"
import { CountdownRing, useCountdown } from "@/components/live/auction-countdown"

/** Нэг хуудсанд харагдах саналын тоо. */
// ponytail: сервер хамгийн ихдээ 50 санал буцаадаг тул 10 хуудас хүртэл
// харагдана. Илүү гүн шаардвал `/api/bids`-д skip/limit нэмнэ.
const PAGE_SIZE = 5

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
  const [bids, setBids] = useState<AuctionBid[]>([])
  const [page, setPage] = useState(0)

  const running = isActive(listing)
  const { seconds, progress, urgent } = useCountdown(
    running ? listing.timer_ends_at : undefined
  )

  const current = listing.current_highest_bid_coins
  const starting = listing.starting_price_coins ?? 0

  // Тэргүүлж буй үнэ өөрчлөгдөх бүрд шинэ санал орсон гэсэн үг — жагсаалтаа
  // дахин уншина. Хуудас өөрөө ажиллаж буй лотыг тогтмол сорьдоггүй тул
  // энэ нь `onBidPlaced` -> `refresh` -ийн дараа ажиллана.
  useEffect(() => {
    let cancelled = false
    callApi<{ data: AuctionBid[] }>(`/api/bids?listing_id=${listing._id}`)
      .then((res) => {
        if (!cancelled) setBids(res.data)
      })
      .catch((error) => {
        console.error("Үнийн саналууд уншиж чадсангүй:", error)
      })
    return () => {
      cancelled = true
    }
  }, [callApi, listing._id, current])

  const pages = Math.max(Math.ceil(bids.length / PAGE_SIZE), 1)
  // Хуудсыг ДАРАЛТ болгож барина: жагсаалт богиносоход сүүлийн хуудас руу
  // өөрөө буцна — эс бөгөөс хоосон хуудсан дээр гацна.
  const shown = Math.min(page, pages - 1)
  const visible = bids.slice(shown * PAGE_SIZE, shown * PAGE_SIZE + PAGE_SIZE)

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

        <div className="mt-4 border-t border-[var(--wn-line)] pt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-[800] tracking-wider text-[var(--wn-ink-3)] uppercase">
              Үнийн саналууд
            </span>
            {bids.length > 0 && (
              <span className="text-[12px] font-[600] text-[var(--wn-ink-3)] tabular-nums">
                {bids.length}
              </span>
            )}
          </div>

          {bids.length === 0 ? (
            <p className="py-2 text-[13px] font-[600] text-[var(--wn-ink-3)]">
              Одоогоор үнийн санал алга.
            </p>
          ) : (
            <ul>
              {visible.map((bid, index) => {
                // Эхний хуудасны эхний мөр л тэргүүлнэ — сервер дүнгээр
                // буурахаар эрэмбэлж өгдөг.
                const leading = shown === 0 && index === 0
                const name = bidderName(bid)
                return (
                  <li
                    key={bid._id}
                    className={`flex items-center gap-3 rounded-xl p-2 ${
                      leading ? "bg-[var(--wn-accent-soft)]" : ""
                    }`}
                  >
                    <Avatar name={name} size={32} tint="var(--wn-surface)" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-[600] text-[var(--wn-ink)]">
                        {name}
                      </div>
                      {leading && (
                        <div className="text-[11px] font-[700] text-[var(--wn-accent)]">
                          {running ? "Тэргүүлж буй санал" : "Ялсан санал"}
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 text-[13px] font-[700] text-[var(--wn-ink-2)] tabular-nums">
                      ₮{bid.amount_coins.toLocaleString()}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          {pages > 1 && (
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                aria-label="Өмнөх хуудас"
                onClick={() => setPage(shown - 1)}
                disabled={shown === 0}
                className="grid size-7 place-items-center rounded-lg border border-[var(--wn-line)] text-[var(--wn-ink-2)] transition-colors hover:bg-[var(--wn-accent-wash)] disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[12px] font-[700] text-[var(--wn-ink-3)] tabular-nums">
                {shown + 1} / {pages}
              </span>
              <button
                type="button"
                aria-label="Дараах хуудас"
                onClick={() => setPage(shown + 1)}
                disabled={shown >= pages - 1}
                className="grid size-7 place-items-center rounded-lg border border-[var(--wn-line)] text-[var(--wn-ink-2)] transition-colors hover:bg-[var(--wn-accent-wash)] disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
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
