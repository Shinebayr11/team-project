"use client"

import React, { useEffect, useRef, useState } from "react"
import { Bell, Package, Trophy, Tag } from "lucide-react"
import { useNavigate } from "@/lib/router"
import { AuctionWin, useMyWins, winProduct, winSeller } from "@/hooks/useMyWins"
import {
  AuctionSale,
  saleProduct,
  saleWinner,
  useMySales,
  winnerName,
} from "@/hooks/useMySales"
import { useSeenIds } from "@/hooks/useSeenIds"

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
          <span className="font-[800]">{product?.name ?? "Бараа"}</span> авах
          эрх үүслээ
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

/** Худалдагчийн тал: лот зарагдсан тухай мэдэгдэл. */
function SaleRow({
  sale,
  unseen,
  onOpen,
}: {
  sale: AuctionSale
  unseen: boolean
  onOpen: () => void
}) {
  const product = saleProduct(sale)
  const winner = saleWinner(sale)

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
          <Tag className="size-3.5 shrink-0 text-emerald-600" />
          <span className="text-[13px] font-[800] text-emerald-600">
            Таны бараа зарагдлаа
          </span>
        </div>
        <p className="mt-0.5 text-[14px] font-[600] text-[var(--wn-ink)]">
          <span className="font-[800]">{product?.name ?? "Бараа"}</span>-г{" "}
          {winnerName(winner)} авлаа
        </p>
        <p className="mt-0.5 text-[12px] text-[var(--wn-ink-3)]">
          ₮{sale.current_highest_bid_coins ?? 0} · {relativeTime(sale.updatedAt)}
        </p>
      </div>

      {unseen && (
        <span className="mt-1 size-2 shrink-0 rounded-full bg-[var(--wn-live)]" />
      )}
    </button>
  )
}

/**
 * Мэдэгдлийн хонх. Одоогоор дуудлага худалдаа хожсон тухай мэдэгдлийг харуулна —
 * хэрэглэгч барааг авах эрх үүсмэгц энд орж ирнэ.
 */
export const NotificationsMenu: React.FC = () => {
  const navigate = useNavigate()
  const { wins, loading } = useMyWins()
  // Худалдагчийн тал: өөрийн зарагдсан лотууд. Хожил, борлуулалт хоёр нэг
  // жагсаалтад цагийн дарааллаар орно.
  const { sales, loading: salesLoading } = useMySales()

  const feed = React.useMemo(() => {
    const winIds = new Set(wins.map((win) => win._id))
    const saleIds = new Set(sales.map((sale) => sale._id))

    // Өөрөөсөө худалдан авсан лот хожил, борлуулалт ХОЁУЛАНД нь ирдэг: түлхүүр
    // давхардаад зогсохгүй, холбогдох нөгөө тал байхгүй тул чат ч нээгдэхгүй
    // (сервер "Өөртэйгөө чатлах боломжгүй" гэж татгалзана). Иймд алгасна.
    return [
      ...wins
        .filter((win) => !saleIds.has(win._id))
        .map((win) => ({ kind: "win" as const, at: win.updatedAt, win })),
      ...sales
        .filter((sale) => !winIds.has(sale._id))
        .map((sale) => ({ kind: "sale" as const, at: sale.updatedAt, sale })),
    ].sort((a, b) => new Date(b.at ?? 0).getTime() - new Date(a.at ?? 0).getTime())
  }, [wins, sales])

  // "Уншсан" тэмдэглэгээ нь жагсаалтад ҮНЭХЭЭР харагдаж буй мөрүүдээр
  // тоологдоно — эс тэгвээс хонхны тоо мөрийн тооноос зөрнө.
  const feedWinIds = React.useMemo(
    () => feed.flatMap((item) => (item.kind === "win" ? [item.win._id] : [])),
    [feed]
  )
  const feedSaleIds = React.useMemo(
    () => feed.flatMap((item) => (item.kind === "sale" ? [item.sale._id] : [])),
    [feed]
  )
  const { unseenCount, markAllSeen, isUnseen } = useSeenIds("auctionWinsSeen", feedWinIds)
  const {
    unseenCount: unseenSales,
    markAllSeen: markSalesSeen,
    isUnseen: isSaleUnseen,
  } = useSeenIds("auctionSalesSeen", feedSaleIds)

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
      if (!prev) {
        markAllSeen()
        markSalesSeen()
      }
      return !prev
    })
  }

  const openWin = (win: AuctionWin) => {
    setOpen(false)
    const seller = winSeller(win)
    // Худалдан авалтаа баталгаажуулах, хүргэлтээ тохирох гол суваг нь
    // худалдагчтай хийх чат. Нэрээр биш id-гаар нээнэ — ижил нэртэй
    // хэрэглэгчид ялгарах ба сервер ярианы мөрөө id-гаар л олдог.
    if (seller?._id) navigate(`/messages?user=${seller._id}`)
    else navigate("/profile?tab=purchases")
  }

  const openSale = (sale: AuctionSale) => {
    setOpen(false)
    const winner = saleWinner(sale)
    // Худалдагчийн дараагийн алхам бол ялагчтай хүргэлт, төлбөрөө тохирох.
    if (winner?._id) navigate(`/messages?user=${winner._id}`)
    else navigate("/seller/orders")
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
        {unseenCount + unseenSales > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--wn-live)] px-1 text-[10px] font-[800] text-white">
            {unseenCount + unseenSales > 9 ? "9+" : unseenCount + unseenSales}
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
            {loading || salesLoading ? (
              <p className="p-4 text-[13px] text-[var(--wn-ink-3)]">
                Уншиж байна...
              </p>
            ) : feed.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="mx-auto size-6 text-[var(--wn-ink-4)]" />
                <p className="mt-2 text-[13px] text-[var(--wn-ink-3)]">
                  Одоогоор мэдэгдэл алга.
                </p>
              </div>
            ) : (
              feed.map((item) =>
                item.kind === "win" ? (
                  <WinRow
                    key={`win-${item.win._id}`}
                    win={item.win}
                    unseen={isUnseen(item.win._id)}
                    onOpen={() => openWin(item.win)}
                  />
                ) : (
                  <SaleRow
                    key={`sale-${item.sale._id}`}
                    sale={item.sale}
                    unseen={isSaleUnseen(item.sale._id)}
                    onOpen={() => openSale(item.sale)}
                  />
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
