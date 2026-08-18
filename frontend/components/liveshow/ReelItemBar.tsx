"use client"

import React from 'react';
import { ReelItem } from '../../types';

interface ReelItemBarProps {
  item: ReelItem;
  seconds: number;
  onAction: () => void;
}

export const ReelItemBar: React.FC<ReelItemBarProps> = ({ item, seconds, onAction }) => {
  const isBidding = item.mode === 'bid';

  return (
    <div
      className="absolute bottom-4 left-4 right-12 bg-white rounded-[16px] p-2.5 flex items-center gap-3 z-10"
      style={{ boxShadow: '0 12px 32px rgba(12,12,24,0.24)' }}
    >
      <div className="w-[60px] h-[60px] rounded-[10px] bg-[var(--wn-shot)] shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-[800] tracking-wider uppercase bg-[var(--wn-accent-soft)] text-[var(--wn-accent)]">
            {isBidding ? 'Bidding' : 'Buy Now'}
          </span>
          <span className="text-[11px] text-[var(--wn-ink-3)] font-[500] truncate">{item.subline}</span>
        </div>
        <div className="text-[14px] font-[800] text-[var(--wn-ink)] truncate leading-tight">{item.name}</div>
        <div className="text-[13px] font-[700] text-[var(--wn-ink-2)] mt-0.5">₮{item.price}</div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isBidding && (
          <div className="w-[36px] h-[36px] rounded-full border-2 border-[var(--wn-line-2)] flex items-center justify-center text-[13px] font-[800] text-[var(--wn-ink)]">
            {seconds}
          </div>
        )}
        <button
          onClick={onAction}
          className="h-[40px] px-5 rounded-xl bg-[var(--wn-accent)] text-white text-[13px] font-[800] hover:bg-[var(--wn-accent-hover)] transition-colors"
          style={{ boxShadow: '0 6px 18px rgba(91,63,224,0.3)' }}
        >
          {isBidding ? 'Bid now' : 'Buy now'}
        </button>
      </div>
    </div>
  );
};