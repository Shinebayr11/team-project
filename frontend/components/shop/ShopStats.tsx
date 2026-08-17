"use client"

import React from 'react';
import { SellerRecord } from '../../types';

const Dot = () => <div className="w-1 h-1 rounded-full bg-[var(--wn-line-3)]" />;

export const ShopStats: React.FC<{ seller: SellerRecord }> = ({ seller }) => (
  <div className="px-8 max-w-[800px] mb-8">
    <p className="text-[15px] text-[var(--wn-ink-2)] leading-relaxed mb-6">{seller.bio}</p>
    <div className="flex items-center gap-6 text-[14px]">
      <div className="flex items-center gap-1.5">
        <span className="font-[700] text-[var(--wn-ink)]">{seller.rating}</span>
        <span className="text-[var(--wn-ink-3)]">({seller.reviewCount} reviews)</span>
      </div>
      <Dot />
      <div className="flex items-center gap-1.5">
        <span className="font-[700] text-[var(--wn-ink)]">{seller.followers}</span>
        <span className="text-[var(--wn-ink-3)]">followers</span>
      </div>
      <Dot />
      <div className="flex items-center gap-1.5">
        <span className="font-[700] text-[var(--wn-ink)]">{seller.sales}</span>
        <span className="text-[var(--wn-ink-3)]">sales</span>
      </div>
      <Dot />
      <span className="text-[var(--wn-ink-3)]">{seller.since}</span>
    </div>
  </div>
);