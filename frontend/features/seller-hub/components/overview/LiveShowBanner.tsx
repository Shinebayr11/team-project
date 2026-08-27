"use client"

import React from 'react';
import { Video, Users, ShoppingBag, CreditCard } from 'lucide-react';
import { LiveDot } from '@/components/ui/LiveDot';

/**
 * Бүтэн `SellerShow` биш, харагдах талбаруудыг нь л авна: лайв нь
 * самбарын шоутай холбоогүй ч (дээд талын "Go Live" товчноос эхэлсэн)
 * үзүүлэх боломжтой байх ёстой.
 */
interface LiveShowBannerProps {
  title: string;
  stats: { viewers: number; sales: number; revenue: number };
  onOpen: () => void;
}

export const LiveShowBanner: React.FC<LiveShowBannerProps> = ({ title, stats, onOpen }) => (
  <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-[#1A1A1A] text-white shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
      <div className="w-16 h-16 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
        <Video className="w-8 h-8 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <LiveDot className="w-2.5 h-2.5" />
          <div className="text-[13px] font-[800] text-[var(--wn-live)] uppercase tracking-wider">Лайв</div>
        </div>
        <div className="text-[22px] font-[800] mb-2">{title}</div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] font-[600] text-gray-300">
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {stats.viewers} viewers</span>
          <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> {stats.sales} sold</span>
          <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> ₮{stats.revenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <button onClick={onOpen} className="shrink-0 px-6 py-3 rounded-full bg-white text-black text-[14px] font-[800] hover:bg-gray-200 transition-colors">
      Open Live Show
    </button>
  </div>
);