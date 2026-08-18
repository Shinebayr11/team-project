"use client"

import React from 'react';

/** The pulsing red dot used anywhere a stream is on air. */
export const LiveDot: React.FC<{ className?: string }> = ({ className = 'w-1.5 h-1.5' }) => (
  <div className={`${className} rounded-full bg-[var(--wn-live)] animate-pulse-dot`} />
);