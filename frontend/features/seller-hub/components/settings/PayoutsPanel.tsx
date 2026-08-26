"use client"

import React from 'react';
import { SELLER_PAYOUTS, SELLER_WALLET } from '@/features/seller-hub/data/sellerStats';

const BalanceCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="text-[14px] font-[700] text-gray-600 mb-2">{label}</div>
    <div className="text-[28px] font-[800] tracking-tight text-black">{value}</div>
  </div>
);

export const PayoutsPanel: React.FC = () => (
  <div>
    <div className="mb-6">
      <h2 className="text-[24px] font-[800] mb-1 text-black">Payouts</h2>
      <p className="text-[14px] text-gray-500 font-[500]">Manage your balance and payout history.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      <BalanceCard label="Available" value={SELLER_WALLET.available} />
      <BalanceCard label="Pending clearance" value={SELLER_WALLET.pending} />
      <BalanceCard label="Paid out all time" value={SELLER_WALLET.lifetime} />
    </div>

    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-[12px] font-[800] text-gray-500 uppercase tracking-wider border-b border-gray-200">
            <th className="p-5">Date</th>
            <th className="p-5">Description</th>
            <th className="p-5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {SELLER_PAYOUTS.map((payout, i) => (
            <tr key={`${payout.date}-${i}`} className="text-[14.5px]">
              <td className="p-5 font-[600] text-gray-600">{payout.date}</td>
              <td className="p-5 font-[700] text-black">{payout.desc}</td>
              <td className={`p-5 text-right font-[800] ${payout.out ? 'text-gray-500' : 'text-black'}`}>
                {payout.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);