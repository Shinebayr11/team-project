"use client"

import React from 'react';

interface AvatarProps {
  /** Falls back to the first letter of `name` when no explicit initial is given. */
  name: string;
  initial?: string;
  tint?: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, initial, tint, size = 40, className = '' }) => (
  <div
    className={`rounded-full flex items-center justify-center font-[700] text-[var(--wn-ink)] shrink-0 ${className}`}
    style={{
      width: size,
      height: size,
      fontSize: Math.round(size * 0.4),
      backgroundColor: tint ?? 'var(--wn-surface-2)',
    }}
  >
    {initial ?? name.charAt(0).toUpperCase()}
  </div>
);