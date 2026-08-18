"use client"

import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  tone: 'red' | 'amber';
  onClick: () => void;
}

const TONES = {
  red: 'bg-red-50 text-red-600 group-hover:bg-red-100',
  amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
};

export const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, tone, onClick }) => (
  <div
    onClick={onClick}
    className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-300 hover:shadow-md transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${TONES[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[16px] font-[800] text-black">{title}</div>
        <div className="text-[14px] text-gray-500 font-[500] mt-0.5">{description}</div>
      </div>
    </div>
    <div className="w-7 h-7 rounded-full border-2 border-gray-200 group-hover:border-black transition-colors flex items-center justify-center">
      <ArrowRightLeft className="w-3 h-3 text-transparent group-hover:text-black" />
    </div>
  </div>
);