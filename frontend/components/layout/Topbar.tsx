"use client"

import React from 'react';
import { useLocation, Link } from '@/lib/router';
import { Search } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useStore } from '../../store';
import { TopbarNav } from './TopbarNav';
import { TopbarActions } from './TopbarActions';

export const Topbar: React.FC = () => {
  const { creditsLabel, cartCount, openModal } = useStore();
  const { pathname } = useLocation();
  const { user } = useUser();

  return (
    <div className="sticky top-0 z-50 h-[68px] border-b border-[var(--wn-line)] bg-white flex items-center gap-2 px-4 lg:px-6 justify-between">
      <TopbarNav path={pathname} />

      <div className="hidden md:block flex-1 max-w-[600px] mx-3 lg:mx-6">
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

      {user ? (
        <TopbarActions
          creditsLabel={creditsLabel()}
          cartCount={cartCount()}
          onOpenCart={() => openModal('cart')}
        />
      ) : (
        <Link
          to="/sign-in"
          className="ml-2 rounded-full bg-[var(--wn-accent)] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-accent-hover)]"
        >
          Нэвтрэх
        </Link>
      )}
    </div>
  );
};