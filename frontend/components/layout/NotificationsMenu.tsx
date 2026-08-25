"use client"

import React, { useEffect, useRef, useState } from "react"
import { Bell, Package, Trophy } from "lucide-react"
import { useNavigate } from "@/lib/router"
import { AuctionWin, useMyWins, winProduct, winSeller } from "@/hooks/useMyWins"

const iconButton =
  "w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--wn-surface-2)] transition-colors text-[var(--wn-ink)]"

function relativeTime(dateStr?: string) {
  if (!dateStr) return ""
  const diffMin = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (diffMin < 1) return "Дөнгөж сая"
  if (diffMin < 60) return `${diffMin} мин өмнө`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} цагийн өмнө`
  return `${Math.floor(diffHour / 24)} өдрийн өмнө`
}

function WinRow({
  win,
  unseen,
  onOpen,
}: {
  win: AuctionWin
  unseen: boolean
  onOpen: () => void
}) {
  const product = winProduct(win)
  const seller = winSeller(win)
  const sellerName = seller?.shop_name || seller?.display_name

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex w-full items-start gap-3 border-b border-[var(--wn-line)] p-3 text-left transition-colors last:border-b-0 hover:bg-[var(--wn-surface-2)] ${
        unseen ? "bg-[var(--wn-accent-soft)]" : ""
      }`}
    >
      {product?.images?.[0] ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="size-11 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[var(--wn-surface-2)]">
          <Package className="size-5 text-[var(--wn-ink-3)]" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Trophy className="size-3.5 shrink-0 text-[var(--wn-accent)]" />
          <span className="text-[13px] font-[800] text-[var(--wn-accent)]">
            Та хожлоо!
          </span>
        </div>
        <p className="mt-0.5 text-[14px] font-[600] text-[var(--wn-ink)]">
          <span className="font-[800]">{product?.name ?? "Бараа"}</span> авах эрх
          үүслээ
        </p>
        <p className="mt-0.5 text-[12px] text-[var(--wn-ink-3)]">
          ₮{win.current_highest_bid_coins ?? 0}
          {sellerName ? ` · ${sellerName}` : ""} · {relativeTime(win.updatedAt)}
        </p>
      </div>

      {unseen && (
        <span className="mt-1 size-2 shrink-0 rounded-full bg-[var(--wn-live)]" />
      )}
    </button>
  )
}

/**
 * Мэдэгдлийн хонх. Одоогоор аукцион хожсон тухай мэдэгдлийг харуулна —
 * хэрэглэгч барааг авах эрх үүсмэгц энд орж ирнэ.
 */
export const NotificationsMenu: React.FC = () => {
  const navigate = useNavigate()
  const { wins, loading, unseenCount, markAllSeen, isUnseen } = useMyWins()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Гадна дарахад хаана.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const toggle = () => {
    setOpen((prev) => {
      // Нээх мөчид уншсанд тооцно — жагсаалт хэрэглэгчийн нүдэн дээр байна.
      if (!prev) markAllSeen()
      return !prev
    })
  }

  const openWin = (win: AuctionWin) => {
    setOpen(false)
    const seller = winSeller(win)
    const sellerName = seller?.shop_name || seller?.display_name
    // Худалдан авалтаа баталгаажуулах, хүргэлтээ тохирох гол суваг нь
    // худалдагчтай хийх чат.
    if (sellerName) navigate(`/messages?seller=${encodeURIComponent(sellerName)}`)
    else navigate("/profile?tab=purchases")
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={toggle}
        className={`relative ${iconButton}`}
        aria-label="Мэдэгдэл"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unseenCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--wn-live)] px-1 text-[10px] font-[800] text-white">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[340px] overflow-hidden rounded-2xl border border-[var(--wn-line)] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
          <div className="border-b border-[var(--wn-line)] px-4 py-3">
            <h2 className="text-[15px] font-[800] text-[var(--wn-ink)]">
              Мэдэгдэл
            </h2>
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <p className="p-4 text-[13px] text-[var(--wn-ink-3)]">
                Уншиж байна...
              </p>
            ) : wins.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="mx-auto size-6 text-[var(--wn-ink-4)]" />
                <p className="mt-2 text-[13px] text-[var(--wn-ink-3)]">
                  Одоогоор мэдэгдэл алга.
                </p>
              </div>
            ) : (
              wins.map((win) => (
                <WinRow
                  key={win._id}
                  win={win}
                  unseen={isUnseen(win._id)}
                  onOpen={() => openWin(win)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
