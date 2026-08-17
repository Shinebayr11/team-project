"use client"

import React from 'react';
import { useNavigate } from '@/lib/router';
import { SellerProduct } from '../../types';
import { LiveDot } from '../ui/LiveDot';

interface ProductCardProps {
  product: SellerProduct;
  seller: string;
}

const tagClass = (tag: SellerProduct['tag']) => {
  if (tag === 'Live now') return 'bg-black/40 backdrop-blur-md text-white';
  if (tag === 'Giveaway') return 'bg-[var(--wn-accent-soft)] text-[var(--wn-accent)]';
  return 'bg-white/90 backdrop-blur-md text-[var(--wn-ink)]';
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, seller }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col gap-2 cursor-pointer group"
      onClick={() => navigate(`/product?seller=${seller}&product=${encodeURIComponent(product.name)}`)}
    >
      <div className="relative w-full aspect-square bg-[var(--wn-shot)] rounded-[16px] overflow-hidden">
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[12px] font-[600] flex items-center gap-1.5 ${tagClass(product.tag)}`}>
          {product.tag === 'Live now' && <LiveDot />}
          {product.tag}
        </div>
        {product.tag === 'Sold' && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[var(--wn-ink-3)] text-[12px] font-[600]">
            Sold
          </div>
        )}
      </div>
      <div>
        <h4 className="text-[14.5px] font-[600] text-[var(--wn-ink)] leading-tight group-hover:text-[var(--wn-accent)] transition-colors">{product.name}</h4>
        <div className="text-[14px] font-[700] text-[var(--wn-ink-2)] mt-0.5">
          {product.price === 'Free' ? 'Free' : `₮${product.price}`}
        </div>
      </div>
    </div>
  );
};