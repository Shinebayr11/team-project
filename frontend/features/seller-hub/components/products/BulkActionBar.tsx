"use client"

import React from 'react';

export type BulkAction = 'activate' | 'draft' | 'archive' | 'delete';

interface BulkActionBarProps {
  count: number;
  onAction: (action: BulkAction) => void;
}

const NEUTRAL_ACTIONS: { action: BulkAction; label: string }[] = [
  { action: 'activate', label: 'Activate' },
  { action: 'draft', label: 'Draft' },
  { action: 'archive', label: 'Archive' },
];

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ count, onAction }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-[13px] font-[600] text-gray-600 mr-2">{count} selected</span>

    {NEUTRAL_ACTIONS.map(({ action, label }) => (
      <button
        key={action}
        onClick={() => onAction(action)}
        className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-[13px] font-[600] text-black hover:bg-gray-50"
      >
        {label}
      </button>
    ))}

    <button
      onClick={() => onAction('delete')}
      className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-[13px] font-[600] text-red-600 hover:bg-red-100"
    >
      Delete
    </button>
  </div>
);