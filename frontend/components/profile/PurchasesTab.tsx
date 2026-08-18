"use client"

import React from 'react';
import { Bid, Purchase } from '../../types';
import { LiveDot } from '../ui/LiveDot';

interface PurchasesTabProps {
  purchases: Purchase[];
  bids: Bid[];
}

const statusClass = (status: Purchase['status']) => {
  if (status === 'delivered') return 'bg-[#E6F4EA] text-[#166534]';
  if (status === 'shipped') return 'bg-[var(--wn-accent-soft)] text-[var(--wn-accent)]';
  return 'bg-[#FEF3C7] text-[#92400E]';
};

export const PurchasesTab: React.FC<PurchasesTabProps> = ({ purchases, bids }) => (
  <div className="flex flex-col gap-8">
    <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Purchases</h2>

    {bids.length > 0 && (
      <div>
        <h3 className="text-[16px] font-[800] text-[var(--wn-ink)] mb-4">Active bids</h3>
        <div className="flex flex-col gap-3">
          {bids.map(b => (
            <div key={b.id} className="flex items-center justify-between p-4 rounded-[16px] bg-[var(--wn-surface-3)] border border-[var(--wn-line)]">
              <div>
                <div className="font-[700] text-[15px] text-[var(--wn-ink)] mb-1">{b.title}</div>
                <div className="text-[13px] text-[var(--wn-ink-3)]">from {b.seller}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[16px] font-[800] text-[var(--wn-ink)]">₮{b.amount}</div>
                <div className="px-3 py-1 rounded-full bg-[var(--wn-live-soft)] text-[var(--wn-live)] text-[12px] font-[700] flex items-center gap-1.5">
                  <LiveDot /> Leading
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div>
      <h3 className="text-[16px] font-[800] text-[var(--wn-ink)] mb-4">Order history</h3>
      {purchases.length > 0 ? (
        <div className="w-full border border-[var(--wn-line)] rounded-[16px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--wn-surface-2)] text-[13px] font-[700] text-[var(--wn-ink-3)] uppercase tracking-wider">
                <th className="p-4 font-[700]">Item</th>
                <th className="p-4 font-[700]">Date</th>
                <th className="p-4 font-[700]">Total</th>
                <th className="p-4 font-[700]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--wn-line)]">
              {purchases.map(p => (
                <tr key={p.id} className="text-[14.5px]">
                  <td className="p-4">
                    <div className="font-[600] text-[var(--wn-ink)]">{p.title}</div>
                    <div className="text-[13px] text-[var(--wn-ink-3)] mt-0.5">from {p.seller}</div>
                  </td>
                  <td className="p-4 text-[var(--wn-ink-2)]">{p.date}</td>
                  <td className="p-4 font-[600] text-[var(--wn-ink)]">₮{p.price}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[12px] font-[700] capitalize ${statusClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-[15px] font-[600] text-[var(--wn-ink-3)] border border-[var(--wn-line)] rounded-[16px]">
          No order history yet.
        </div>
      )}
    </div>
  </div>
);