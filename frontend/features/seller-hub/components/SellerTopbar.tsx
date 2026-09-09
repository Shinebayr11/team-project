"use client"

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { MessageSquare, Menu } from 'lucide-react';
import { Link } from '@/lib/router';

interface SellerTopbarProps {
  /** Гар утасны цэсний хуудсыг нээнэ. 1024px-ээс доош л харагдана. */
  onOpenNav: () => void;
}

/**
 * Самбарын толгой. Өмнө нь энд бүх хуудсанд зориулсан хайлтын талбар, «Үүсгэх»,
 * «Зурвас» гурван удирдлага байсан ч гурвуулаа ямар ч үйлдэл дуудахгүй байв —
 * хайлт нь дэлгэц бүрийн өөрийн `SellerSearchField`-тэй давхардаж, «Үүсгэх» нь
 * юуг үүсгэхээ ч заадаггүй байсан тул хассан. Үлдсэн хоёр нь жинхэнэ хаяг руу
 * очно.
 */
export const SellerTopbar: React.FC<SellerTopbarProps> = ({ onOpenNav }) => {
  const { user } = useUser();

  return (
    <header className="h-16 bg-white border-b border-[var(--wn-admin-card-border)] flex items-center justify-between gap-3 px-4 lg:px-8 sticky top-0 z-20 shrink-0">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Цэс нээх"
        className="lg:hidden shrink-0 w-10 h-10 -ml-1 rounded-lg flex items-center justify-center text-[var(--wn-admin-ink-2)] hover:bg-[var(--wn-admin-nav-hover)] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4 sm:gap-5 shrink-0">
        <Link
          to="/messages"
          aria-label="Зурвас"
          className="text-[var(--wn-admin-ink-2)] hover:text-black transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
        </Link>
        <Link
          to="/seller/settings"
          aria-label="Профайлын тохиргоо"
          className="w-8 h-8 rounded-full bg-[var(--wn-admin-chip-2)] overflow-hidden border border-[var(--wn-ink-4)] shrink-0"
        >
          {user?.imageUrl && (
            <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
          )}
        </Link>
      </div>
    </header>
  );
};
