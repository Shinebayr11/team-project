"use client"

import React from 'react';
import { Plus } from 'lucide-react';

export interface CreditPack {
  amount: number;
  price: string;
  bonus: number;
}

interface TopUpPanelProps {
  packs: CreditPack[];
  selected: number;
  onSelect: (amount: number) => void;
  onTopUp: () => void;
}

export const TopUpPanel: React.FC<TopUpPanelProps> = ({ packs, selected, onSelect, onTopUp }) => (
  <div className="p-6 rounded-[24px] bg-white border border-[var(--wn-line)] shadow-sm">
    <h2 className="text-[18px] font-[800] text-[var(--wn-ink)] mb-4">Add Funds</h2>

    <div className="flex flex-col gap-3 mb-6">
      {packs.map(pack => {
        const isSelected = selected === pack.amount;
        return (
          <div
            key={pack.amount}
            onClick={() => onSelect(pack.amount)}
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected ? 'border-[var(--wn-accent)] bg-[var(--wn-accent-soft)]' : 'border-[var(--wn-line)] hover:border-[var(--wn-line-2)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[var(--wn-accent)]' : 'border-[var(--wn-line-3)]'}`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--wn-accent)]" />}
              </div>
              <div>
                <div className="text-[16px] font-[800] text-[var(--wn-ink)]">₮{pack.amount.toLocaleString()}</div>
                {pack.bonus > 0 && (
                  <div className="text-[12px] font-[700] text-[var(--wn-accent)]">+₮{pack.bonus.toLocaleString()} Bonus</div>
                )}
              </div>
            </div>
            <div className="text-[15px] font-[700] text-[var(--wn-ink-2)]">{pack.price}</div>
          </div>
        );
      })}
    </div>

    <button
      onClick={onTopUp}
      className="w-full h-[52px] rounded-xl bg-[var(--wn-accent)] text-white text-[16px] font-[800] hover:bg-[var(--wn-accent-hover)] transition-colors flex items-center justify-center gap-2"
    >
      <Plus className="w-5 h-5" /> Add ₮{selected.toLocaleString()}
    </button>
    <div className="text-center text-[12px] font-[600] text-[var(--wn-ink-4)] mt-4">Demo only — no real payment is taken</div>
  </div>
);