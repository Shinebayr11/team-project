"use client"

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HomeShow, Purchase } from '../../types';
import { ShowCard } from '../cards/ShowCard';
import { ProfileTab } from './ProfileSidebar';

interface OverviewTabProps {
  purchases: Purchase[];
  savedShows: HomeShow[];
  followingCount: number;
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
    <button onClick={onViewAll} className="text-[13px] font-[700] text-[var(--wn-accent)] hover:underline">View All</button>
  </div>
);

export const OverviewTab: React.FC<OverviewTabProps> = ({
  purchases, savedShows, followingCount, onNavigate,
}) => (
  <div className="flex flex-col gap-10">
    <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Overview</h2>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard value={purchases.length} label="Purchases" onClick={() => onNavigate('purchases')} />
      <StatCard value={savedShows.length} label="Saved Shows" onClick={() => onNavigate('saved')} />
      <StatCard value={followingCount} label="Following" onClick={() => onNavigate('following')} />
    </div>

    {purchases.length > 0 && (
      <div>
        <SectionHeader title="Recent Purchases" onViewAll={() => onNavigate('purchases')} />
        <div className="flex flex-col gap-3">
          {purchases.slice(0, 3).map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-[16px] border border-[var(--wn-line)] hover:border-[var(--wn-line-2)] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--wn-shot)] shrink-0" />
                <div>
                  <div className="font-[700] text-[15px] text-[var(--wn-ink)]">{p.title}</div>
                  <div className="text-[13px] text-[var(--wn-ink-3)] mt-0.5">from {p.seller} • {p.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[15px] font-[700] text-[var(--wn-ink)]">₮{p.price}</div>
                <ChevronRight className="w-4 h-4 text-[var(--wn-ink-4)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {savedShows.length > 0 && (
      <div>
        <SectionHeader title="Saved Shows" onViewAll={() => onNavigate('saved')} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {savedShows.slice(0, 3).map(show => (
            <ShowCard key={`${show.seller}-${show.title}`} show={show} />
          ))}
        </div>
      </div>
    )}
  </div>
);