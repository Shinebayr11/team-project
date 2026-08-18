"use client"

import React from 'react';
import { useNavigate } from '@/lib/router';
import { HomeShow } from '../../types';

export const UpcomingShows: React.FC<{ shows: HomeShow[] }> = ({ shows }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {shows.map(show => (
        <div key={`${show.seller}-${show.title}`} className="flex flex-col gap-3">
          <div
            className="relative w-full aspect-[3/4] bg-[var(--wn-shot)] rounded-[16px] cursor-pointer overflow-hidden group"
            onClick={() => navigate(`/shop?seller=${show.seller}`)}
          >
            {show.thumbnail && (
              <img src={show.thumbnail} alt={show.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[var(--wn-ink)] text-[12px] font-[700]">
              {show.at}
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <button className="w-full py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-[13px] font-[700] hover:bg-white/30 transition-colors">
                Remind Me
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-[var(--wn-accent-soft)] flex items-center justify-center text-[10px] font-[700] text-[var(--wn-accent)]">
                {show.seller.charAt(0).toUpperCase()}
              </div>
              <span className="text-[13px] font-[700] text-[var(--wn-ink-2)]">{show.seller}</span>
            </div>
            <h3 className="text-[15px] font-[800] text-[var(--wn-ink)] leading-tight mb-1">{show.title}</h3>
            <div className="text-[13px] font-[600] text-[var(--wn-accent)]">{show.category}</div>
          </div>
        </div>
      ))}
    </div>
  );
};