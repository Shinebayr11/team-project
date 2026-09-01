"use client"

import React from 'react';
import { X } from 'lucide-react';
import { StatusFilter } from '@/hooks/useHomeFeed';

interface HomeFeedHeaderProps {
  query: string;
  category: string;
  onClearSearch: () => void;
  activeFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

const FILTERS: Exclude<StatusFilter, null>[] = ['Live now', 'Starting soon', 'Most watched'];

export const HomeFeedHeader: React.FC<HomeFeedHeaderProps> = ({ query, category, onClearSearch, activeFilter, onFilterChange }) => {
  if (query) {
    return (
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[34px] font-[800] text-[var(--wn-ink)] tracking-tight">Results for "{query}"</h1>
        <button onClick={onClearSearch} className="flex items-center gap-2 text-[14px] font-[600] text-[var(--wn-ink-3)] hover:text-[var(--wn-ink)]">
          <X className="w-4 h-4" /> Clear search
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-[34px] font-[800] text-[var(--wn-ink)] tracking-tight mb-6">{category}</h1>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex -space-x-2">
            {['A', 'K', 'M'].map(letter => (
              <div key={letter} className="w-8 h-8 rounded-full bg-[var(--wn-surface-3)] border-2 border-[var(--wn-page)] flex items-center justify-center text-[12px] font-[700] text-[var(--wn-ink-2)] relative z-10">
                {letter}
              </div>
            ))}
          </div>
          <span className="text-[14px] font-[600] text-[var(--wn-ink-3)]">266k followers</span>
          <button className="px-4 py-1.5 rounded-full bg-[var(--wn-ink)] text-white text-[13px] font-[600] hover:bg-[var(--wn-ink-2)] transition-colors">
            Follow
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => onFilterChange(null)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-[600] transition-colors ${
              activeFilter === null ? 'bg-[var(--wn-ink)] text-white' : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink-2)] hover:bg-[var(--wn-line)]'
            }`}
          >
            All
          </button>
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-[600] transition-colors ${
                activeFilter === filter ? 'bg-[var(--wn-ink)] text-white' : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink-2)] hover:bg-[var(--wn-line)]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};