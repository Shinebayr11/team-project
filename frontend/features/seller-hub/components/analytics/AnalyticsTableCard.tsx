"use client"

import React from 'react';

interface AnalyticsTableCardProps {
  title: string;
  headers: string[];
  children: React.ReactNode;
  isEmpty: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

/** Shared shell for the small side-by-side analytics tables. */
export const AnalyticsTableCard: React.FC<AnalyticsTableCardProps> = ({
  title, headers, children, isEmpty, actionLabel, onAction,
}) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[16px] font-[800] text-black">{title}</h3>
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-[13px] font-[700] text-[var(--wn-admin-accent)] hover:underline">
          {actionLabel}
        </button>
      )}
    </div>

    <div className="border border-[var(--wn-admin-card-border)] rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Хүснэгт нарийн дэлгэц дээр тайрагдахгүй, дотроо гүйнэ. */}
      <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-left border-collapse">
        <thead>
          <tr className="bg-[var(--wn-admin-row-rule)] text-[11px] font-[800] text-[var(--wn-admin-muted)] uppercase tracking-wider border-b border-[var(--wn-admin-card-border)]">
            {headers.map((header, i) => (
              <th key={header} className={`p-4 ${i === 0 ? '' : 'text-right'}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--wn-admin-row-rule)]">
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="p-8 text-center text-[13px] font-[500] text-[var(--wn-admin-muted)]">
                Одоогоор хангалттай мэдээлэл алга.
              </td>
            </tr>
          ) : children}
        </tbody>
      </table>
      </div>
    </div>
  </div>
);