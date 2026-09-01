"use client"

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartLine } from '../../types';

interface CartLineRowProps {
  line: CartLine;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}

export const CartLineRow: React.FC<CartLineRowProps> = ({ line, onQtyChange, onRemove }) => (
  <div className="flex items-center gap-4 py-2">
    <div className="w-16 h-16 rounded-xl bg-[var(--wn-shot)] shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="text-[15px] font-[700] text-[var(--wn-ink)] truncate">{line.name}</div>
      <div className="text-[13px] font-[600] text-[var(--wn-ink-3)] mt-0.5">from {line.seller}</div>
      <div className="text-[14px] font-[700] text-[var(--wn-ink)] mt-1">₮{line.price}</div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <div className="flex items-center bg-[var(--wn-surface-2)] rounded-lg p-1">
        <button
          onClick={() => onQtyChange(line.qty - 1)}
          aria-label="Decrease quantity"
          className="w-9 h-9 sm:w-7 sm:h-7 flex items-center justify-center text-[var(--wn-ink-2)] hover:bg-white rounded-md transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-[14px] font-[700] text-[var(--wn-ink)]">{line.qty}</span>
        <button
          onClick={() => onQtyChange(line.qty + 1)}
          aria-label="Increase quantity"
          className="w-9 h-9 sm:w-7 sm:h-7 flex items-center justify-center text-[var(--wn-ink-2)] hover:bg-white rounded-md transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <button
        onClick={onRemove}
        aria-label={`Remove ${line.name}`}
        className="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-[var(--wn-ink-4)] hover:text-[var(--wn-live)] transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);