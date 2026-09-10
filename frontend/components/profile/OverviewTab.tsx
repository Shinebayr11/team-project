"use client"

import React, { useState } from 'react';
import { Skeleton, SkeletonRows, SkeletonScreen } from '@/components/ui/Skeleton';
import { ChevronRight } from 'lucide-react';
import { HomeShow } from '../../types';
import { MyPurchase } from '@/hooks/useMyPurchases';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { ShowCard } from '../cards/ShowCard';
import { ProfileTab } from './ProfileSidebar';
import { PurchaseDetailSheet } from './PurchaseDetailSheet';

interface OverviewTabProps {
  purchases: MyPurchase[];
  savedShows: HomeShow[];
  followingCount: number;
  loading: boolean;
  onNavigate: (tab: ProfileTab) => void;
}

const StatCard: React.FC<{ value: number; label: string; onClick: () => void }> = ({ value, label, onClick }) => (
  <div
    onClick={onClick}
    className="p-5 rounded-2xl border border-[var(--wn-line)] bg-white flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--wn-line-2)] transition-colors"
  >
    <div className="text-[24px] font-[800] text-[var(--wn-ink)] mb-1">{value}</div>
    <div className="text-[13px] font-[600] text-[var(--wn-ink-3)]">{label}</div>
  </div>
);

const SectionHeader: React.FC<{ title: string; onViewAll: () => void }> = ({ title, onViewAll }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-[18px] font-[800] text-[var(--wn-ink)]">{title}</h3>
    <button onClick={onViewAll} className="text-[13px] font-[700] text-[var(--wn-accent)] hover:underline">Бүгдийг харах</button>
  </div>
);

export const OverviewTab: React.FC<OverviewTabProps> = ({
  purchases, savedShows, followingCount, loading, onNavigate,
}) => {
  const [selected, setSelected] = useState<MyPurchase | null>(null);

  return (
  <div className="flex flex-col gap-10">
    <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Ерөнхий тойм</h2>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard value={purchases.length} label="Худалдан авалт" onClick={() => onNavigate('purchases')} />
      <StatCard value={savedShows.length} label="Хадгалсан шууд дамжуулалт" onClick={() => onNavigate('saved')} />
      <StatCard value={followingCount} label="Дагаж буй" onClick={() => onNavigate('following')} />
    </div>

    {loading ? (
      <SkeletonScreen className="flex flex-col gap-4">
        <Skeleton className="h-5 w-48" />
        <SkeletonRows rows={3} />
      </SkeletonScreen>
    ) : purchases.length > 0 ? (
      <div>
        <SectionHeader title="Сүүлийн худалдан авалт" onViewAll={() => onNavigate('purchases')} />
        <div className="flex flex-col gap-3">
          {purchases.slice(0, 3).map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="flex w-full items-center justify-between p-4 rounded-[16px] border border-[var(--wn-line)] text-left transition-colors hover:border-[var(--wn-line-2)] hover:bg-[var(--wn-accent-wash)]"
            >
              <div className="flex items-center gap-4">
                <ProductThumb product={p.product} size={48} />
                <div>
                  <div className="font-[700] text-[15px] text-[var(--wn-ink)]">{p.title}</div>
                  <div className="text-[13px] text-[var(--wn-ink-3)] mt-0.5">
                    {p.seller}
                    {p.date ? ` • ${new Date(p.date).toLocaleDateString()}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[15px] font-[700] text-[var(--wn-ink)]">₮{p.price.toLocaleString()}</div>
                <ChevronRight className="w-4 h-4 text-[var(--wn-ink-4)]" />
              </div>
            </button>
          ))}
        </div>
      </div>
    ) : null}

    {savedShows.length > 0 && (
      <div>
        <SectionHeader title="Хадгалсан шууд дамжуулалт" onViewAll={() => onNavigate('saved')} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {savedShows.slice(0, 3).map(show => (
            <ShowCard key={`${show.seller}-${show.title}`} show={show} />
          ))}
        </div>
      </div>
    )}

    <PurchaseDetailSheet purchase={selected} onClose={() => setSelected(null)} />
  </div>
  );
};
