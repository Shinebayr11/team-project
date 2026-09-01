"use client"

import React, { useRef, useEffect, useState } from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { ShowProductList } from './ShowProductList';
import { ReelProduct, ReelTab, ReelShow } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Star } from 'lucide-react';

interface ReelItemSheetProps {
  isOpen: boolean;
  onClose: () => void;
  show: ReelShow;
  products: Record<ReelTab, ReelProduct[]>;
  activeTab: ReelTab;
  onTabChange: (tab: ReelTab) => void;
  onProductSelect: (product: ReelProduct) => void;
  following: boolean;
  onToggleFollow: () => void;
}

export const ReelItemSheet: React.FC<ReelItemSheetProps> = ({
  isOpen,
  onClose,
  show,
  products,
  activeTab,
  onTabChange,
  onProductSelect,
  following,
  onToggleFollow,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-no-drag]')) return;
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !sheetRef.current) return;
      const delta = e.touches[0].clientY - startY;
      if (delta > 50) {
        onClose();
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startY, isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 inset-x-0 z-50 lg:hidden rounded-t-[24px] bg-white transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxHeight: '85dvh',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-4" data-no-drag>
          <GripHorizontal className="w-5 h-5 text-[var(--wn-ink-4)]" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[var(--wn-surface-2)] flex items-center justify-center text-[var(--wn-ink-3)] hover:text-[var(--wn-ink)] transition-colors"
          aria-label="Close"
          data-no-drag
        >
          <X className="w-5 h-5" />
        </button>

        {/* Seller info */}
        <div className="px-4 pb-4 border-b border-[var(--wn-line)]">
          <div className="text-[10px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase mb-1">
            {show.cat1} • {show.cat2}
          </div>
          <h1 className="text-[18px] font-[800] text-[var(--wn-ink)] leading-tight mb-3">
            {show.title}
          </h1>

          <div className="flex items-center gap-3 mb-3">
            <Avatar name={show.seller} initial={show.initial} tint={show.avatarBg} size={36} />
            <div>
              <div className="font-[700] text-[14px] text-[var(--wn-ink)]">
                {show.seller}
              </div>
              <div className="text-[12px] text-[var(--wn-ink-3)] flex items-center gap-1">
                <Star className="w-3 h-3 fill-[var(--wn-accent)] text-[var(--wn-accent)]" />
                <span className="font-[600] text-[var(--wn-ink-2)]">{show.rating}</span>
                <span>({show.reviews})</span>
              </div>
            </div>
          </div>

          <button
            onClick={onToggleFollow}
            className={`w-full py-2 rounded-xl text-[13px] font-[700] transition-colors ${
              following
                ? 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)]'
                : 'bg-[var(--wn-ink)] text-white hover:bg-[var(--wn-ink-2)]'
            }`}
            data-no-drag
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto" data-no-drag>
          <ShowProductList
            products={products}
            activeTab={activeTab}
            onTabChange={onTabChange}
            onSelect={onProductSelect}
          />
        </div>
      </div>
    </>
  );
};
