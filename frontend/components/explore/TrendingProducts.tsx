"use client"

import React from 'react';
import { useNavigate } from '@/lib/router';
import { TrendingProduct } from '../../hooks/useExploreFeed';

export const TrendingProducts: React.FC<{ products: TrendingProduct[] }> = ({ products }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map(product => (
        <div
          key={`${product.seller}-${product.name}`}
          className="flex flex-col gap-2 cursor-pointer group"
          onClick={() => navigate(`/product?seller=${product.seller}&product=${encodeURIComponent(product.name)}`)}
        >
          <div className="relative w-full aspect-square bg-[var(--wn-shot)] rounded-[16px] overflow-hidden">
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[var(--wn-ink)] text-[12px] font-[600]">
              Buy Now
            </div>
          </div>
          <div>
            <h4 className="text-[14.5px] font-[600] text-[var(--wn-ink)] leading-tight group-hover:text-[var(--wn-accent)] transition-colors truncate">
              {product.name}
            </h4>
            <div className="flex items-center justify-between mt-1">
              <div className="text-[14px] font-[800] text-[var(--wn-ink)]">₮{product.price}</div>
              <div className="text-[12px] font-[600] text-[var(--wn-ink-3)] truncate max-w-[100px]">by {product.seller}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};