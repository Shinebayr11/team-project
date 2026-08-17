"use client"

import React from 'react';
import { Plus } from 'lucide-react';

export const AddressesTab: React.FC = () => (
  <div className="flex flex-col gap-6 max-w-[600px]">
    <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Shipping Addresses</h2>

    <div className="p-6 rounded-2xl border border-[var(--wn-line)] bg-white flex items-start justify-between">
      <div className="flex flex-col gap-1 text-[14px] text-[var(--wn-ink-2)]">
        <div className="font-[700] text-[var(--wn-ink)] mb-1 flex items-center gap-2">
          John Doe
          <span className="px-2 py-0.5 rounded bg-[var(--wn-surface-2)] text-[10px] font-[800] uppercase tracking-wider text-[var(--wn-ink-3)]">Default</span>
        </div>
        <div>123 Vintage Lane</div>
        <div>Apt 4B</div>
        <div>Portland, OR 97204</div>
        <div>United States</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-[13px] font-[700] text-[var(--wn-accent)] hover:underline">Edit</button>
        <button className="text-[13px] font-[700] text-[var(--wn-ink-4)] hover:text-red-600 transition-colors">Remove</button>
      </div>
    </div>

    <button className="h-[48px] rounded-xl border-2 border-[var(--wn-line-2)] text-[var(--wn-ink)] text-[14px] font-[700] hover:bg-[var(--wn-surface-2)] transition-colors flex items-center justify-center gap-2">
      <Plus className="w-4 h-4" /> Add New Address
    </button>
  </div>
);