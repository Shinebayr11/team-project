"use client"

import React from 'react';

export type BulkAction = 'activate' | 'draft' | 'archive' | 'delete';

interface BulkActionBarProps {
  count: number;
  onAction: (action: BulkAction) => void;
}

const NEUTRAL_ACTIONS: { action: BulkAction; label: string }[] = [
  { action: 'activate', label: 'Идэвхжүүлэх' },
  { action: 'draft', label: 'Ноорог болгох' },
  { action: 'archive', label: 'Архивлах' },
];

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ count, onAction }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-[13px] font-[600] text-[var(--wn-admin-ink-2)] mr-2">{count} сонгогдсон</span>

    {NEUTRAL_ACTIONS.map(({ action, label }) => (
      <button
        key={action}
        onClick={() => onAction(action)}
        className="px-3 py-1.5 rounded-lg bg-white border border-[var(--wn-ink-4)] text-[13px] font-[600] text-black hover:bg-[var(--wn-admin-row-rule)]"
      >
        {label}
      </button>
    ))}

    <button
      onClick={() => onAction('delete')}
      className="px-3 py-1.5 rounded-lg bg-[var(--wn-admin-danger-soft)] border border-[var(--wn-admin-danger)]/30 text-[13px] font-[600] text-[var(--wn-admin-danger)] hover:bg-[var(--wn-admin-danger-soft)]"
    >
      Устгах
    </button>
  </div>
);