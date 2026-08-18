"use client"

import React from 'react';
import { ExploreCategory } from '../../data/exploreCategories';

interface CategoryGridProps {
  categories: ExploreCategory[];
  onSelect: (category: ExploreCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelect }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {categories.map(category => (
      <div
        key={category.id}
        onClick={() => onSelect(category)}
        className="p-4 rounded-2xl bg-white border border-[var(--wn-line)] hover:border-[var(--wn-line-2)] hover:shadow-sm transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="text-[24px]">{category.icon}</div>
          <div className="text-[15px] font-[800] text-[var(--wn-ink)] group-hover:text-[var(--wn-accent)] transition-colors">
            {category.name}
          </div>
        </div>
        <div className="flex items-center gap-3 text-[12px] font-[600] text-[var(--wn-ink-3)]">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--wn-live)]" /> {category.viewers}
          </span>
          <span>{category.shows} live</span>
        </div>
      </div>
    ))}
  </div>
);