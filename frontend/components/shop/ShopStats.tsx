"use client"

import React from 'react';
import { ShopSeller } from '@/hooks/useSellerShop';

const Dot = () => <div className="size-1 rounded-full bg-[var(--wn-line-3)]" />;

/**
 * Дэлгүүрийн үзүүлэлт. Зөвхөн БОДИТООР байгаа тоо: дагагч, бараа, нээсэн огноо.
 * Үнэлгээ, борлуулалтын тоо одоогоор сервер дээр байхгүй тул харуулахгүй.
 */
export const ShopStats: React.FC<{ seller: ShopSeller; productCount: number }> = ({
  seller,
  productCount,
}) => (
  <div className="mb-8 max-w-[800px] px-4 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] sm:gap-6">
      <div className="flex items-center gap-1.5">
        <span className="font-[700] text-[var(--wn-ink)]">{seller.followersCount ?? 0}</span>
        <span className="text-[var(--wn-ink-3)]">дагагч</span>
      </div>
      <Dot />
      <div className="flex items-center gap-1.5">
        <span className="font-[700] text-[var(--wn-ink)]">{productCount}</span>
        <span className="text-[var(--wn-ink-3)]">бараа</span>
      </div>
      {seller.since && (
        <>
          <Dot />
          <span className="text-[var(--wn-ink-3)]">
            {new Date(seller.since).getFullYear()} оноос хойш
          </span>
        </>
      )}
    </div>
  </div>
);
