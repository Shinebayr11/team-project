"use client"

import React from 'react';
import { Package } from 'lucide-react';
import { useNavigate } from '@/lib/router';
import { TrendingProduct } from '../../hooks/useExploreFeed';

const sellerNameOf = (product: TrendingProduct) =>
  product.seller?.shop_name || product.seller?.display_name || 'Худалдагч';

/**
 * Эрэлттэй бараа. Эрэмбэ нь хиймэл биш — дуудлага худалдаагаар хэдэн удаа
 * зарагдсанаар нь сервер тооцож өгдөг.
 */
export const TrendingProducts: React.FC<{ products: TrendingProduct[] }> = ({ products }) => {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--wn-line-3)] py-12 text-center">
        <Package className="mx-auto size-6 text-[var(--wn-ink-4)]" />
        <p className="mt-2 text-[14px] font-[600] text-[var(--wn-ink-3)]">
          Одоогоор зарагдсан бараа алга байна.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {products.map(product => {
        const seller = sellerNameOf(product);

        return (
          <div
            key={product._id}
            className="group flex cursor-pointer flex-col gap-2"
            // Барааны дэлгэрэнгүй хуудас одоогоор бодит бараа дэмждэггүй тул
            // худалдагчийн дэлгүүр рүү аваачна.
            onClick={() =>
              navigate(`/shop?seller=${product.seller?._id ?? encodeURIComponent(seller)}`)
            }
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-[var(--wn-shot)]">
              {product.images?.[0] ? (
                // Vercel Blob-ийн хаяг тул next/image-ийн домэйн тохиргоо шаардахгүй.
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Package className="size-6 text-[var(--wn-ink-4)]" />
                </div>
              )}

              <div className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-[600] text-[var(--wn-ink)] backdrop-blur-md">
                {product.soldCount} удаа зарагдсан
              </div>
            </div>

            <div>
              <h4 className="truncate text-[14.5px] leading-tight font-[600] text-[var(--wn-ink)] transition-colors group-hover:text-[var(--wn-accent)]">
                {product.name}
              </h4>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="text-[14px] font-[800] text-[var(--wn-ink)]">
                  ₮{(product.price_coins ?? 0).toLocaleString()}
                </div>
                <div className="max-w-[100px] truncate text-[12px] font-[600] text-[var(--wn-ink-3)]">
                  {seller}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
