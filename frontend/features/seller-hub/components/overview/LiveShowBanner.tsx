"use client"

import React from 'react';
import { Video, Users, ShoppingBag, CreditCard } from 'lucide-react';
import { SellerShow } from '@/features/seller-hub/types';
import { LiveDot } from '@/components/ui/LiveDot';

interface LiveShowBannerProps {
  show: SellerShow;
  onOpen: () => void;
}

export const LiveShowBanner: React.FC<LiveShowBannerProps> = ({ show, onOpen }) => (
  <div className="mb-8 p-6 rounded-2xl bg-[#1A1A1A] text-white shadow-lg flex items-center justify-between">
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
        <Video className="w-8 h-8 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <LiveDot className="w-2.5 h-2.5" />
          <div className="text-[13px] font-[800] text-[var(--wn-live)] uppercase tracking-wider">Live Now</div>
        </div>
        <div className="text-[22px] font-[800] mb-2">{show.title}</div>
        <div className="flex items-center gap-4 text-[14px] font-[600] text-gray-300">
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {show.stats.viewers} viewers</span>
          <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> {show.stats.sales} sold</span>
          <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> ₮{show.stats.revenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <button onClick={onOpen} className="px-6 py-3 rounded-full bg-white text-black text-[14px] font-[800] hover:bg-gray-200 transition-colors">
      Open Live Show
    </button>
  </div>
);