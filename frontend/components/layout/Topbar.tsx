"use client"

import React from 'react';
import { useLocation } from '@/lib/router';
import { Search } from 'lucide-react';
import { useStore } from '../../store';
import { TopbarNav } from './TopbarNav';
import { TopbarActions } from './TopbarActions';

export const Topbar: React.FC = () => {
  const { creditsLabel, cartCount, unread, openModal } = useStore();
  const { pathname } = useLocation();

  return (
    <div className="sticky top-0 z-50 h-[68px] border-b border-[var(--wn-line)] bg-white flex items-center px-6 justify-between">
      <TopbarNav path={pathname} />

      <div className="flex-1 max-w-[600px] mx-6">
        <div className="relative flex items-center w-full h-[44px] rounded-full bg-[var(--wn-surface-2)] border border-[var(--wn-line)] px-4">
          <Search className="w-5 h-5 text-[var(--wn-ink-4)] mr-2" />
          <input
            type="text"
            placeholder="Search WhyNot"
            aria-label="Search WhyNot"
            className="bg-transparent border-none outline-none w-full text-[15px] text-[var(--wn-ink)] placeholder:text-[var(--wn-ink-4)] font-[500]"
          />
        </div>
      </div>

      <TopbarActions
        creditsLabel={creditsLabel()}
        cartCount={cartCount()}
        unreadCount={unread()}
        onOpenCart={() => openModal('cart')}
      />
    </div>
  );
};