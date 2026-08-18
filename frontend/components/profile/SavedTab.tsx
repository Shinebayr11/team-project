"use client"

import React from 'react';
import { HomeShow } from '../../types';
import { ShowCard } from '../cards/ShowCard';

export const SavedTab: React.FC<{ shows: HomeShow[] }> = ({ shows }) => (
  <div className="flex flex-col gap-6">
    <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Saved Shows</h2>
    {shows.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {shows.map(show => <ShowCard key={`${show.seller}-${show.title}`} show={show} />)}
      </div>
    ) : (
      <div className="py-12 text-center text-[15px] font-[600] text-[var(--wn-ink-3)]">
        You haven't saved any shows yet.
      </div>
    )}
  </div>
);