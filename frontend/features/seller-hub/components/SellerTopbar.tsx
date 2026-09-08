"use client"

import React from 'react';
import { Search, Plus, MessageSquare, Menu } from 'lucide-react';

interface SellerTopbarProps {
  /** Гар утасны цэсний хуудсыг нээнэ. 1024px-ээс доош л харагдана. */
  onOpenNav: () => void;
}

export const SellerTopbar: React.FC<SellerTopbarProps> = ({ onOpenNav }) => (
  <header className="h-16 bg-white border-b border-[var(--wn-admin-card-border)] flex items-center justify-between gap-3 px-4 lg:px-8 sticky top-0 z-20 shrink-0">
    <button
      type="button"
      onClick={onOpenNav}
      aria-label="Цэс нээх"
      className="lg:hidden shrink-0 w-10 h-10 -ml-1 rounded-lg flex items-center justify-center text-[var(--wn-admin-ink-2)] hover:bg-[var(--wn-admin-nav-hover)] transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>

    <div className="flex-1 min-w-0 max-w-2xl">
      <div className="relative flex items-center w-full h-10 rounded-full bg-[var(--wn-admin-chip)] px-4">
        <Search className="w-4 h-4 text-[var(--wn-admin-muted)] mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Худалдагчийн самбараас хайх"
          aria-label="Худалдагчийн самбараас хайх"
          className="bg-transparent border-none outline-none w-full min-w-0 text-[14px] text-black placeholder:text-[var(--wn-admin-muted)]"
        />
      </div>
    </div>

    <div className="flex items-center gap-4 sm:gap-5 shrink-0">
      {/* 375px дээр зай чөлөөлөхийн тулд хоёрдогч үйлдлүүд нуугдана. */}
      <button className="hidden sm:block text-[var(--wn-admin-ink-2)] hover:text-black transition-colors" aria-label="Үүсгэх">
        <Plus className="w-5 h-5" />
      </button>
      <button className="hidden sm:block text-[var(--wn-admin-ink-2)] hover:text-black transition-colors" aria-label="Зурвас">
        <MessageSquare className="w-5 h-5" />
      </button>
      <div className="w-8 h-8 rounded-full bg-[var(--wn-admin-chip-2)] overflow-hidden border border-[var(--wn-ink-4)] shrink-0">
        <img src="https://picsum.photos/32/32" alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  </header>
);
