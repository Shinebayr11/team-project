"use client"

import React from 'react';
import { Star } from 'lucide-react';

interface ReviewSummaryProps {
  rating: string;
  count: string;
  /** Percentage of reviews at 5,4,3,2,1 stars. Mocked until real review data exists. */
  distribution?: number[];
}

const DEFAULT_DISTRIBUTION = [72, 19, 6, 2, 1];

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  rating, count, distribution = DEFAULT_DISTRIBUTION,
}) => (
  <div className="flex items-center gap-12 py-8 border-b border-[var(--wn-line)]">
    <div className="flex flex-col items-center">
      <div className="text-[40px] font-[800] text-[var(--wn-ink)] tracking-tight leading-none">{rating}</div>
      <div className="flex items-center gap-1 my-2">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-[var(--wn-accent)] text-[var(--wn-accent)]" />)}
      </div>
      <div className="text-[14px] text-[var(--wn-ink-3)]">{count} reviews</div>
    </div>

    <div className="flex-1 flex flex-col gap-2 max-w-[300px]">
      {distribution.map((pct, i) => (
        <div key={i} className="flex items-center gap-3 text-[13px] font-[600] text-[var(--wn-ink-2)]">
          <span className="w-4">{5 - i}★</span>
          <div className="flex-1 h-1.5 rounded-full bg-[var(--wn-line)] overflow-hidden">
            <div className="h-full bg-[var(--wn-accent)] rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);