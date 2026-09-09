"use client"

import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  /** Rendered on the right — action buttons, filters, etc. */
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, onBack, children }) => (
  <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Буцах"
          className="w-8 h-8 rounded-full bg-white border border-[var(--wn-admin-card-border)] flex items-center justify-center hover:bg-[var(--wn-admin-row-rule)] transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--wn-admin-ink-2)]" />
        </button>
      )}
      <div>
        <h1 className="text-[24px] font-[800] tracking-tight text-black">{title}</h1>
        {description && <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500] mt-1">{description}</p>}
      </div>
    </div>
    {children && <div className="flex items-center gap-3">{children}</div>}
  </div>
);