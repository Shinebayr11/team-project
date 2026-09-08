"use client"

import React from 'react';
import { BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export type KpiTone = 'amber' | 'blue' | 'coral' | 'teal' | 'neutral';

/**
 * KPI-гийн аяс нь АНГИЛАЛ заана, утга заадаггүй — «teal» гэдэг нь «сайн»
 * гэсэн үг биш, зөвхөн хөрш картаас нь ялгаж таниулна. Тавуулаа нэг OKLCH
 * жин дээр (дэвсгэр L .955, дүрс L .50) үүсгэсэн тул хос бүр 4.9:1-ээс дээш
 * — өмнө нь 3.24–4.27 буюу хилийн байсан.
 */
const TONES: Record<KpiTone, { bg: string; icon: string }> = {
  amber: { bg: 'var(--wn-admin-tone-amber)', icon: 'var(--wn-admin-tone-amber-ink)' },
  blue: { bg: 'var(--wn-admin-tone-blue)', icon: 'var(--wn-admin-tone-blue-ink)' },
  coral: { bg: 'var(--wn-admin-tone-coral)', icon: 'var(--wn-admin-tone-coral-ink)' },
  teal: { bg: 'var(--wn-admin-tone-teal)', icon: 'var(--wn-admin-tone-teal-ink)' },
  neutral: { bg: 'var(--wn-admin-tone-neutral)', icon: 'var(--wn-admin-tone-neutral-ink)' },
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
    <div className="p-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white shadow-sm flex flex-col hover:shadow-md transition-shadow relative">
      {/* Гарчиг мөрөө дүрсээс өөр хэнтэй ч хуваадаггүй. Өмнө нь өөрчлөлтийн
          хувь энэ мөрөнд зэрэгцэн суудаг тул нарийн багананд гарчиг гурав хүртэл
          мөр таслаж, картууд өөр өндөртэй болдог байв — хувь нь одоо дүнгийнхээ
          хажууд, утгын хамт уншигдах байрандаа суув. */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: palette.bg }}>
          <BarChart2 className="w-4 h-4" style={{ color: palette.icon }} />
        </div>
        <span className="text-[13px] font-[700] text-[var(--wn-admin-ink-2)]">{title}</span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2 mb-1">
        <span className="text-[28px] font-[800] tracking-tight leading-none text-black">{value}</span>
        {delta && (
          <span className={`inline-flex items-center text-[12px] font-[800] ${isUp ? 'text-[var(--wn-admin-ok)]' : 'text-[var(--wn-admin-warn)]'}`}>
            {isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {delta}
          </span>
        )}
      </div>
      {caption && <div className="text-[12px] text-[var(--wn-admin-muted)] font-[600] mt-1">{caption}</div>}
    </div>
  );
};