"use client"

import React from 'react';
import { Search } from 'lucide-react';

interface ExploreHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({ query, onQueryChange }) => (
  <div className="bg-white border-b border-[var(--wn-line)] pt-12 pb-8 px-6 md:px-12">
    <div className="max-w-[1200px] mx-auto">
      <h1 className="text-[32px] md:text-[40px] font-[800] text-[var(--wn-ink)] tracking-tight mb-2">Explore</h1>
      <p className="text-[16px] text-[var(--wn-ink-3)] font-[500] mb-8">Discover live shows, products, and sellers.</p>

      <div className="relative max-w-[600px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--wn-ink-4)]" />
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="Search products, sellers, or shows"
          aria-label="Search Explore"
          className="w-full h-[52px] rounded-full bg-[var(--wn-surface-2)] border border-[var(--wn-line)] pl-12 pr-4 text-[15px] text-[var(--wn-ink)] placeholder:text-[var(--wn-ink-4)] font-[500] outline-none focus:border-[var(--wn-accent)] transition-colors shadow-sm"
        />
      </div>
    </div>
  </div>
);