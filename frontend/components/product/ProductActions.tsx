"use client"

import React from 'react';

interface ProductActionsProps {
  price: number;
  qty: number;
  soldOut: boolean;
  onBuy: () => void;
  onAddToCart: () => void;
}

const primary = 'w-full h-[52px] rounded-xl text-white text-[16px] font-[800] transition-colors';

export const ProductActions: React.FC<ProductActionsProps> = ({
  price, qty, soldOut, onBuy, onAddToCart,
}) => (
  <div className="mb-8 flex flex-col gap-3">
    {soldOut ? (
      <button
        disabled
        className="h-[52px] w-full cursor-not-allowed rounded-xl bg-[var(--wn-surface-2)] text-[16px] font-[800] text-[var(--wn-ink-4)]"
      >
        Дууссан
      </button>
    ) : (
      <>
        <button
          onClick={onBuy}
          className={`${primary} bg-[var(--wn-accent)] hover:bg-[var(--wn-accent-hover)]`}
        >
          Худалдаж авах — ₮{(price * qty).toLocaleString()}
        </button>
        <button
          onClick={onAddToCart}
          className="h-[52px] w-full rounded-xl border-2 border-[var(--wn-line-2)] text-[16px] font-[800] text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-accent-wash)]"
        >
          Сагсанд нэмэх
        </button>
      </>
    )}
  </div>
);
