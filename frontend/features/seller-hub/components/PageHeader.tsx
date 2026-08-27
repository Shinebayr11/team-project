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
          aria-label="Go back"
          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}
      <div>
        <h1 className="text-[24px] font-[800] tracking-tight text-black">{title}</h1>
        {description && <p className="text-[14px] text-gray-500 font-[500] mt-1">{description}</p>}
      </div>
    </div>
    {children && <div className="flex items-center gap-3">{children}</div>}
  </div>
);