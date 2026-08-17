"use client"

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  qty, onChange, min = 1, max = 9,
}) => (
  <div className="flex items-center gap-4 mb-6">
    <span className="text-[14px] font-[600] text-[var(--wn-ink-3)]">Quantity</span>
    <div className="flex items-center bg-[var(--wn-surface-2)] rounded-lg p-1">
      <button
        onClick={() => onChange(Math.max(min, qty - 1))}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-[var(--wn-ink-2)] hover:bg-white rounded-md transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center text-[15px] font-[700] text-[var(--wn-ink)]">{qty}</span>
      <button
        onClick={() => onChange(Math.min(max, qty + 1))}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center text-[var(--wn-ink-2)] hover:bg-white rounded-md transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);