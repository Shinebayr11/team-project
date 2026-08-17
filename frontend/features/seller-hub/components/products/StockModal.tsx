"use client"

import React, { useState } from 'react';

export type StockAdjustType = 'add' | 'remove' | 'set';

interface StockModalProps {
  onClose: () => void;
  onSave: (type: StockAdjustType, amount: number) => void;
}

const TYPES: { value: StockAdjustType; label: string }[] = [
  { value: 'add', label: 'Add' },
  { value: 'remove', label: 'Remove' },
  { value: 'set', label: 'Set' },
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-[400px] p-6 shadow-xl">
        <h2 className="text-[18px] font-[800] text-black mb-4">Adjust Stock</h2>

        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
          {TYPES.map(option => (
            <button
              key={option.value}
              onClick={() => setType(option.value)}
              className={`flex-1 py-1.5 rounded-lg text-[13px] font-[700] transition-colors ${
                type === option.value ? 'bg-white text-black shadow-sm' : 'text-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-[12px] font-[700] text-gray-500 mb-1" htmlFor="stockAmount">Amount</label>
          <input
            id="stockAmount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
            className="w-full h-10 rounded-lg border border-gray-300 px-3 text-[14px] font-[500] text-black outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-[14px] font-[700] text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 rounded-full bg-black text-white text-[14px] font-[700] hover:bg-gray-800">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};