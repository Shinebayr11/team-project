"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { BalanceSummary } from "@/components/modals/BalanceSummary"
import { ModalActionButton } from "@/components/modals/ModalActionButton"
import { CountdownRing, useCountdown } from "@/components/live/auction-countdown"
import { AuctionProduct, Listing, isActive, minimumBid } from "@/hooks/useAuction"

const INCREMENTS = [
  { value: 0, label: "Min" },
  { value: 25, label: "+25" },
  { value: 50, label: "+50" },
]

const productOf = (listing: Listing): AuctionProduct | undefined =>
  typeof listing.product_id === "object" ? listing.product_id : undefined

const winnerName = (listing: Listing) =>
  typeof listing.current_winner_id === "object" && listing.current_winner_id
    ? listing.current_winner_id.display_name
    : undefined

/**
 * Дэлгэцийн голд гарч ирэх санал өгөх цонх. Хамгийн бага дүн, үлдсэн хугацаа
 * зэрэг серверийн дүрмийг давтан харуулах ба эцсийн шийдийг сервер гаргана.
 *
 * Цонх нээлттэй байх зуур лот 2 секунд тутам шинэчлэгддэг. Гэхдээ харагдаж буй
 * дүнг автоматаар дагуулж өсгөхгүй: хэрэглэгч товшихын өмнөхөн өөр хүн санал
 * өгвөл огт өөр дүн зарлагадах эрсдэлтэй. Оронд нь давуулагдсаныг мэдэгдэж,
 * шинэ дүнг хэрэглэгчээр баталгаажуулна.
 */
export function AuctionBidModal({
  listing,
  balance,
  balanceLoading,
  balanceFailed,
  onRetryBalance,
  onBid,
  onClose,
}: {
  listing: Listing
  balance: number
  balanceLoading?: boolean
  balanceFailed?: boolean
  onRetryBalance?: () => void
  onBid: (amount: number) => Promise<{ ok: boolean; message?: string }>
  onClose: () => void
}) {
  const running = isActive(listing)
  const { seconds, progress, urgent } = useCountdown(
    running ? listing.timer_ends_at : undefined
  )
  const [increment, setIncrement] = useState(25)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const minimum = minimumBid(listing)

  // Хэрэглэгчийн хамгийн сүүлд харж, зөвшөөрсөн доод дүн. Цонх нээгдэх үеийн
  // утгаар эхэлж, зөвхөн хэрэглэгч өөрөө баталсан үед л шинэчлэгдэнэ.
  const [basis, setBasis] = useState(minimum)

  const myBid = basis + increment
  // Сонгосон дүн шинэ доод үнэд хүрэхгүй болсон үед л зогсоож батлуулна —
  // өөр хүн санал өгсөн болгонд тасалдуулбал хэрэглэгч товч дээрээ хүрэхгүй.
  const stale = myBid < minimum
  const product = productOf(listing)
  const leader = winnerName(listing)
  const current = listing.current_highest_bid_coins

  const submit = async () => {
    setBusy(true)
    setError(null)
    const result = await onBid(myBid)
    setBusy(false)
    if (result.ok) onClose()
    else setError(result.message ?? "Үнэ санал болгож чадсангүй")
  }

  const affordable = balance >= myBid
  const balanceKnown = !balanceLoading && !balanceFailed

  return (
    <Modal title="Үнэ санал болгох" onClose={onClose}>
      <div className="flex flex-col gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          {product?.images?.[0] ? (
            <img
              src={product.images[0]}
              alt=""
              className="size-16 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="size-16 shrink-0 rounded-xl bg-[var(--wn-shot)]" />
          )}

          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-[700] text-[var(--wn-ink)]">
              {product?.name ?? "Бараа"}
            </div>
            <div className="mt-0.5 text-[14px] font-[600] text-[var(--wn-ink-3)]">
              {current != null
                ? `Одоогийн үнэ: ₮${current.toLocaleString()}`
                : `Эхлэх үнэ: ₮${(listing.starting_price_coins ?? 0).toLocaleString()}`}
            </div>
            {leader && (
              <div className="mt-0.5 truncate text-[12px] font-[600] text-[var(--wn-accent)]">
                Тэргүүлэгч: {leader}
              </div>
            )}
          </div>

          <CountdownRing seconds={seconds} progress={progress} urgent={urgent} />
        </div>

        <div className="flex flex-col items-center py-2">
          <div className="mb-2 text-[12px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase">
            Таны санал
          </div>
          <div className="mb-6 text-[48px] leading-none font-[800] tracking-tight text-[var(--wn-ink)] tabular-nums">
            ₮{myBid.toLocaleString()}
          </div>

          <div
            className="flex items-center gap-3"
            role="radiogroup"
            aria-label="Нэмэх дүн"
          >
            {INCREMENTS.map(({ value, label }) => (
              <button
                key={value}
                role="radio"
                aria-checked={increment === value}
                onClick={() => setIncrement(value)}
                className={`rounded-full px-4 py-2 text-[14px] font-[700] transition-colors ${
                  increment === value
                    ? "bg-[var(--wn-ink)] text-white"
                    : "bg-[var(--wn-surface-2)] text-[var(--wn-ink)] hover:bg-[var(--wn-line)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {balanceFailed ? (
          <div className="flex items-center justify-between rounded-xl bg-[var(--wn-surface-2)] p-4">
            <div className="text-[13px] font-[700] text-[var(--wn-ink-3)]">
              Үлдэгдлийг уншиж чадсангүй
            </div>
            <button
              onClick={onRetryBalance}
              className="text-[13px] font-[800] text-[var(--wn-accent)] hover:underline"
            >
              Дахин оролдох
            </button>
          </div>
        ) : (
          <BalanceSummary balance={balance} cost={myBid} />
        )}

        {error && (
          <p role="alert" className="-mt-3 text-center text-[13px] font-[600] text-[var(--wn-live-deep)]">
            {error}
          </p>
        )}

        {stale ? (
          <div className="flex flex-col gap-3">
            <p role="alert" className="text-center text-[13px] font-[700] text-[var(--wn-live-deep)]">
              Таныг давуулав — шинэ доод үнэ ₮{minimum.toLocaleString()}
            </p>
            {/* Энэ товч зоос зарцуулахгүй, зөвхөн шинэ дүнг харуулна. Зарцуулах
                эсэхийг дараагийн алхамд үлдэгдэлтэй тулгаж шийднэ. */}
            <ModalActionButton
              onClick={() => {
                setBasis(minimum)
                setError(null)
              }}
              enabled
              label={`₮${(minimum + increment).toLocaleString()} болгож шинэчлэх`}
            />
          </div>
        ) : (
          <ModalActionButton
            onClick={submit}
            // Хугацаа дуусахыг сервер шийднэ: төхөөрөмжийн цаг түрүүлж яваа
            // хэрэглэгчийг локал тоолуураар хааж болохгүй. Лот үнэхээр дуусахад
            // эцэг панель цонхыг хаана.
            enabled={affordable && balanceKnown && !busy}
            label={`Үнэ санал болгох — ₮${myBid.toLocaleString()}`}
            disabledLabel={
              busy
                ? "Илгээж байна..."
                : balanceLoading
                  ? "Үлдэгдэл шалгаж байна..."
                  : balanceFailed
                    ? "Дахин оролдоно уу"
                    : "Үлдэгдэл хүрэлцэхгүй"
            }
          />
        )}
      </div>
    </Modal>
  )
}
