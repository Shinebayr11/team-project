"use client"

import React, { useState } from 'react';
import { CONTROL } from '@/features/seller-hub/components/FormField';
import { btn } from "@/features/seller-hub/components/buttons"

export type StockAdjustType = 'add' | 'remove' | 'set';

interface StockModalProps {
  onClose: () => void;
  onSave: (type: StockAdjustType, amount: number) => void;
}

const TYPES: { value: StockAdjustType; label: string }[] = [
  { value: 'add', label: 'Нэмэх' },
  { value: 'remove', label: 'Хасах' },
  { value: 'set', label: 'Тохируулах' },
];

export const StockModal: React.FC<StockModalProps> = ({ onClose, onSave }) => {
  const [type, setType] = useState<StockAdjustType>('add');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    const parsed = parseInt(amount, 10);
    if (!Number.isNaN(parsed)) onSave(type, parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Гар утсан дээр доороос гарна; өндөр нь дэлгэцээс хэтэрвэл дотроо гүйнэ. */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-[400px] max-h-[92dvh] sm:max-h-[85dvh] overflow-y-auto p-6 shadow-xl">
        <h2 className="text-[18px] font-[800] text-black mb-4">Нөөц тохируулах</h2>

        <div className="flex p-1 bg-[var(--wn-admin-chip)] rounded-xl mb-6">
          {TYPES.map(option => (
            <button
              key={option.value}
              onClick={() => setType(option.value)}
              className={`flex-1 py-1.5 rounded-lg text-[13px] font-[700] transition-colors ${
                type === option.value ? 'bg-white text-black shadow-sm' : 'text-[var(--wn-admin-ink-2)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-[12px] font-[700] text-[var(--wn-admin-muted)] mb-1" htmlFor="stockAmount">Тоо хэмжээ</label>
          <input
            id="stockAmount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
            className={CONTROL}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-[14px] font-[700] text-[var(--wn-admin-ink-2)] hover:bg-[var(--wn-admin-nav-hover)]">
            Цуцлах
          </button>
          <button onClick={handleSave} className={btn("ink", "pillWide")}>
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
};