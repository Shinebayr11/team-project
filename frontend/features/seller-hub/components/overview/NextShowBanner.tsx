"use client"

import React from 'react';
import { Calendar, Clock, Package, Bell, AlertCircle, Radio } from 'lucide-react';
import { SellerShow } from '@/features/seller-hub/types';

interface NextShowBannerProps {
  show: SellerShow;
  countdown: string;
  ready: boolean;
  /** Шоуны дэлгэрэнгүй рүү. */
  onOpen: () => void;
  /** Жинхэнэ LiveKit дамжуулалт эхлүүлэх дэлгэц рүү. */
  onGoLive: () => void;
}

export const NextShowBanner: React.FC<NextShowBannerProps> = ({ show, countdown, ready, onOpen, onGoLive }) => (
  <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
      <div className="w-16 h-16 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
        <Calendar className="w-8 h-8 text-gray-500" />
      </div>
      <div>
        <div className="text-[13px] font-[800] text-blue-600 uppercase tracking-wider mb-1">Next Show</div>
        <div className="text-[20px] font-[800] text-black mb-1">{show.title}</div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] font-[600] text-gray-500">
          <span className="flex items-center gap-1.5 text-black"><Clock className="w-4 h-4" /> {countdown}</span>
          <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> {show.products.length} products</span>
          {show.reminders && <span className="flex items-center gap-1.5"><Bell className="w-4 h-4" /> {show.reminders} reminders</span>}
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      {!ready && (
        <div className="flex items-center gap-2 text-[13px] font-[700] text-[var(--wn-live-deep)] bg-[var(--wn-live-soft)] px-3 py-1.5 rounded-lg mr-2">
          <AlertCircle className="w-4 h-4" /> Not Ready
        </div>
      )}
      <button onClick={onOpen} className="px-5 py-2.5 rounded-full border border-gray-300 text-black text-[14px] font-[700] hover:bg-gray-50 transition-colors">
        Open Show
      </button>
      {/* Өмнө нь энэ хоёр товч ЯГ ижил зүйл хийдэг байсан. Одоо "Open Show"
          нь дэлгэрэнгүйг нээж, "Start Show" нь жинхэнэ дамжуулалт эхлүүлнэ. */}
      <button
        onClick={onGoLive}
        disabled={!ready}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--wn-live-deep)] text-white text-[14px] font-[700] hover:bg-[var(--wn-live)] transition-colors disabled:opacity-50 disabled:bg-gray-400"
      >
        <Radio className="w-4 h-4" /> Start Show
      </button>
    </div>
  </div>
);