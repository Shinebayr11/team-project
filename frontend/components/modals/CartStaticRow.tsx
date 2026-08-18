"use client"

import React from 'react';
import { LiveDot } from '../ui/LiveDot';

interface CartStaticRowProps {
  title: string;
  seller: string;
  price: string;
  variant: 'bid' | 'purchase';
}

/** Read-only cart row for active bids and completed purchases. */
export const CartStaticRow: React.FC<CartStaticRowProps> = ({ title, seller, price, variant }) => (
  <div className={`flex items-center gap-4 py-2 ${variant === 'bid' ? 'opacity-90' : 'opacity-70'}`}>
    <div className="w-16 h-16 rounded-xl bg-[var(--wn-shot)] shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="text-[15px] font-[700] text-[var(--wn-ink)] truncate">{title}</div>
      <div className="text-[13px] font-[600] text-[var(--wn-ink-3)] mt-0.5">from {seller}</div>
      <div className="text-[14px] font-[700] text-[var(--wn-ink)] mt-1">₮{price}</div>
    </div>
    {variant === 'bid' ? (
      <div className="px-3 py-1 rounded-full bg-[var(--wn-live-soft)] text-[var(--wn-live)] text-[12px] font-[700] flex items-center gap-1.5 shrink-0">
        <LiveDot /> Leading
      </div>
    ) : (
      <div className="px-3 py-1 rounded-full bg-[var(--wn-surface-2)] text-[var(--wn-ink-3)] text-[12px] font-[700] shrink-0">
        Purchased
      </div>
    )}
  </div>
);