"use client"

import React from 'react';
import { Star } from 'lucide-react';
import { ReelShow } from '../../types';
import { Avatar } from '../ui/Avatar';

interface ShowInfoPanelProps {
  show: ReelShow;
  following: boolean;
  onToggleFollow: () => void;
  onOpenShop: () => void;
}

export const ShowInfoPanel: React.FC<ShowInfoPanelProps> = ({
  show, following, onToggleFollow, onOpenShop,
}) => (
  <div className="p-4 border-b border-[var(--wn-line)]">
    <div className="text-[10px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase mb-1">
      {show.cat1} • {show.cat2}
    </div>
    <h1 className="text-[20px] font-[800] text-[var(--wn-ink)] leading-tight mb-3">{show.title}</h1>

    <div className="flex items-center gap-3 mb-3 cursor-pointer group" onClick={onOpenShop}>
      <Avatar name={show.seller} initial={show.initial} tint={show.avatarBg} size={36} />
      <div>
        <div className="font-[700] text-[14px] text-[var(--wn-ink)] group-hover:text-[var(--wn-accent)] transition-colors">
          {show.seller}
        </div>
        <div className="text-[12px] text-[var(--wn-ink-3)] flex items-center gap-1">
          <Star className="w-3 h-3 fill-[var(--wn-accent)] text-[var(--wn-accent)]" />
          <span className="font-[600] text-[var(--wn-ink-2)]">{show.rating}</span>
          <span>({show.reviews})</span>
        </div>
      </div>
    </div>

    <button
      onClick={onToggleFollow}
      className={`w-full py-2 rounded-xl text-[13px] font-[700] transition-colors ${
        following ? 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)]' : 'bg-[var(--wn-ink)] text-white hover:bg-[var(--wn-ink-2)]'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  </div>
);