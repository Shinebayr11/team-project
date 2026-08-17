"use client"

import React from 'react';
import { Link } from '@/lib/router';
import { SellerShow } from '@/features/seller-hub/types';

interface ShowListSectionProps {
  title: string;
  shows: SellerShow[];
  icon: React.ElementType;
  actionLabel: string;
  onAction: () => void;
  emptyMessage: string;
  /** Renders the row subtitle — schedule for upcoming, results for completed. */
  subtitle: (show: SellerShow) => string;
  viewAllTo?: string;
  emptyAction?: { label: string; onClick: () => void };
}

export const ShowListSection: React.FC<ShowListSectionProps> = ({
  title, shows, icon: Icon, actionLabel, onAction, emptyMessage, subtitle, viewAllTo, emptyAction,
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-[18px] font-[800] text-black">{title}</h2>
      {viewAllTo && (
        <Link to={viewAllTo} className="text-[14px] font-[700] text-blue-600 hover:underline">View all</Link>
      )}
    </div>

    {shows.length > 0 ? shows.map(show => (
      <div key={show.id} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[15px] font-[800] text-black">{show.title}</div>
            <div className="text-[13px] text-gray-500 font-[500] mt-0.5">{subtitle(show)}</div>
          </div>
        </div>
        <button onClick={onAction} className="px-4 py-1.5 rounded-lg bg-gray-100 text-[13px] font-[700] text-black hover:bg-gray-200 transition-colors">
          {actionLabel}
        </button>
      </div>
    )) : (
      <div className="p-8 rounded-2xl border border-gray-200 bg-white text-center flex flex-col items-center">
        <div className="text-gray-500 font-[500] mb-4">{emptyMessage}</div>
        {emptyAction && (
          <button onClick={emptyAction.onClick} className="px-5 py-2 rounded-full bg-black text-white text-[14px] font-[700] hover:bg-gray-800 transition-colors">
            {emptyAction.label}
          </button>
        )}
      </div>
    )}
  </div>
);