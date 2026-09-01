"use client"

import React from 'react';
import { Star } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface ReelSellerRowProps {
  sellerName: string;
  rating: string;
  following: boolean;
  onToggleFollow: () => void;
}

export const ReelSellerRow: React.FC<ReelSellerRowProps> = ({
  sellerName,
  rating,
  following,
  onToggleFollow,
}) => (
  <div
    className="absolute left-3 z-20 flex items-center gap-2 lg:hidden"
    style={{ bottom: 'calc(115px + max(12px, env(safe-area-inset-bottom)))' }}
  >
    <Avatar name={sellerName} size={32} />
    <div className="flex-1 min-w-0">
      <div className="text-[13px] font-[700] text-white truncate">{sellerName}</div>
      <div className="flex items-center gap-1 text-[11px] text-white/70">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span>{rating}</span>
      </div>
    </div>
    <button
      onClick={onToggleFollow}
      className={`px-3 py-1 rounded-full text-[11px] font-[700] shrink-0 transition-colors ${
        following
          ? 'bg-white/20 text-white'
          : 'bg-[var(--wn-accent)] text-white hover:bg-[var(--wn-accent-hover)]'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  </div>
);
