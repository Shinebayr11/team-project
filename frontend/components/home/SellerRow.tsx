"use client"

import React from 'react';
import { SellerRecord } from '../../types';
import { Avatar } from '../ui/Avatar';

interface SellerRowProps {
  seller: SellerRecord;
  onClick: () => void;
  /** Force the offline caption regardless of the seller's live state. */
  forceOffline?: boolean;
}

export const SellerRow: React.FC<SellerRowProps> = ({ seller, onClick, forceOffline }) => {
  const isLive = !forceOffline && seller.live.type === 'live';

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--wn-surface-2)] cursor-pointer transition-colors"
    >
      <div className="relative">
        <Avatar name={seller.slug} initial={seller.initial} tint={seller.tint} size={32} />
        {isLive && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--wn-live)] border-2 border-[var(--wn-page)]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-[700] text-[var(--wn-ink)] truncate">{seller.slug}</div>
        <div className="text-[11px] text-[var(--wn-ink-3)] truncate">
          {isLive
            ? <span className="text-[var(--wn-live)] font-[600]">Шууд</span>
            : (forceOffline ? 'Offline' : seller.cat1)}
        </div>
      </div>
    </div>
  );
};