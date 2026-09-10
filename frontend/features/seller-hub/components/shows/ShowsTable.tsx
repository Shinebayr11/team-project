"use client"

import React from 'react';
import { SellerShow } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { showTone, SHOW_STATUS_LABELS } from '../statusTones';
import { EmptyRow } from '../DataCard';
import { humanWhen, untilLabel } from './showSchedule';

interface ShowsTableProps {
  shows: SellerShow[];
  onSelect: (id: string) => void;
}

const HEADERS = ['Шууд дамжуулалт', 'Хэзээ', 'Бараа', 'Төлөв'];

export const ShowsTable: React.FC<ShowsTableProps> = ({ shows, onSelect }) => (
  <table className="w-full text-left border-collapse min-w-[900px]">
    <thead>
      <tr className="bg-white text-[12px] font-[800] text-[var(--wn-admin-muted)] uppercase tracking-wider border-b border-[var(--wn-admin-card-border)]">
        {HEADERS.map(h => <th key={h} className="p-4">{h}</th>)}
      </tr>
    </thead>
    <tbody className="divide-y divide-[var(--wn-admin-row-rule)]">
      {shows.map(show => {
        const when = new Date(show.scheduledAt);
        const until = untilLabel(when);
        return (
        <tr
          key={show.id}
          onClick={() => onSelect(show.id)}
          className="text-[14px] hover:bg-[var(--wn-admin-row-rule)] transition-colors cursor-pointer"
        >
          <td className="p-4 font-[800] text-black">
            <div>{show.title}</div>
            <div className="text-[12px] font-[500] text-[var(--wn-admin-muted)] mt-0.5">{show.category}</div>
          </td>
          {/* Өмнө нь `toLocaleString()` буюу ХӨТЧИЙН хэлээр «8/18/2026,
              1:44:15 PM» гэж гардаг байв — монгол дэлгэц дээр америк формат,
              дээрээс нь хэнд ч хэрэггүй секунд. Маягтынхаа хэлээр бичнэ. */}
          <td className="p-4 font-[600] text-[var(--wn-admin-ink-2)]">
            <div>{humanWhen(when)}</div>
            {until && (
              <div className="mt-0.5 text-[12px] font-[500] text-[var(--wn-admin-muted)]">{until}</div>
            )}
          </td>
          <td className="p-4 font-[600] text-black">{show.products.length}</td>
          <td className="p-4"><StatusPill label={SHOW_STATUS_LABELS[show.status]} tone={showTone(show.status)} withDot /></td>
        </tr>
        );
      })}

      {shows.length === 0 && <EmptyRow colSpan={4} message="Шууд дамжуулалт олдсонгүй." />}
    </tbody>
  </table>
);