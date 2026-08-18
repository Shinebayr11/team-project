"use client"

import React from 'react';
import { SellerShow } from '@/features/seller-hub/types';

const Row: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-[14px] text-gray-500 font-[500]">{label}</span>
    <span className="text-[14px] font-[700] text-black">{value}</span>
  </div>
);

export const ShowStatsPanel: React.FC<{ stats: SellerShow['stats'] }> = ({ stats }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <h2 className="text-[16px] font-[800] text-black mb-4">Performance</h2>
    <div className="flex flex-col gap-3">
      <Row label="Viewers" value={stats.viewers} />
      <Row label="Items Sold" value={stats.sales} />
      <Row label="Revenue" value={`₮${stats.revenue.toLocaleString()}`} />
    </div>
  </div>
);