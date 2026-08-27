"use client"

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  eyebrow?: string;
  subtitle?: string;
  wide?: boolean;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = ({ title, onClose, children, eyebrow, subtitle, wide }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  // Portal нь server render дээр байхгүй тул эхний client render хүртэл хүлээнэ.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Дуудагчид ихэвчлэн inline сум дамжуулдаг бөгөөд тэдгээрийн эцэг нь секунд
  // тутам дахин render хийж болно. Хэрэв энэ нь effect-ийн хамаарал байсан бол
  // цонх секунд тутам focus-оо алдана — тиймээс хамгийн сүүлийн сумыг ref-д
  // хадгалж, effect-ийг зөвхөн нэг удаа ажиллуулна.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Escape болон Tab-ыг цонхны дотор барина: нээлттэй байхад ард талын
  // элементүүд рүү табаар гарах ёсгүй.
  useEffect(() => {
    // Portal бодитоор холбогдох хүртэл `panelRef` хоосон байна.
    if (!mounted) return;

    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items?.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      // Цонх нээгдэхэд focus нь `tabIndex={-1}` бүрхүүл дээр байдаг ба цонхны
      // текст дээр дарахад ч тийш буцдаг. Тэр үед Tab-ыг чөлөөтэй нь орхивол
      // ард талын хуудас руу гарч, эргэж ирэхгүй.
      const insideItem = active && active !== panelRef.current && panelRef.current?.contains(active);
      if (!insideItem) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [mounted]);

  if (!mounted) return null;

  // Цонхыг document.body руу гаргаснаар `overflow-hidden`, `transform` бүхий
  // эцэг элемент (жишээ нь лайвын видео тайз) үүнийг таслах, дарах боломжгүй.
  return createPortal(
    <div
      data-base-ui-portal=""
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-[#0E0C1A]/44 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative bg-white rounded-[22px] w-full ${wide ? 'max-w-[520px]' : 'max-w-[420px]'} flex flex-col overflow-hidden animate-modal-in outline-none`}
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
            aria-label="Хаах"
            className="w-8 h-8 rounded-full bg-[var(--wn-surface-2)] flex items-center justify-center text-[var(--wn-ink-3)] hover:bg-[var(--wn-line)] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
