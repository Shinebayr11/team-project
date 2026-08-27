"use client"

import React from 'react';
import { HomeShow } from '../../types';
import { LiveDot } from '../ui/LiveDot';

interface FeaturedShowProps {
  show: HomeShow;
  onWatch: () => void;
}

export const FeaturedShow: React.FC<FeaturedShowProps> = ({ show, onWatch }) => (
  <div
    onClick={onWatch}
    className="relative w-full h-[360px] rounded-[24px] bg-[var(--wn-shot-deep)] overflow-hidden mb-12 cursor-pointer group"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

    <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[14px] font-[700]">
      <LiveDot className="w-2 h-2" />
      <span>Шууд</span>
      <span className="opacity-80 ml-1">{show.live} watching</span>
    </div>

    <div className="absolute bottom-8 left-8 right-8 z-20 flex items-end justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[var(--wn-accent)] flex items-center justify-center text-white font-[700] text-[16px]">
            {show.seller.charAt(0).toUpperCase()}
          </div>
          <span className="text-[16px] font-[700] text-white hover:underline">{show.seller}</span>
          {show.sponsored && (
            <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[11px] font-[700] uppercase tracking-wider">Sponsored</span>
          )}
        </div>
        <h2 className="text-[36px] font-[800] text-white leading-tight mb-2 group-hover:text-[var(--wn-accent-soft)] transition-colors">{show.title}</h2>
        <div className="text-[15px] font-[600] text-white/80">{show.category} • {show.tags}</div>
      </div>
      <button className="px-8 py-3.5 rounded-full bg-[var(--wn-accent)] text-white text-[16px] font-[800] hover:bg-[var(--wn-accent-hover)] transition-colors shadow-[0_6px_18px_rgba(91,63,224,0.3)] shrink-0">
        Watch Live
      </button>
    </div>
  </div>
);