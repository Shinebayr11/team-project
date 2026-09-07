"use client"

import React from 'react';

export interface FilterTab {
  value: string;
  label: string;
}

interface FilterTabsProps {
  tabs: readonly FilterTab[];
  active: string;
  onChange: (tab: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, active, onChange }) => (
  <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
    {tabs.map(tab => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={`px-4 py-2 rounded-full text-[13px] font-[700] whitespace-nowrap transition-colors ${
          active === tab.value ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);