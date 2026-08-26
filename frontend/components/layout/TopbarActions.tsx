"use client"

import React from "react"
import { Link } from "@/lib/router"
import { ShoppingCart, MessageSquare, Heart, Radio } from "lucide-react"
import { useActiveStream } from "@/hooks/useActiveStream"
import { useDisplayName } from "@/hooks/useDisplayName"
import { useSellerGate } from "@/hooks/useSellerGate"
import { useSellerGateTrigger } from "@/components/seller/SellerGateProvider"
import { NotificationsMenu } from "@/components/layout/NotificationsMenu"

interface TopbarActionsProps {
  creditsLabel: string
  cartCount: number
  unreadCount: number
  onOpenCart: () => void
}

const iconButton =
  "w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--wn-surface-2)] transition-colors text-[var(--wn-ink)]"
const badge =
  "absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--wn-live)] border border-white"

export const TopbarActions: React.FC<TopbarActionsProps> = ({
  creditsLabel,
  cartCount,
  unreadCount,
  onOpenCart,
}) => {
  const activeStream = useActiveStream()
  const { initial } = useDisplayName()
  const sellerGate = useSellerGate()
  const gateTriggerRef = useSellerGateTrigger<HTMLButtonElement>()

  return (
    <div className="flex items-center gap-2">
      {/* Шууд дамжуулалт явж байвал түүн рүү нь буцах богино зам. */}
      {activeStream && (
        <Link
          to={`/live/${activeStream.roomName}?host=1&title=${encodeURIComponent(activeStream.title)}&showId=${activeStream.showId}`}
          className="mr-2 flex items-center gap-1.5 rounded-full bg-[var(--wn-live)] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:opacity-90"
        >
          <Radio className="h-4 w-4" />
          Миний Live
        </Link>
      )}

      {/*
        Үргэлж харагдана, үргэлж дарагдана — түгжээний тэмдэг ч, идэвхгүй
        төлөв ч байхгүй. Идэвхтэй худалдагчийг шууд самбар руу, бусдыг
        идэвхжүүлэх хуудас руу аваачна.
      */}
      <button
        ref={gateTriggerRef}
        type="button"
        onClick={sellerGate.open}
        className="mr-2 rounded-full bg-[var(--wn-surface-2)] px-5 py-2.5 text-[14px] font-[700] text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-line)]"
      >
        Seller Hub
      </button>

      <Link
        to="/profile?tab=following"
        className={iconButton}
        aria-label="Following"
      >
        <Heart className="h-5 w-5" />
      </Link>

      <Link
        to="/messages"
        className={`relative ${iconButton}`}
        aria-label="Messages"
      >
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && <div className={badge} />}
      </Link>

      <NotificationsMenu />

      <Link
        to="/wallet"
        className="ml-2 flex h-[38px] items-center rounded-full bg-[var(--wn-accent)] px-1 pr-4 text-white transition-colors hover:bg-[var(--wn-accent-hover)]"
      >
        <div className="mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/20">
          <span className="text-[14px] font-[700]">₮</span>
        </div>
        <span className="text-[15px] font-[700]">{creditsLabel}</span>
      </Link>

      <button
        onClick={onOpenCart}
        className={`relative ${iconButton} ml-2`}
        aria-label="Cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && <div className={badge} />}
      </button>

      <Link
        to="/profile"
        className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--wn-ink)] text-[15px] font-[700] text-white uppercase transition-opacity hover:opacity-80"
      >
        {initial}
      </Link>
    </div>
  )
}
