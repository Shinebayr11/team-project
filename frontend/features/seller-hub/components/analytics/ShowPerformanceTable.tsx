"use client"

import React from 'react';
import { Video } from 'lucide-react';
import { SellerShow } from '@/features/seller-hub/types';
import { AnalyticsTableCard } from './AnalyticsTableCard';

interface ShowPerformanceTableProps {
  shows: SellerShow[];
  onViewShows: () => void;
}

export const ShowPerformanceTable: React.FC<ShowPerformanceTableProps> = ({ shows, onViewShows }) => (
  <AnalyticsTableCard
    title="Show Performance"
    actionLabel="View Shows"
    onAction={onViewShows}
    headers={['Show', 'Viewers', 'Revenue']}
    isEmpty={shows.length === 0}
  >
    {shows.map(show => (
      <tr key={show.id} className="text-[14px] hover:bg-gray-50 transition-colors cursor-pointer" onClick={onViewShows}>
        <td className="p-4 font-[700] text-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
              <Video className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <div className="truncate max-w-[160px]">{show.title}</div>
              <div className="text-[11px] font-[500] text-gray-500 mt-0.5">
                {new Date(show.scheduledAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </td>
        <td className="p-4 text-right font-[600] text-gray-600">{show.stats.viewers}</td>
        <td className="p-4 text-right font-[800] text-black">₮{show.stats.revenue.toLocaleString()}</td>
      </tr>
    ))}
  </AnalyticsTableCard>
);