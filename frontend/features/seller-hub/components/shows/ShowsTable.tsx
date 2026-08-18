"use client"

import React from 'react';
import { SellerShow } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { showTone } from '../statusTones';
import { EmptyRow } from '../DataCard';

interface ShowsTableProps {
  shows: SellerShow[];
  onSelect: (id: string) => void;
}

const HEADERS = ['Show', 'When', 'Items', 'Status'];

export const ShowsTable: React.FC<ShowsTableProps> = ({ shows, onSelect }) => (
  <table className="w-full text-left border-collapse min-w-[900px]">
    <thead>
      <tr className="bg-white text-[12px] font-[800] text-gray-500 uppercase tracking-wider border-b border-gray-200">
        {HEADERS.map(h => <th key={h} className="p-4">{h}</th>)}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {shows.map(show => (
        <tr
          key={show.id}
          onClick={() => onSelect(show.id)}
          className="text-[14px] hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <td className="p-4 font-[800] text-black">
            <div>{show.title}</div>
            <div className="text-[12px] font-[500] text-gray-500 mt-0.5">{show.category}</div>
          </td>
          <td className="p-4 font-[600] text-gray-600">{new Date(show.scheduledAt).toLocaleString()}</td>
          <td className="p-4 font-[600] text-black">{show.products.length}</td>
          <td className="p-4"><StatusPill label={show.status} tone={showTone(show.status)} withDot /></td>
        </tr>
      ))}

      {shows.length === 0 && <EmptyRow colSpan={4} message="No shows found." />}
    </tbody>
  </table>
);