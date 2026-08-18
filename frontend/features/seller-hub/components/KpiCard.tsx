"use client"

import React from 'react';
import { BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export type KpiTone = 'amber' | 'blue' | 'coral' | 'teal' | 'neutral';

const TONES: Record<KpiTone, { bg: string; icon: string }> = {
  amber: { bg: '#FDF1E0', icon: '#B9791F' },
  blue: { bg: '#E6F0FB', icon: '#3B73B0' },
  coral: { bg: '#FBE9E6', icon: '#C05D4C' },
  teal: { bg: '#E9F4F1', icon: '#3F8672' },
  neutral: { bg: '#F3F4F6', icon: '#4B5563' },
};

interface KpiCardProps {
  title: string;
  value: string | number;
  tone: KpiTone;
  caption?: string;
  /** Signed percentage, e.g. "+12.4%". Drives the arrow direction and colour. */
  delta?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, tone, caption, delta }) => {
  const palette = TONES[tone];
  const isUp = delta?.startsWith('+');

  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col hover:shadow-md transition-shadow relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center" style={{ backgroundColor: palette.bg }}>
            <BarChart2 className="w-4 h-4" style={{ color: palette.icon }} />
          </div>
          <span className="text-[13px] font-[700] text-gray-600">{title}</span>
        </div>
        {delta && (
          <div className={`flex items-center text-[12px] font-[800] ${isUp ? 'text-[#166534]' : 'text-[#92400E]'}`}>
            {isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {delta}
          </div>
        )}
      </div>
      <div className="text-[28px] font-[800] tracking-tight leading-none text-black mb-1">{value}</div>
      {caption && <div className="text-[12px] text-gray-500 font-[600] mt-1">{caption}</div>}
    </div>
  );
};