"use client"

import React from 'react';

interface DataCardProps {
  children: React.ReactNode;
  /** Optional toolbar row rendered above the table on a tinted band. */
  toolbar?: React.ReactNode;
}

export const DataCard: React.FC<DataCardProps> = ({ children, toolbar }) => (
  <div className="border border-[var(--wn-admin-card-border)] rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
    {toolbar && (
      <div className="p-4 border-b border-[var(--wn-admin-card-border)] bg-[var(--wn-admin-row-rule)] flex flex-wrap items-center justify-between gap-4">
        {toolbar}
      </div>
    )}
    <div className="overflow-x-auto">{children}</div>
  </div>
);

export const Panel: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({
  title, children, action,
}) => (
  <div className="bg-white border border-[var(--wn-admin-card-border)] rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[16px] font-[800] text-black">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

export const EmptyRow: React.FC<{ colSpan: number; message: string }> = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="p-12 text-center text-[14px] font-[600] text-[var(--wn-admin-muted)]">
      {message}
    </td>
  </tr>
);