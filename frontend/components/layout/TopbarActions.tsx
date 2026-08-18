"use client"

import React from "react"
import { Link } from "@/lib/router"
import { ShoppingCart, MessageSquare, Heart, Bell } from "lucide-react"
import { useUser } from "@clerk/nextjs"

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
  const { user } = useUser()
  const initial =
    user?.username?.[0] ??
    user?.firstName?.[0] ??
    user?.primaryEmailAddress?.emailAddress?.[0] ??
    "?"

  return (
    <div className="flex items-center gap-2">
      {/* Seller hub (mock data). Going live itself now lives in Seller Hub > Shows. */}
      <Link
        to="/admin"
        className="mr-2 rounded-full bg-[var(--wn-surface-2)] px-5 py-2.5 text-[14px] font-[700] text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-line)]"
      >
        Become a Seller
      </Link>

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

      <button className={iconButton} aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </button>

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
