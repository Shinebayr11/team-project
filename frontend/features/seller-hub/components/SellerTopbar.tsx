"use client"

import React from 'react';
import { Search, Plus, MessageSquare } from 'lucide-react';

export const SellerTopbar: React.FC = () => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20 shrink-0">
    <div className="flex-1 max-w-2xl">
      <div className="relative flex items-center w-full h-10 rounded-full bg-gray-100 px-4">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search Seller Dashboard"
          aria-label="Search Seller Dashboard"
          className="bg-transparent border-none outline-none w-full text-[14px] text-black placeholder:text-gray-500"
        />
      </div>
    </div>

    <div className="flex items-center gap-5 ml-4">
      <button className="text-gray-600 hover:text-black transition-colors" aria-label="Create">
        <Plus className="w-5 h-5" />
      </button>
      <button className="text-gray-600 hover:text-black transition-colors" aria-label="Messages">
        <MessageSquare className="w-5 h-5" />
      </button>
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shrink-0">
        <img src="https://picsum.photos/32/32" alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  </header>
);