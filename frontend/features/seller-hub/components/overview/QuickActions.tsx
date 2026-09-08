"use client"

import React from 'react';
import { useNavigate } from '@/lib/router';
import { Plus, Calendar, Package, ShoppingBag, BarChart2 } from 'lucide-react';

const ACTIONS = [
  { label: 'Бараа нэмэх', to: '/seller/products', icon: Plus },
  { label: 'Дамжуулалт товлох', to: '/seller/shows', icon: Calendar },
  { label: 'Бараа харах', to: '/seller/products', icon: Package },
  { label: 'Захиалга харах', to: '/seller/orders', icon: ShoppingBag },
  { label: 'Тайлан харах', to: '/seller/analytics', icon: BarChart2 },
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {ACTIONS.map(({ label, to, icon: Icon }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-[13px] font-[700] text-black hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>
    </div>
  );
};