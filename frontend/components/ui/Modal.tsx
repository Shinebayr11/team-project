"use client"

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  eyebrow?: string;
  subtitle?: string;
  wide?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children, eyebrow, subtitle, wide }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[#0E0C1A]/44 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative bg-white rounded-[22px] w-full ${wide ? 'max-w-[520px]' : 'max-w-[420px]'} flex flex-col overflow-hidden animate-slide-up`}
        style={{ boxShadow: '0 24px 64px rgba(12,12,24,0.28)' }}
      >
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            {eyebrow && <div className="text-[11px] font-[800] tracking-wider uppercase text-[var(--wn-accent)] mb-1">{eyebrow}</div>}
            <h2 className="text-[19px] font-[800] text-[var(--wn-ink)] tracking-tight">{title}</h2>
            {subtitle && <p className="text-[14px] text-[var(--wn-ink-3)] mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[var(--wn-surface-2)] flex items-center justify-center text-[var(--wn-ink-3)] hover:bg-[var(--wn-line)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};