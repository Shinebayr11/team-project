"use client"

import React from 'react';

export interface InsightRow {
  label: string;
  value: string | number;
  /** Optional emphasis colour for warning-style values. */
  tone?: 'amber' | 'red';
}

interface InsightPanelProps {
  title: string;
  icon: React.ElementType;
  rows: InsightRow[];
}

const TONES = { amber: 'text-[var(--wn-admin-warn)]', red: 'text-[var(--wn-admin-danger)]' };

export const InsightPanel: React.FC<InsightPanelProps> = ({ title, icon: Icon, rows }) => (
  <div className="p-6 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white shadow-sm">
    <h3 className="text-[16px] font-[800] text-black mb-4 flex items-center gap-2">
      <Icon className="w-4 h-4 text-[var(--wn-admin-muted)]" /> {title}
    </h3>
    <div className="flex flex-col gap-4">
      {rows.map(row => (
        <div key={row.label} className="flex justify-between items-center">
          <span className="text-[13px] font-[600] text-[var(--wn-admin-muted)]">{row.label}</span>
          <span className={`text-[14px] font-[800] ${row.tone ? TONES[row.tone] : 'text-black'}`}>{row.value}</span>
        </div>
      ))}
    </div>
  </div>
);