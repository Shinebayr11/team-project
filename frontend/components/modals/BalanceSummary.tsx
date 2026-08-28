"use client"

import React from 'react';

interface BalanceSummaryProps {
  balance: number;
  cost: number;
}

/** Before/after balance strip shared by the buy and bid modals. */
export const BalanceSummary: React.FC<BalanceSummaryProps> = ({ balance, cost }) => {
  const affordable = balance >= cost;
  const label = affordable ? 'text-[var(--wn-ink-3)]' : 'text-[var(--wn-live-deep)]';
  const value = affordable ? 'text-[var(--wn-ink)]' : 'text-[var(--wn-live-deep)]';

  return (
    <div className={`p-4 rounded-xl flex items-center justify-between ${affordable ? 'bg-[var(--wn-surface-2)]' : 'bg-[var(--wn-live-soft)]'}`}>
      <div>
        <div className={`text-[13px] font-[700] ${label}`}>Таны үлдэгдэл</div>
        <div className={`text-[16px] font-[800] ${value}`}>₮{balance.toLocaleString()}</div>
      </div>
      <div className="text-right">
        <div className={`text-[13px] font-[700] ${label}`}>Үлдэх дүн</div>
        <div className={`text-[16px] font-[800] ${value}`}>
          {affordable
            ? `₮${(balance - cost).toLocaleString()}`
            : `₮${(cost - balance).toLocaleString()} дутуу`}
        </div>
      </div>
    </div>
  );
};