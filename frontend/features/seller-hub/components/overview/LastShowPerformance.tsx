"use client"

import React from 'react';
import { SellerShow } from '@/features/seller-hub/types';

interface LastShowPerformanceProps {
  show: SellerShow;
  onViewAnalytics: () => void;
}

const Metric: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <div className="text-[13px] font-[700] text-gray-500 mb-1">{label}</div>
    <div className="text-[20px] font-[800] text-black">{value}</div>
  </div>
);

export const LastShowPerformance: React.FC<LastShowPerformanceProps> = ({ show, onViewAnalytics }) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-[18px] font-[800] text-black">Last Show Performance</h2>
    <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="text-[15px] font-[800] text-black mb-1">{show.title}</div>
      <div className="text-[13px] text-gray-500 font-[500] mb-6">
        {new Date(show.scheduledAt).toLocaleDateString()}
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <Metric label="Revenue" value={`₮${show.stats.revenue.toLocaleString()}`} />
        <Metric label="Items Sold" value={show.stats.sales} />
        <Metric label="Orders" value={show.stats.orders ?? show.stats.sales} />
        <Metric label="Peak Viewers" value={show.stats.peakViewers ?? show.stats.viewers} />
      </div>

      <button
        onClick={onViewAnalytics}
        className="w-full mt-6 py-2.5 rounded-xl bg-gray-100 text-black text-[14px] font-[700] hover:bg-gray-200 transition-colors"
      >
        View Full Analytics
      </button>
    </div>
  </div>
);