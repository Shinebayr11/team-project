"use client"

import React from 'react';
import { Avatar } from '../ui/Avatar';

interface SellerRowProps {
  name: string;
  avatarUrl?: string;
  onClick: () => void;
}

/** Хажуугийн самбарын худалдагчийн мөр. */
export const SellerRow: React.FC<SellerRowProps> = ({ name, avatarUrl, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-[var(--wn-surface-2)]"
  >
    {avatarUrl ? (
      // Clerk/Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо шаардахгүй.
      <img src={avatarUrl} alt={name} className="size-8 shrink-0 rounded-full object-cover" />
    ) : (
      <Avatar name={name} size={32} tint="var(--wn-accent-soft)" />
    )}

    <span className="min-w-0 flex-1 truncate text-[13px] font-[700] text-[var(--wn-ink)]">
      {name}
    </span>
  </button>
);
