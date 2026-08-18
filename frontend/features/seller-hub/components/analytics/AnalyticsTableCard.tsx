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
        <button onClick={onAction} className="text-[13px] font-[700] text-blue-600 hover:underline">
          {actionLabel}
        </button>
      )}
    </div>

    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-[11px] font-[800] text-gray-500 uppercase tracking-wider border-b border-gray-200">
            {headers.map((header, i) => (
              <th key={header} className={`p-4 ${i === 0 ? '' : 'text-right'}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="p-8 text-center text-[13px] font-[500] text-gray-500">
                Not enough data yet.
              </td>
            </tr>
          ) : children}
        </tbody>
      </table>
    </div>
  </div>
);