"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "@/lib/router"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useWallet } from "@/hooks/useWallet"
import { CountdownRing, useCountdown } from "@/components/live/auction-countdown"
import { AuctionBidModal } from "@/components/live/auction-bid-modal"
import {
  AuctionProduct,
  Listing,
  isActive,
  minimumBid,
} from "@/hooks/useAuction"

const productOf = (listing: Listing): AuctionProduct | undefined =>
  typeof listing.product_id === "object" ? listing.product_id : undefined

const winnerName = (listing: Listing) =>
  typeof listing.current_winner_id === "object" && listing.current_winner_id
    ? listing.current_winner_id.display_name
    : undefined

/**
 * Лайвын доод хэсэгт байрлах лотын мөр. Энэ нь зөвхөн одоо явж буй барааг
 * хураангуйлж харуулах ба саналыг голд гарч ирэх цонхонд өгнө — видеон дээрх
 * товч удирдлага, санал өгөх нарийн шийдвэр хоёрыг тусгаарлана.
 */
export function AuctionBidPanel({
  listing,
  onBid,
}: {
  listing: Listing | null
  onBid: (amount: number) => Promise<{ ok: boolean; message?: string }>
}) {
  const { isSignedIn, isLoaded, requireAuth } = useRequireAuth()
  const {
    available,
    loading: walletLoading,
    failed: walletFailed,
    refresh: refreshWallet,
  } = useWallet()
  const running = isActive(listing)
  const { seconds, progress, urgent } = useCountdown(
    running ? listing?.timer_ends_at : undefined
  )
  // Цонх аль лот дээр нээлттэйг хадгална. Зүгээр л boolean байсан бол лот
  // дуусахад тэр утга үлдэж, дараагийн лот эхэлмэгц цонх өөрөө дахин
  // нээгдэх байсан.
  const [openFor, setOpenFor] = useState<string | null>(null)

  // Хэн нэгэн санал өгмөгц барьцаанд байсан зоос суларч болзошгүй тул
  // үлдэгдлээ дахин уншина — давуулагдсан хэрэглэгч "үлдэгдэл хүрэхгүй"
  // гэсэн хуучин төлөвт гацахгүй. `useWallet` өөрөө mount дээр нэг уншсан
  // байдаг тул анхны ажиглалтыг тэмдэглээд өнгөрнө.
  const highest = listing?.current_highest_bid_coins ?? null
  const seenHighest = useRef<number | null | undefined>(undefined)
  useEffect(() => {
    if (!running) return
    if (seenHighest.current === undefined || seenHighest.current === highest) {
      seenHighest.current = highest
      return
    }
    seenHighest.current = highest
    refreshWallet()
  }, [running, highest, refreshWallet])

  if (!listing || !running) return null

  const open = openFor === listing._id

  const product = productOf(listing)
  const leader = winnerName(listing)
  const current = listing.current_highest_bid_coins



  return (
    <>
      <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur">
        <div className="flex items-center gap-3">
          {product?.images?.[0] && (
            <img
              src={product.images[0]}
              alt=""
              className="size-14 shrink-0 rounded-xl object-cover"
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[var(--wn-accent-soft)] px-1.5 py-0.5 text-[10px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase">
                Дуудлага худалдаа
              </span>
            </div>
            <div className="mt-1 truncate text-[15px] font-[700] text-[var(--wn-ink)]">
              {product?.name ?? "Бараа"}
            </div>
            <div className="truncate text-[13px] font-[600] text-[var(--wn-ink-3)]">
              {current != null
                ? `₮${current.toLocaleString()}${leader ? ` · ${leader}` : ""}`
                : `Эхлэх үнэ ₮${(listing.starting_price_coins ?? 0).toLocaleString()}`}
            </div>
          </div>

          <CountdownRing
            seconds={seconds}
            progress={progress}
            urgent={urgent}
            size={40}
          />

          {isLoaded && !isSignedIn ? (
            <Link
              to="/sign-in"
              className="shrink-0 rounded-full bg-[var(--wn-accent)] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-accent-hover)]"
            >
              Нэвтэрч оролцох
            </Link>
          ) : (
            <button
              onClick={() => requireAuth(() => setOpenFor(listing._id))}
              disabled={!isLoaded}
              className="shrink-0 rounded-full bg-[var(--wn-accent)] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-accent-hover)] disabled:opacity-60"
            >
              ₮{minimumBid(listing).toLocaleString()}-с санал өгөх
            </button>
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
          onBid={onBid}
          onClose={() => setOpenFor(null)}
        />
      )}
    </>
  )
}
