"use client"

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const BalanceCard: React.FC<{ balanceLabel: string }> = ({ balanceLabel }) => (
  <div className="p-8 rounded-[24px] bg-[var(--wn-ink)] text-white relative overflow-hidden shadow-lg">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
    <div className="relative z-10">
      <div className="text-[14px] font-[600] text-[var(--wn-ink-4)] uppercase tracking-wider mb-2">Current Balance</div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[var(--wn-accent)] flex items-center justify-center text-white font-[800] text-[20px]">₮</div>
        <div className="text-[48px] font-[800] tracking-tight leading-none">{balanceLabel}</div>
      </div>
      <div className="flex items-center gap-2 text-[13px] font-[500] text-[var(--wn-ink-3)]">
        <ShieldCheck className="w-4 h-4 text-[var(--wn-accent)]" />
        Funds are securely stored in your account
      </div>
    </div>
  </div>
);