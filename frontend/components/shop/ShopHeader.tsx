"use client"

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ShopSeller, shopName } from '@/hooks/useSellerShop';

interface ShopHeaderProps {
  seller: ShopSeller;
  following: boolean;
  followPending: boolean;
  onToggleFollow: () => void;
  onMessage: () => void;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  seller, following, followPending, onToggleFollow, onMessage,
}) => {
  const name = shopName(seller);

  return (
    <>
      <div className="h-[200px] w-full rounded-b-[20px] bg-gradient-to-br from-[var(--wn-accent-soft)] to-[var(--wn-surface-3)]" />

      {/* Аватар + нэр + товчнууд 320px дээр нэг мөрөнд багтахгүй тул
          sm-ээс доош хоёр давхар болно. */}
      <div className="relative z-10 -mt-10 mb-8 flex flex-col items-start gap-4 px-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-end gap-4 sm:gap-5">
          {seller.avatar_url ? (
            // Clerk/Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо шаардахгүй.
            <img
              src={seller.avatar_url}
              alt={name}
              className="size-20 shrink-0 rounded-full border-[5px] border-[var(--wn-page)] object-cover sm:size-[104px]"
            />
          ) : (
            <div className="shrink-0 rounded-full border-[5px] border-[var(--wn-page)]">
              <Avatar name={name} size={94} tint="var(--wn-accent-soft)" />
            </div>
          )}

          <div className="min-w-0 pb-2">
            <h1 className="truncate text-[25px] leading-tight font-[800] text-[var(--wn-ink)]">
              {name}
            </h1>
            <div className="mt-1 text-[12px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase">
              {seller.category ?? 'Дэлгүүр'}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 pb-2 sm:w-auto sm:gap-3">
          <button
            onClick={onMessage}
            aria-label="Худалдагч руу зурвас бичих"
            className="flex size-[40px] items-center justify-center rounded-full border border-[var(--wn-line)] bg-white text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-surface-2)]"
          >
            <MessageCircle className="size-5" />
          </button>
          <button
            onClick={onToggleFollow}
            disabled={followPending}
            className={`h-[40px] rounded-full px-6 text-[14.5px] font-[700] transition-colors disabled:opacity-60 ${
              following
                ? 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)]'
                : 'bg-[var(--wn-ink)] text-white hover:bg-[var(--wn-ink-2)]'
            }`}
          >
            {following ? 'Дагаж байна' : 'Дагах'}
          </button>
        </div>
      </div>
    </>
  );
};
