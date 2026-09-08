"use client"

import React from 'react';

export type StatusTone = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'muted';

/**
 * Төлөвийн өнгө нь ЗӨВХӨН утга дамжуулна — accent-тай хэзээ ч холилдохгүй.
 * Дөрвүүлээ ижил OKLCH жин дээр (дэвсгэр L .955 C .035, бичиг L .45 C .115)
 * үүсгэсэн тул нэг эгнээнд зэрэгцэхэд аль нэг нь дүрвэж харагдахгүй.
 *
 * `muted` нь өмнө нь `text-[var(--wn-admin-muted)]` дээр `bg-[var(--wn-admin-chip)]` буюу 2.36:1 байсан —
 * «Архивласан» бараа уншигдахгүй байв. Одоо `--wn-admin-muted` 5.34:1.
 */
const TONES: Record<StatusTone, { pill: string; dot: string }> = {
  green: { pill: 'bg-[var(--wn-admin-ok-soft)] text-[var(--wn-admin-ok)]', dot: 'bg-[var(--wn-admin-ok)]' },
  blue: { pill: 'bg-[var(--wn-admin-info-soft)] text-[var(--wn-admin-info)]', dot: 'bg-[var(--wn-admin-info)]' },
  amber: { pill: 'bg-[var(--wn-admin-warn-soft)] text-[var(--wn-admin-warn)]', dot: 'bg-[var(--wn-admin-warn)]' },
  red: { pill: 'bg-[var(--wn-admin-danger-soft)] text-[var(--wn-admin-danger)]', dot: 'bg-[var(--wn-admin-danger)] animate-pulse-dot' },
  gray: { pill: 'bg-[var(--wn-admin-chip)] text-[var(--wn-admin-ink-2)]', dot: 'bg-[var(--wn-admin-ink-2)]' },
  muted: { pill: 'bg-[var(--wn-admin-chip)] text-[var(--wn-admin-muted)]', dot: 'bg-[var(--wn-admin-muted)]' },
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