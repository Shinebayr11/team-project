"use client"

import React from 'react';
import { CheckCircle2, Check } from 'lucide-react';

export const VerificationPanel: React.FC = () => (
  <div>
    <h2 className="text-[24px] font-[800] text-black mb-6">Худалдагчийн баталгаажуулалт</h2>

    <div className="bg-[var(--wn-admin-ok-soft)] border border-[var(--wn-admin-ok-soft)] rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 text-[var(--wn-admin-ok)] font-[800] text-[16px] mb-1">
        <CheckCircle2 className="w-5 h-5" /> Баталгаажсан худалдагч
      </div>
      <div className="text-[var(--wn-admin-ok)] text-[14px] font-[500]">Таны худалдагчийн бүртгэл баталгаажлаа.</div>
    </div>

    <div className="bg-white border border-[var(--wn-admin-card-border)] rounded-2xl p-6 shadow-sm">
      <h3 className="text-[16px] font-[800] text-black mb-4">Худалдагчийн бүртгэлийн төлөв</h3>
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-[var(--wn-admin-chip)] text-black text-[12px] font-[800] rounded-md tracking-wide">ИДЭВХТЭЙ</span>
        <span className="text-[14px] text-[var(--wn-admin-ink-2)] font-[500] flex items-center gap-1.5">
          <Check className="w-4 h-4" /> Таны худалдагчийн бүртгэл идэвхтэй байна.
        </span>
      </div>
    </div>
  </div>
);