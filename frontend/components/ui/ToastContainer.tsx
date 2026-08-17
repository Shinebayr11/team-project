"use client"

import React from 'react';
import { useStore } from '../../store';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="bg-[var(--wn-shot)] text-white px-5 py-3 rounded-[23px] flex items-center gap-3 animate-slide-up"
          style={{ boxShadow: '0 12px 32px rgba(12,12,24,0.26)' }}
        >
          <div className="w-[7px] h-[7px] rounded-full bg-[#4ADE80]" />
          <span className="text-[14px] font-[500]">{t.msg}</span>
        </div>
      ))}
    </div>
  );
};