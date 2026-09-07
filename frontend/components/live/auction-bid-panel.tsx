"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "@/lib/router"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useWallet } from "@/hooks/useWallet"
import { CountdownRing, useCountdown } from "@/components/live/auction-countdown"
import { AuctionBidModal } from "@/components/live/auction-bid-modal"
import {
  AuctionBid,
  AuctionProduct,
  Listing,
  isActive,
  minimumBid,
} from "@/hooks/useAuction"

/** Давхардалгүй санал өгөгчдийн тоо. */
const bidderCount = (bids: AuctionBid[]) =>
  new Set(
    bids.map((bid) =>
      typeof bid.buyer_id === "object" ? bid.buyer_id?._id : bid.buyer_id
    )
  ).size

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
  bids,
  onBid,
}: {
  listing: Listing | null
  /** Санал өгсөн хүмүүсийн тоог гаргахад — Browse дэх мөртэй ижил дэд мөр. */
  bids: AuctionBid[]
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
  const bidders = bidderCount(bids)



  return (
    <>
      {/* Browse (`ReelItemBar`)-тай ижил хэмжээ, өнгө, сүүдэр — үзэгч хоёр
          дэлгэцийн хооронд шилжихэд ижил мөр угтана. */}
      <div
        className="absolute inset-x-4 bottom-4 z-20 flex items-center gap-3 rounded-[16px] bg-white p-2.5"
        style={{ boxShadow: "0 12px 32px rgba(12,12,24,0.24)" }}
      >
        {product?.images?.[0] ? (
          <img
            src={product.images[0]}
            alt=""
            className="size-[60px] shrink-0 rounded-[10px] object-cover"
          />
        ) : (
          <div className="size-[60px] shrink-0 rounded-[10px] bg-[var(--wn-shot)]" />
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded bg-[var(--wn-accent-soft)] px-1.5 py-0.5 text-[9px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase">
              Дуудлага худалдаа
            </span>
            <span className="truncate text-[11px] font-[500] text-[var(--wn-ink-3)]">
              {bidders > 0
                ? `${bidders} санал${leader ? ` · хамгийн өндөр ${leader}` : ""}`
                : "Эхний саналыг хүлээж байна"}
            </span>
          </div>
          <div className="truncate text-[14px] leading-tight font-[800] text-[var(--wn-ink)]">
            {product?.name ?? "Бараа"}
          </div>
          <div className="mt-0.5 text-[13px] font-[700] text-[var(--wn-ink-2)]">
            ₮
            {(current ?? listing.starting_price_coins ?? 0).toLocaleString()}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CountdownRing
            seconds={seconds}
            progress={progress}
            urgent={urgent}
            size={36}
          />

          {isLoaded && !isSignedIn ? (
            <Link
              to="/sign-in"
              className="h-[40px] shrink-0 rounded-xl bg-[var(--wn-accent)] px-5 text-[13px] leading-[40px] font-[800] text-white transition-colors hover:bg-[var(--wn-accent-hover)]"
              style={{ boxShadow: "0 6px 18px rgba(91,63,224,0.3)" }}
            >
              Нэвтрэх
            </Link>
          ) : (
            <button
              onClick={() => requireAuth(() => setOpenFor(listing._id))}
              disabled={!isLoaded}
              className="h-[40px] shrink-0 rounded-xl bg-[var(--wn-accent)] px-5 text-[13px] font-[800] text-white transition-colors hover:bg-[var(--wn-accent-hover)] disabled:opacity-60"
              style={{ boxShadow: "0 6px 18px rgba(91,63,224,0.3)" }}
            >
              ₮{minimumBid(listing).toLocaleString()} санал өгөх
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
