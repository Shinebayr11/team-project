"use client"

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export interface WalletTransaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: string;
}

export const TransactionList: React.FC<{ transactions: WalletTransaction[] }> = ({ transactions }) => (
  <div className="p-6 rounded-[24px] bg-white border border-[var(--wn-line)] shadow-sm h-full">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-[18px] font-[800] text-[var(--wn-ink)]">Transaction History</h2>
    </div>

    {transactions.length > 0 ? (
      <div className="flex flex-col gap-4">
        {transactions.map(tx => {
          const isCredit = tx.amount > 0;
          return (
            <div key={tx.id} className="flex items-center justify-between p-4 rounded-[16px] border border-[var(--wn-line)] hover:border-[var(--wn-line-2)] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  isCredit ? 'bg-[#E6F4EA] text-[#166534]' : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink-2)]'
                }`}>
                  {isCredit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-[700] text-[15px] text-[var(--wn-ink)]">{tx.title}</div>
                  <div className="flex items-center gap-2 text-[13px] text-[var(--wn-ink-3)] mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> {tx.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-[16px] font-[800] ${isCredit ? 'text-[#166534]' : 'text-[var(--wn-ink)]'}`}>
                  {isCredit ? '+' : ''}₮{Math.abs(tx.amount).toLocaleString()}
                </div>
                <div className="text-[12px] font-[600] text-[var(--wn-ink-4)] capitalize mt-0.5">{tx.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--wn-surface-2)] flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-[var(--wn-ink-4)]" />
        </div>
        <div className="text-[16px] font-[700] text-[var(--wn-ink)] mb-1">No transactions yet</div>
        <div className="text-[14px] text-[var(--wn-ink-3)]">Your purchase and top-up history will appear here.</div>
      </div>
    )}
  </div>
);