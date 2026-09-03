"use client"

import React, { useRef } from 'react';
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
  // Чирэлтийн эхлэл. Өмнө нь эдгээр сонсогчид `document` дээр сууж байсан тул
  // дэлгэцийн ХААНА Ч доош чирэхэд (жишээ нь reel-ээ гүйлгэхэд) sheet хаагддаг
  // байв — иймд зөвхөн sheet дотор болсон хүрэлтийг л сонсоно.
  const dragStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-drag]')) return;
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    if (e.touches[0].clientY - dragStartY.current > 50) {
      dragStartY.current = null;
      onClose();
    }
  };

  const handleTouchEnd = () => {
    dragStartY.current = null;
  };

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
      {/* `flex flex-col` + доорх жагсаалтын `min-h-0` хоёр хамт байж л
          `overflow-y-auto` ажиллана — эс тэгвэл 85dvh-ээс цааш гарсан бараа
          хүрэх аргагүй болно. */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`fixed bottom-0 inset-x-0 z-50 lg:hidden flex flex-col rounded-t-[24px] bg-white transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          maxHeight: '85dvh',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}
      >
        {/* Drag handle — sheet-ийг чирж хаах гол барьц. */}
        <div className="flex justify-center pt-2 pb-4 shrink-0">
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
        <div className="px-4 pb-4 border-b border-[var(--wn-line)] shrink-0">
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
        {/* `ShowProductList` нь өөрөө flex багана дотор амьдрахаар зохиогдсон —
            таб, хайлт дээрээ хадгалагдаж, зөвхөн жагсаалт нь гүйнэ. */}
        <div className="flex flex-1 min-h-0 flex-col" data-no-drag>
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
