"use client"

import React from 'react';
import { HomeShow } from '../../types';
import { ShowCard } from '../cards/ShowCard';

interface CategorySectionProps {
  category: string;
  shows: HomeShow[];
  onSeeMore: () => void;
  limit?: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category, shows, onSeeMore, limit = 4,
}) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-[20px] font-[800] text-[var(--wn-ink)]">{category}</h2>
      <button onClick={onSeeMore} className="text-[14px] font-[700] text-[var(--wn-accent)] hover:underline">
        See more
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {shows.slice(0, limit).map(show => (
        <ShowCard key={`${show.seller}-${show.title}`} show={show} />
      ))}
    </div>
  </div>
);