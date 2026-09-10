"use client"

import React from 'react';
import { SellerShowSummary } from '@/features/seller-hub/hooks/useSellerShows';

interface LastShowPerformanceProps {
  show: SellerShowSummary;
  onViewAnalytics: () => void;
}

const Metric: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <div className="text-[13px] font-[700] text-[var(--wn-admin-muted)] mb-1">{label}</div>
    <div className="text-[20px] font-[800] text-black">{value}</div>
  </div>
);

export const LastShowPerformance: React.FC<LastShowPerformanceProps> = ({ show, onViewAnalytics }) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-[18px] font-[800] text-black">Сүүлийн шууд дамжуулалтын үзүүлэлт</h2>
    <div className="p-6 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white shadow-sm">
      <div className="text-[14px] font-[800] text-black mb-1">{show.title ?? "Шууд дамжуулалт"}</div>
      <div className="text-[13px] text-[var(--wn-admin-muted)] font-[500] mb-6">
        {new Date(show.ended_at ?? show.createdAt ?? Date.now()).toLocaleDateString()}
      </div>

      <div className="grid grid-cols-1 gap-y-5 gap-x-4 min-[380px]:grid-cols-2 sm:gap-y-6">
        <Metric label="Орлого" value={`₮${show.revenue.toLocaleString()}`} />
        <Metric label="Зарагдсан бараа" value={show.soldCount} />
        <Metric label="Үзэгч" value={show.viewer_count ?? 0} />
      </div>

      <button
        onClick={onViewAnalytics}
        className="w-full mt-6 py-2.5 rounded-xl bg-[var(--wn-admin-chip)] text-black text-[14px] font-[700] hover:bg-[var(--wn-admin-chip-2)] transition-colors"
      >
        Дэлгэрэнгүй тайлан харах
      </button>
    </div>
  </div>
);