"use client"

import React from 'react';

export type StatusTone = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'muted';

const TONES: Record<StatusTone, { pill: string; dot: string }> = {
  green: { pill: 'bg-[#E6F4EA] text-[#166534]', dot: 'bg-[#166534]' },
  blue: { pill: 'bg-blue-50 text-blue-600', dot: 'bg-blue-600' },
  amber: { pill: 'bg-[#FEF3C7] text-[#92400E]', dot: 'bg-[#92400E]' },
  red: { pill: 'bg-red-50 text-red-600', dot: 'bg-red-600 animate-pulse-dot' },
  gray: { pill: 'bg-gray-100 text-gray-600', dot: 'bg-gray-500' },
  muted: { pill: 'bg-gray-100 text-gray-400', dot: 'bg-gray-400' },
};

interface StatusPillProps {
  label: string;
  tone: StatusTone;
  withDot?: boolean;
}

/** Single source of truth for every status chip in the seller hub. */
export const StatusPill: React.FC<StatusPillProps> = ({ label, tone, withDot }) => {
  const { pill, dot } = TONES[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-[800] uppercase tracking-wider ${pill}`}>
      {withDot && <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label.replace(/_/g, ' ')}
    </span>
  );
};