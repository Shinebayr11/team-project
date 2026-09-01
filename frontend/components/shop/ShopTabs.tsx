"use client"

import React from 'react';

export type ShopTab = 'products' | 'reviews';

interface ShopTabsProps {
  active: ShopTab;
  onChange: (tab: ShopTab) => void;
}

const TABS: ShopTab[] = ['products', 'reviews'];

export const ShopTabs: React.FC<ShopTabsProps> = ({ active, onChange }) => (
  <div className="px-4 sm:px-6 lg:px-8 border-b border-[var(--wn-line)] flex items-center gap-6 sm:gap-8 mb-8">
    {TABS.map(tab => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`pb-4 text-[15px] font-[700] capitalize border-b-2 transition-colors ${
          active === tab
            ? 'border-[var(--wn-accent)] text-[var(--wn-accent)]'
            : 'border-transparent text-[var(--wn-ink-3)] hover:text-[var(--wn-ink)]'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);