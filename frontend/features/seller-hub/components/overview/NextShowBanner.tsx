"use client"

import React from 'react';
import { Calendar, Clock, Package, Bell, AlertCircle } from 'lucide-react';
import { SellerShow } from '@/features/seller-hub/types';

interface NextShowBannerProps {
  show: SellerShow;
  countdown: string;
  ready: boolean;
  onOpen: () => void;
}

export const NextShowBanner: React.FC<NextShowBannerProps> = ({ show, countdown, ready, onOpen }) => (
  <div className="mb-8 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
        <Calendar className="w-8 h-8 text-gray-500" />
      </div>
      <div>
        <div className="text-[13px] font-[800] text-blue-600 uppercase tracking-wider mb-1">Next Show</div>
        <div className="text-[20px] font-[800] text-black mb-1">{show.title}</div>
        <div className="flex items-center gap-4 text-[14px] font-[600] text-gray-500">
          <span className="flex items-center gap-1.5 text-black"><Clock className="w-4 h-4" /> {countdown}</span>
          <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> {show.products.length} products</span>
          {show.reminders && <span className="flex items-center gap-1.5"><Bell className="w-4 h-4" /> {show.reminders} reminders</span>}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {!ready && (
        <div className="flex items-center gap-2 text-[13px] font-[700] text-red-600 bg-red-50 px-3 py-1.5 rounded-lg mr-2">
          <AlertCircle className="w-4 h-4" /> Not Ready
        </div>
      )}
      <button onClick={onOpen} className="px-5 py-2.5 rounded-full border border-gray-300 text-black text-[14px] font-[700] hover:bg-gray-50 transition-colors">
        Open Show
      </button>
      <button
        onClick={onOpen}
        disabled={!ready}
        className="px-5 py-2.5 rounded-full bg-black text-white text-[14px] font-[700] hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:bg-gray-400"
      >
        Start Show
      </button>
    </div>
  </div>
);