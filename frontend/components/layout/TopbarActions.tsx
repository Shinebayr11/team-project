"use client"

import React from 'react';
import { Link } from '@/lib/router';
import { ShoppingCart, MessageSquare, Heart, Bell } from 'lucide-react';

interface TopbarActionsProps {
  creditsLabel: string;
  cartCount: number;
  unreadCount: number;
  onOpenCart: () => void;
}

const iconButton = 'w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--wn-surface-2)] transition-colors text-[var(--wn-ink)]';
const badge = 'absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--wn-live)] border border-white';

export const TopbarActions: React.FC<TopbarActionsProps> = ({
  creditsLabel, cartCount, unreadCount, onOpenCart,
}) => (
  <div className="flex items-center gap-2">
    {/* Seller hub (mock data). Going live itself now lives in Seller Hub > Shows. */}
    <Link to="/admin" className="px-5 py-2.5 rounded-full bg-[var(--wn-surface-2)] text-[14px] font-[700] text-[var(--wn-ink)] hover:bg-[var(--wn-line)] transition-colors mr-2">
      Become a Seller
    </Link>

    <Link to="/profile?tab=following" className={iconButton} aria-label="Following">
      <Heart className="w-5 h-5" />
    </Link>

    <Link to="/messages" className={`relative ${iconButton}`} aria-label="Messages">
      <MessageSquare className="w-5 h-5" />
      {unreadCount > 0 && <div className={badge} />}
    </Link>

    <button className={iconButton} aria-label="Notifications">
      <Bell className="w-5 h-5" />
    </button>

    <Link to="/wallet" className="h-[38px] rounded-full bg-[var(--wn-accent)] text-white flex items-center px-1 pr-4 hover:bg-[var(--wn-accent-hover)] transition-colors ml-2">
      <div className="w-[30px] h-[30px] rounded-full bg-white/20 flex items-center justify-center mr-2">
        <span className="font-[700] text-[14px]">₮</span>
      </div>
      <span className="font-[700] text-[15px]">{creditsLabel}</span>
    </Link>

    <button onClick={onOpenCart} className={`relative ${iconButton} ml-2`} aria-label="Cart">
      <ShoppingCart className="w-5 h-5" />
      {cartCount > 0 && <div className={badge} />}
    </button>

    <Link to="/profile" className="w-10 h-10 rounded-full bg-[var(--wn-ink)] flex items-center justify-center text-white font-[700] text-[15px] ml-2 hover:opacity-80 transition-opacity">
      J
    </Link>
  </div>
);