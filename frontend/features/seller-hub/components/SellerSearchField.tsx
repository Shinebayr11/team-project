"use client"

import React from 'react';
import { Search } from 'lucide-react';

interface SellerSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const SellerSearchField: React.FC<SellerSearchFieldProps> = ({ value, onChange, placeholder }) => (
  <div className="relative flex items-center w-[300px] h-10 rounded-lg bg-white border border-gray-300 px-3">
    <Search className="w-4 h-4 text-gray-400 mr-2" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="bg-transparent border-none outline-none w-full text-[14px] text-black"
    />
  </div>
);