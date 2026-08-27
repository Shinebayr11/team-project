"use client"

import React from 'react';
import { useNavigate } from '@/lib/router';
import { HomeShow } from '../../types';
import { getWatchPath } from '../../lib/liveShows';
import { Avatar } from '../ui/Avatar';
import { LiveDot } from '../ui/LiveDot';

export const ShowCard: React.FC<{ show: HomeShow }> = ({ show }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-center gap-2 cursor-pointer group w-fit"
        onClick={() => navigate(`/shop?seller=${show.seller}`)}
      >
        <Avatar name={show.seller} size={26} tint="var(--wn-accent-soft)" className="!text-[var(--wn-accent)]" />
        <div className="flex flex-col">
          <span className="text-[13.5px] font-[700] text-[var(--wn-ink)] group-hover:text-[var(--wn-accent)] transition-colors">{show.seller}</span>
          {show.sponsored && <span className="text-[11px] text-[var(--wn-ink-4)] font-[500]">Sponsored</span>}
        </div>
      </div>

      <div
        className="relative w-full aspect-[3/4] bg-[var(--wn-shot)] rounded-[16px] cursor-pointer overflow-hidden group"
        onClick={() => navigate(getWatchPath(show))}
      >
        {show.thumbnail && (
          <img src={show.thumbnail} alt={show.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[12px] font-[600] z-10">
          {show.live !== undefined ? (
            <>
              <LiveDot />
              <span>Лайв</span>
              <span className="opacity-60 ml-1">{show.live} watching</span>
            </>
          ) : (
            <span>{show.at}</span>
          )}
        </div>

        {show.saved && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[var(--wn-ink)] text-[12px] font-[600] z-10">
            {show.saved} saved
          </div>
        )}
      </div>

      <div>
        <h3 className="text-[15px] font-[700] text-[var(--wn-ink)] leading-tight mb-1">{show.title}</h3>
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-[var(--wn-accent)] font-[600]">{show.category}</span>
          <span className="text-[var(--wn-ink-4)]">•</span>
          <span className="text-[var(--wn-ink-3)] truncate">{show.tags}</span>
        </div>
      </div>
    </div>
  );
};