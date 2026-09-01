"use client"

import React from 'react';
import { Link } from '@/lib/router';
import { Truck, Gift } from 'lucide-react';
import { SellerProduct, SellerRecord } from '../../types';
import { Avatar } from '../ui/Avatar';
import { QuantityStepper } from './QuantityStepper';
import { ProductActions } from './ProductActions';

interface ProductBuyPanelProps {
  seller: SellerRecord;
  product: SellerProduct;
  description: string;
  qty: number;
  onQtyChange: (qty: number) => void;
  onBuy: () => void;
  onAddToCart: () => void;
  onWatchLive: () => void;
  onEnterGiveaway: () => void;
}

export const ProductBuyPanel: React.FC<ProductBuyPanelProps> = ({
  seller, product, description, qty, onQtyChange, ...actions
}) => (
  <div className="w-full flex flex-col lg:w-[420px] lg:shrink-0">
    <Link to={`/shop?seller=${seller.slug}`} className="flex items-center gap-3 mb-6 group">
      <Avatar name={seller.slug} initial={seller.initial} tint={seller.tint} />
      <div>
        <div className="font-[700] text-[15px] text-[var(--wn-ink)] group-hover:text-[var(--wn-accent)] transition-colors">{seller.slug}</div>
        <div className="text-[12px] font-[600] text-[var(--wn-ink-4)] uppercase tracking-wider">{seller.cat1}</div>
      </div>
    </Link>

    <h1 className="text-[25px] font-[800] text-[var(--wn-ink)] leading-tight mb-4">{product.name}</h1>

    <div className="flex items-center gap-3 mb-6">
      {product.price !== 'Free' && (
        <div className="w-8 h-8 rounded-full bg-[var(--wn-accent)] flex items-center justify-center text-white font-[700] text-[14px]">₮</div>
      )}
      <span className="text-[32px] font-[800] text-[var(--wn-ink)] tracking-tight">{product.price}</span>
    </div>

    {product.tag === 'Buy now' && (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--wn-surface-2)] text-[14px] font-[600] text-[var(--wn-ink-2)] mb-6">
        <Truck className="w-5 h-5 text-[var(--wn-ink-3)]" /> Ships in 1–2 days · arrives in 5–9 days
      </div>
    )}
    {product.tag === 'Giveaway' && (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--wn-accent-soft)] text-[14px] font-[600] text-[var(--wn-accent)] mb-6">
        <Gift className="w-5 h-5" /> Entries close when the show ends
      </div>
    )}

    {product.tag === 'Buy now' && <QuantityStepper qty={qty} onChange={onQtyChange} />}

    <ProductActions product={product} qty={qty} {...actions} />

    <div className="h-px bg-[var(--wn-line)] w-full mb-6" />
    <p className="text-[15px] text-[var(--wn-ink-2)] leading-relaxed">{description}</p>
  </div>
);