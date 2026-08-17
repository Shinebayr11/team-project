"use client"

import React, { useState } from 'react';
import { ProductTag } from '../../types';
import { LiveDot } from '../ui/LiveDot';

const THUMB_COUNT = 5;

const tagClass = (tag: ProductTag) => {
  if (tag === 'Live now') return 'bg-black/40 backdrop-blur-md text-white';
  if (tag === 'Giveaway') return 'bg-[var(--wn-accent-soft)] text-[var(--wn-accent)]';
  return 'bg-white/90 backdrop-blur-md text-[var(--wn-ink)]';
};

export const ProductGallery: React.FC<{ tag: ProductTag }> = ({ tag }) => {
  const [activeThumb, setActiveThumb] = useState(0);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="w-full aspect-square bg-[var(--wn-shot)] rounded-[24px] relative overflow-hidden">
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[13px] font-[600] flex items-center gap-2 ${tagClass(tag)}`}>
          {tag === 'Live now' && <LiveDot className="w-2 h-2" />}
          {tag}
        </div>
      </div>

      <div className="flex gap-4">
        {Array.from({ length: THUMB_COUNT }, (_, i) => (
          <div
            key={i}
            onClick={() => setActiveThumb(i)}
            className={`flex-1 aspect-square rounded-[12px] bg-[var(--wn-shot)] cursor-pointer border-2 transition-colors ${
              i === activeThumb ? 'border-[var(--wn-accent)]' : 'border-transparent hover:border-[var(--wn-line-3)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};