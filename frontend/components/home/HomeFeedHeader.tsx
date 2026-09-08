"use client"

import React from 'react';
import { X } from 'lucide-react';
import { StatusFilter, DEFAULT_CATEGORY } from '@/hooks/useHomeFeed';
import { BackButton } from '@/components/ui/BackButton';

interface HomeFeedHeaderProps {
  query: string;
  category: string;
  onClearSearch: () => void;
  activeFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

const FILTERS: Exclude<StatusFilter, null>[] = ['Live now', 'Starting soon', 'Most watched'];
const FILTER_LABELS: Record<Exclude<StatusFilter, null>, string> = {
  'Live now': 'Шууд явж байгаа',
  'Starting soon': 'Удахгүй эхлэх',
  'Most watched': 'Их үзсэн',
};

export const HomeFeedHeader: React.FC<HomeFeedHeaderProps> = ({ query, category, onClearSearch, activeFilter, onFilterChange }) => {
  if (query) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* Хайлтын үг урт байвал товчтой мөргөлддөг тул мөр таслах эрх өгнө. */}
        <h1 className="min-w-0 break-words text-[24px] sm:text-[28px] lg:text-[34px] font-[800] text-[var(--wn-ink)] tracking-tight">"{query}"-н хайлтын үр дүн</h1>
        <button onClick={onClearSearch} className="flex shrink-0 items-center gap-2 text-[14px] font-[600] text-[var(--wn-ink-3)] hover:text-[var(--wn-ink)]">
          <X className="w-4 h-4" /> Хайлт цэвэрлэх
        </button>
      </div>
    );
  }

  // Ангилал сонгосон бол энэ нь шүүсэн дэд харагдац — Хайх хуудас, эсвэл
  // нүүрнээс орж ирдэг тул буцах зам хэрэгтэй.
  const filteredByCategory = category !== DEFAULT_CATEGORY;

  return (
    <>
      {filteredByCategory && <BackButton className="mb-4" fallback="/explore" />}

      <h1 className="text-[24px] sm:text-[28px] lg:text-[34px] font-[800] text-[var(--wn-ink)] tracking-tight mb-6">{category}</h1>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex -space-x-2">
            {['A', 'K', 'M'].map(letter => (
              <div key={letter} className="w-8 h-8 rounded-full bg-[var(--wn-surface-3)] border-2 border-[var(--wn-page)] flex items-center justify-center text-[12px] font-[700] text-[var(--wn-ink-2)] relative z-10">
                {letter}
              </div>
            ))}
          </div>
          <span className="text-[14px] font-[600] text-[var(--wn-ink-3)]">266 мянган дагагч</span>
          <button className="min-h-11 sm:min-h-0 px-4 py-1.5 rounded-full bg-[var(--wn-ink)] text-white text-[13px] font-[600] hover:bg-[var(--wn-ink-2)] transition-colors">
            Дагах
          </button>
        </div>
        {/* Дөрвөн шүүлтүүр 320px дээр ~845px эзэлдэг тул хуудсыг хэвтээгээр
            гүйлгэдэг байв — эндээ л гүйдэг болгоно. */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => onFilterChange(null)}
            className={`shrink-0 min-h-11 sm:min-h-0 px-4 py-1.5 rounded-full text-[13px] font-[600] transition-colors ${
              activeFilter === null ? 'bg-[var(--wn-ink)] text-white' : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink-2)] hover:bg-[var(--wn-line)]'
            }`}
          >
            Бүгд
          </button>
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`shrink-0 min-h-11 sm:min-h-0 px-4 py-1.5 rounded-full text-[13px] font-[600] transition-colors ${
                activeFilter === filter ? 'bg-[var(--wn-ink)] text-white' : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink-2)] hover:bg-[var(--wn-line)]'
              }`}
            >
              {FILTER_LABELS[filter]}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};