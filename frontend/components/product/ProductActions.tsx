"use client"

import React from 'react';
import { SellerProduct } from '../../types';
import { parsePrice } from '../../store';

interface ProductActionsProps {
  product: SellerProduct;
  qty: number;
  onBuy: () => void;
  onAddToCart: () => void;
  onWatchLive: () => void;
  onEnterGiveaway: () => void;
}

const primary = 'w-full h-[52px] rounded-xl text-white text-[16px] font-[800] transition-colors';

export const ProductActions: React.FC<ProductActionsProps> = ({
  product, qty, onBuy, onAddToCart, onWatchLive, onEnterGiveaway,
}) => (
  <div className="flex flex-col gap-3 mb-8">
    {product.tag === 'Buy now' && (
      <>
        <button onClick={onBuy} className={`${primary} bg-[var(--wn-accent)] hover:bg-[var(--wn-accent-hover)]`}>
          Buy now — ₮{(parsePrice(product.price) * qty).toLocaleString()}
        </button>
        <button
          onClick={onAddToCart}
          className="w-full h-[52px] rounded-xl border-2 border-[var(--wn-line-2)] text-[var(--wn-ink)] text-[16px] font-[800] hover:bg-[var(--wn-surface-2)] transition-colors"
        >
          Add to cart
        </button>
      </>
    )}

    {product.tag === 'Live now' && (
      <button onClick={onWatchLive} className={`${primary} bg-[var(--wn-live)] hover:bg-[#D03D42]`}>
        Watch live now
      </button>
    )}

    {product.tag === 'Giveaway' && (
      <button onClick={onEnterGiveaway} className={`${primary} bg-[var(--wn-accent)] hover:bg-[var(--wn-accent-hover)]`}>
        Enter giveaway
      </button>
    )}

    {product.tag === 'Sold' && (
      <button disabled className="w-full h-[52px] rounded-xl bg-[var(--wn-surface-2)] text-[var(--wn-ink-4)] text-[16px] font-[800] cursor-not-allowed">
        Sold
      </button>
    )}
  </div>
);