"use client"

import { useState } from "react"
import { Link } from "@/lib/router"
import { Button } from "@/components/ui/button"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useCountdown } from "@/components/live/auction-countdown"
import {
  AuctionProduct,
  Listing,
  isActive,
  minimumBid,
} from "@/hooks/useAuction"

const INCREMENTS = [0, 25, 50]

const productOf = (listing: Listing): AuctionProduct | undefined =>
  typeof listing.product_id === "object" ? listing.product_id : undefined

const winnerName = (listing: Listing) =>
  typeof listing.current_winner_id === "object" && listing.current_winner_id
    ? listing.current_winner_id.display_name
    : undefined

/**
 * Үзэгчийн санал өгөх самбар. Хамгийн бага дүн, үлдсэн хугацаа зэрэг серверийн
 * дүрмийг давтан харуулах ба эцсийн шийдийг сервер гаргана.
 */
export function AuctionBidPanel({
  listing,
  onBid,
}: {
  listing: Listing | null
  onBid: (amount: number) => Promise<{ ok: boolean; message?: string }>
}) {
  const { isSignedIn, isLoaded } = useRequireAuth()
  const running = isActive(listing)
  const { label, seconds } = useCountdown(running ? listing?.timer_ends_at : undefined)
  const [increment, setIncrement] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!listing || !running) return null

  const minimum = minimumBid(listing)
  const myBid = minimum + increment
  const leader = winnerName(listing)

  const submit = async () => {
    setBusy(true)
    setError(null)
    const result = await onBid(myBid)
    if (!result.ok) setError(result.message ?? "Санал өгч чадсангүй")
    else setIncrement(0)
    setBusy(false)
  }

  return (
    <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[var(--wn-accent-soft)] px-1.5 py-0.5 text-[10px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase">
              Аукцион
            </span>
            <span
              className={`text-[12px] font-[800] ${
                seconds <= 10 ? "text-[var(--wn-live)]" : "text-[var(--wn-ink-3)]"
              }`}
            >
              {label}
            </span>
          </div>
          <div className="mt-1 truncate text-[15px] font-[700] text-[var(--wn-ink)]">
            {productOf(listing)?.name ?? "Бараа"}
          </div>
          <div className="text-[13px] font-[600] text-[var(--wn-ink-3)]">
            {listing.current_highest_bid_coins != null
              ? `₮${listing.current_highest_bid_coins}${leader ? ` · ${leader}` : ""}`
              : `Эхлэх үнэ ₮${listing.starting_price_coins ?? 0}`}
          </div>
        </div>

        {isLoaded && !isSignedIn ? (
          <Link
            to="/sign-in"
            className="shrink-0 rounded-full bg-[var(--wn-accent)] px-5 py-2.5 text-[14px] font-[700] text-white"
          >
            Нэвтэрч оролцох
          </Link>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex gap-1">
              {INCREMENTS.map((option) => (
                <button
                  key={option}
                  onClick={() => setIncrement(option)}
                  className={`rounded-lg px-2 py-1 text-[12px] font-[700] transition-colors ${
                    increment === option
                      ? "bg-[var(--wn-ink)] text-white"
                      : "bg-[var(--wn-surface-2)] text-[var(--wn-ink-2)]"
                  }`}
                >
                  {option === 0 ? "Min" : `+${option}`}
                </button>
              ))}
            </div>
            <Button onClick={submit} disabled={busy}>
              {busy ? "..." : `₮${myBid} санал`}
            </Button>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}
