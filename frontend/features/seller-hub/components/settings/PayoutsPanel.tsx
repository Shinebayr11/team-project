"use client"

import React from 'react';
import { SELLER_PAYOUTS, SELLER_WALLET } from '@/features/seller-hub/data/sellerStats';

const BalanceCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-6 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white shadow-sm">
    <div className="text-[14px] font-[700] text-[var(--wn-admin-ink-2)] mb-2">{label}</div>
    <div className="text-[28px] font-[800] tracking-tight text-black">{value}</div>
  </div>
);

export const PayoutsPanel: React.FC = () => (
  <div>
    <div className="mb-6">
      <h2 className="text-[24px] font-[800] mb-1 text-black">Төлбөр тооцоо</h2>
      <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500]">Үлдэгдэл болон төлбөрийн түүхээ удирдана уу.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      <BalanceCard label="Боломжтой үлдэгдэл" value={SELLER_WALLET.available} />
      <BalanceCard label="Хүлээгдэж буй" value={SELLER_WALLET.pending} />
      <BalanceCard label="Нийт төлөгдсөн" value={SELLER_WALLET.lifetime} />
    </div>

    {/* `overflow-hidden` ганцаараа байхад хүснэгт тайрагддаг байв — булангийн
        радиусыг хадгалж, дотор нь гүйдэг давхарга нэмнэ. */}
    <div className="border border-[var(--wn-admin-card-border)] rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left border-collapse">
        <thead>
          <tr className="bg-[var(--wn-admin-row-rule)] text-[12px] font-[800] text-[var(--wn-admin-muted)] uppercase tracking-wider border-b border-[var(--wn-admin-card-border)]">
            <th className="p-5">Огноо</th>
            <th className="p-5">Тайлбар</th>
            <th className="p-5 text-right">Дүн</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--wn-admin-row-rule)]">
          {SELLER_PAYOUTS.map((payout, i) => (
            <tr key={`${payout.date}-${i}`} className="text-[14px]">
              <td className="p-5 font-[600] text-[var(--wn-admin-ink-2)]">{payout.date}</td>
              <td className="p-5 font-[700] text-black">{payout.desc}</td>
              <td className={`p-5 text-right font-[800] ${payout.out ? 'text-[var(--wn-admin-muted)]' : 'text-black'}`}>
                {payout.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  </div>
);