"use client"

import React from 'react';
import { Plus } from 'lucide-react';

export const PaymentTab: React.FC = () => (
  <div className="flex flex-col gap-6 max-w-[600px]">
    <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Payment Methods</h2>

    <div className="p-6 rounded-2xl border border-[var(--wn-line)] bg-white flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-8 rounded bg-[var(--wn-surface-2)] border border-[var(--wn-line-2)] flex items-center justify-center text-[12px] font-[800] text-[var(--wn-ink)]">
          VISA
        </div>
        <div>
          <div className="text-[15px] font-[700] text-[var(--wn-ink)]">Visa ending in 4242</div>
          <div className="text-[13px] text-[var(--wn-ink-3)]">Expires 12/25</div>
        </div>
      </div>
      <button className="text-[13px] font-[700] text-[var(--wn-ink-4)] hover:text-red-600 transition-colors">Remove</button>
    </div>

    <button className="h-[48px] rounded-xl border-2 border-[var(--wn-line-2)] text-[var(--wn-ink)] text-[14px] font-[700] hover:bg-[var(--wn-surface-2)] transition-colors flex items-center justify-center gap-2">
      <Plus className="w-4 h-4" /> Add Payment Method
    </button>
  </div>
);