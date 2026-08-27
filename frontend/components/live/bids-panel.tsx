"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Trophy } from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/button"
import { useApiClient } from "@/hooks/useApiClient"
import { useCountdown } from "@/components/live/auction-countdown"
import { AuctionBid, AuctionProduct, Listing, isActive } from "@/hooks/useAuction"

const DURATIONS = [30, 60, 120]

const productOf = (listing: Listing): AuctionProduct | undefined =>
  typeof listing.product_id === "object" ? listing.product_id : undefined

const bidderName = (bid: AuctionBid) =>
  (typeof bid.buyer_id === "object" && bid.buyer_id?.display_name) || "Хэрэглэгч"

const winnerOf = (listing: Listing) =>
  typeof listing.current_winner_id === "object" && listing.current_winner_id
    ? listing.current_winner_id
    : undefined

/**
 * Дуусаж зарагдсан лотын ялагч. Худалдагч хүргэлт, төлбөрөө тохирохын тулд
 * шууд чат бичих боломжтой байх ёстой тул нэр дээр нь дарж болно.
 *
 * Чат шинэ таб дээр нээгдэнэ: энэ самбар лайвын дотор байдаг тул
 * тухайн таб дээрээ шилжвэл LiveKit-ийн холболт тасарч, шоу унана.
 */
function WinnerBanner({ listing }: { listing: Listing }) {
  const winner = winnerOf(listing)
  const name = winner?.display_name ?? "Хэрэглэгч"
  const product = productOf(listing)

  return (
    <a
      href={`/messages?seller=${encodeURIComponent(name)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center gap-3 border-b border-[var(--wn-line)] bg-[var(--wn-accent-soft)] p-3 text-left transition-colors hover:bg-[var(--wn-accent-soft-hover)]"
    >
      <Avatar name={name} size={36} tint="white" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Trophy className="size-3.5 shrink-0 text-[var(--wn-accent)]" />
          <span className="text-[11px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase">
            Ялагч
          </span>
        </div>
        <div className="mt-0.5 truncate text-[14px] font-[800] text-[var(--wn-ink)]">
          {name}
        </div>
        <div className="truncate text-[12px] font-[600] text-[var(--wn-ink-3)]">
          {product?.name ?? "Бараа"} · ₮{listing.current_highest_bid_coins ?? 0}
        </div>
      </div>

      <MessageSquare className="size-4 shrink-0 text-[var(--wn-accent)]" />
    </a>
  )
}

/** Худалдагч дуудлага худалдаанд гаргах бараагаа сонгох хэсэг. */
function StartAuctionForm({
  onStart,
}: {
  onStart: (input: {
    product_id: string
    starting_price_coins: number
    duration_seconds: number
  }) => Promise<{ ok: boolean; message?: string }>
}) {
  const { callApi } = useApiClient()
  const [products, setProducts] = useState<AuctionProduct[]>([])
  const [productId, setProductId] = useState("")
  const [price, setPrice] = useState("100")
  const [duration, setDuration] = useState(60)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    callApi<{ products: AuctionProduct[] }>("/api/product/mine")
      .then((res) => {
        if (cancelled) return
        setProducts(res.products)
        setProductId((current) => current || res.products[0]?._id || "")
      })
      .catch(() => {
        if (!cancelled) setError("Бараагаа уншиж чадсангүй")
      })
    return () => {
      cancelled = true
    }
  }, [callApi])

  const start = async () => {
    setBusy(true)
    setError(null)
    const result = await onStart({
      product_id: productId,
      starting_price_coins: Number(price) || 0,
      duration_seconds: duration,
    })
    if (!result.ok) setError(result.message ?? "Эхлүүлж чадсангүй")
    setBusy(false)
  }

  if (!products.length) {
    return (
      <div className="p-4 text-[13px] text-[var(--wn-ink-3)]">
        {error ?? "Бараа алга. Эхлээд лайв эхлэх хуудсаас бараагаа бүртгээрэй."}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        aria-label="Бараа"
        className="h-9 w-full rounded-lg border border-[var(--wn-line)] bg-white px-2 text-[13px] text-[var(--wn-ink)]"
      >
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name}
          </option>
        ))}
      </select>

      <label className="text-[12px] font-[700] text-[var(--wn-ink-3)]">
        Эхлэх үнэ
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 h-9 w-full rounded-lg border border-[var(--wn-line)] bg-white px-2 text-[13px] font-[600] text-[var(--wn-ink)]"
        />
      </label>

      <div className="flex gap-1">
        {DURATIONS.map((option) => (
          <button
            key={option}
            onClick={() => setDuration(option)}
            className={`flex-1 rounded-lg py-1.5 text-[12px] font-[700] transition-colors ${
              duration === option
                ? "bg-[var(--wn-accent)] text-white"
                : "bg-[var(--wn-surface-2)] text-[var(--wn-ink-2)]"
            }`}
          >
            {option}с
          </button>
        ))}
      </div>

      {error && <p className="text-[12px] text-red-500">{error}</p>}

      <Button size="sm" onClick={start} disabled={busy || !productId}>
        {busy ? "Эхэлж байна..." : "Дуудлага худалдаа эхлүүлэх"}
      </Button>
    </div>
  )
}

/**
 * Худалдагчийн дуудлага худалдааны самбар: явж буй лот, ирсэн саналууд, эсвэл шинэ лот
 * гаргах хэсэг.
 */
export function BidsPanel({
  listing,
  bids,
  onStart,
  onClose,
}: {
  listing: Listing | null
  bids: AuctionBid[]
  onStart: (input: {
    product_id: string
    starting_price_coins: number
    duration_seconds: number
  }) => Promise<{ ok: boolean; message?: string }>
  onClose: () => void
}) {
  const running = isActive(listing)
  const { label } = useCountdown(running ? listing?.timer_ends_at : undefined)
  const product = listing ? productOf(listing) : undefined

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[var(--wn-line)] bg-white">
      <div className="flex items-center justify-between border-b border-[var(--wn-line)] p-3">
        <h2 className="text-[14px] font-[800] text-[var(--wn-ink)]">
          {running ? "Дуудлага худалдаа" : "Бараа гаргах"}
        </h2>
        {running && (
          <span className="rounded-full bg-[var(--wn-accent-soft)] px-2 py-0.5 text-[12px] font-[800] text-[var(--wn-accent)]">
            {label}
          </span>
        )}
      </div>

      {!running ? (
        <div className="flex-1 overflow-y-auto">
          {/* Дуудлага худалдаа дуусаад ялагчтай гарсан бол хамгийн дээр нь харуулна —
              худалдагчийн дараагийн алхам бол түүнтэй холбогдох. */}
          {listing && listing.status === "sold" && winnerOf(listing) ? (
            <WinnerBanner listing={listing} />
          ) : (
            listing && (
              <div className="border-b border-[var(--wn-line)] p-3 text-[12px] text-[var(--wn-ink-3)]">
                Сүүлийн лот{" "}
                <span className="font-[700] text-[var(--wn-ink-2)]">
                  {productOf(listing)?.name}
                </span>{" "}
                — үнийн саналгүй дууссан
              </div>
            )
          )}
          <StartAuctionForm onStart={onStart} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 border-b border-[var(--wn-line)] p-3">
            {product?.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="size-12 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0">
              <div className="truncate text-[14px] font-[700] text-[var(--wn-ink)]">
                {product?.name ?? "Бараа"}
              </div>
              <div className="mt-1 text-[13px] font-[600] text-[var(--wn-ink-3)]">
                {listing?.current_highest_bid_coins != null
                  ? `Одоогийн үнэ ₮${listing.current_highest_bid_coins}`
                  : `Эхлэх үнэ ₮${listing?.starting_price_coins ?? 0}`}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {bids.length === 0 ? (
              <p className="px-2 py-3 text-[13px] text-[var(--wn-ink-3)]">
                Одоогоор үнийн санал алга.
              </p>
            ) : (
              bids.map((bid, index) => {
                const name = bidderName(bid)
                const highest = index === 0
                return (
                  <div
                    key={bid._id}
                    className={`flex items-center gap-3 rounded-xl p-2 ${
                      highest ? "bg-[var(--wn-accent-soft)]" : ""
                    }`}
                  >
                    <Avatar name={name} size={32} tint="var(--wn-surface-2)" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-[600] text-[var(--wn-ink)]">
                        {name}
                      </div>
                      {highest && (
                        <div className="text-[11px] font-[700] text-[var(--wn-accent)]">
                          Хамгийн өндөр үнэ санал болгогч
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 text-[13px] font-[700] text-[var(--wn-ink-2)]">
                      ₮{bid.amount_coins}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          <div className="border-t border-[var(--wn-line)] p-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Одоо хаах
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
