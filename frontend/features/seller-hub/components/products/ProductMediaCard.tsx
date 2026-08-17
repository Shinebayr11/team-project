"use client"

import React from 'react';
import { Plus, X, Smartphone } from 'lucide-react';
import { Panel } from '../DataCard';

const PLACEHOLDER_SLOTS = [1, 2, 3];

/** Media upload is not wired to a backend yet — these are visual placeholders. */
export const ProductMediaCard: React.FC = () => (
  <Panel title="Media">
    <div className="flex gap-4 overflow-x-auto pb-2">
      <button className="w-[100px] h-[100px] shrink-0 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors">
        <Plus className="w-6 h-6 mb-1" />
        <span className="text-[12px] font-[600]">Add Photo</span>
      </button>

      {PLACEHOLDER_SLOTS.map(slot => (
        <div key={slot} className="w-[100px] h-[100px] shrink-0 rounded-xl bg-gray-100 border border-gray-200 relative">
          <button
            aria-label="Remove photo"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-black"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>

    <div className="mt-4 p-4 rounded-xl bg-[#5B3FE0] text-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Smartphone className="w-4 h-4" /></div>
        <div>
          <div className="text-[14px] font-[700]">Mobile Upload</div>
          <div className="text-[12px] text-white/80">Upload photos and video directly from your phone.</div>
        </div>
      </div>
      <button className="px-4 py-1.5 rounded-full bg-white text-[#5B3FE0] text-[13px] font-[700]">Try It</button>
    </div>
  </Panel>
);