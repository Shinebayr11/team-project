"use client"

import React from 'react';

interface ExploreSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onViewAll?: () => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({
  title, children, icon, badge, onViewAll,
}) => (
  <section>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-[22px] font-[800] text-[var(--wn-ink)] flex items-center gap-2">
          {icon}{title}
        </h2>
        {badge}
      </div>
      {onViewAll && (
        <button onClick={onViewAll} className="text-[14px] font-[700] text-[var(--wn-accent)] hover:underline">
          View All
        </button>
      )}
    </div>
    {children}
  </section>
);