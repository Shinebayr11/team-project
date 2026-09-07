"use client"

import React from 'react';
import { CheckCircle2, Check } from 'lucide-react';

export const VerificationPanel: React.FC = () => (
  <div>
    <h2 className="text-[24px] font-[800] text-black mb-6">Худалдагчийн баталгаажуулалт</h2>

    <div className="bg-[#E6F4EA] border border-[#CEEAD6] rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 text-[#166534] font-[800] text-[15px] mb-1">
        <CheckCircle2 className="w-5 h-5" /> Баталгаажсан худалдагч
      </div>
      <div className="text-[#166534] text-[14px] font-[500]">Таны худалдагчийн бүртгэл баталгаажлаа.</div>
    </div>

    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-[16px] font-[800] text-black mb-4">Худалдагчийн бүртгэлийн төлөв</h3>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-gray-100 text-black text-[12px] font-[800] rounded-md tracking-wide">ИДЭВХТЭЙ</span>
        <span className="text-[14px] text-gray-600 font-[500] flex items-center gap-1.5">
          <Check className="w-4 h-4" /> Таны худалдагчийн бүртгэл идэвхтэй байна.
        </span>
      </div>
    </div>
  </div>
);