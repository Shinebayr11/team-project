"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useDisplayName } from '@/hooks/useDisplayName';
import { useApiClient } from '@/hooks/useApiClient';
import { useFollow, followedSellerName } from '@/hooks/useFollow';
import { useNavigate } from '@/lib/router';
import { SellerRow } from './SellerRow';

interface ApiSeller {
  _id: string;
  display_name?: string;
  shop_name?: string;
  avatar_url?: string;
}

const RECOMMENDED_LIMIT = 6;

const Divider = () => <div className="h-px bg-[var(--wn-line)] w-full mb-4" />;

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[12px] font-[800] text-[var(--wn-ink-4)] uppercase tracking-wider mb-3 px-2">{children}</div>
);

/**
 * Нүүрний хажуугийн самбар — бодит худалдагчид.
 *
 * Өмнө нь `data/SELLERS` жишээ өгөгдлөөс зурдаг байсан тул байхгүй хүмүүсийг
 * "санал болгож", дарахад хоосон дэлгүүр рүү аваачдаг байв.
 */
export const HomeSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { callApi } = useApiClient();
  const { displayName } = useDisplayName();
  const { sellers: followed } = useFollow();

  const [sellers, setSellers] = useState<ApiSeller[]>([]);

  const load = useCallback(async () => {
    const { data } = await callApi<{ data: ApiSeller[] }>('/api/seller');
    setSellers(data);
  }, [callApi]);

  useEffect(() => {
    let cancelled = false;
    load().catch(error => {
      if (!cancelled) console.error('Худалдагчдыг уншиж чадсангүй:', error);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  // Дагасан хүмүүсээ "санал болгох" нь утгагүй тул хасна.
  const followedIds = new Set(followed.map(seller => String(seller._id)));
  const recommended = sellers
    .filter(seller => !followedIds.has(String(seller._id)))
    .slice(0, RECOMMENDED_LIMIT);

  const goToShop = (id: string) => navigate(`/shop?seller=${id}`);

  return (
    <aside className="hidden w-[236px] shrink-0 flex-col sticky top-[100px] h-[calc(100vh-100px)] overflow-y-auto pb-8 lg:flex">
      <div className="mb-6">
        <div className="text-[11px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase mb-1">Тавтай морил</div>
        <div className="text-[18px] font-[800] text-[var(--wn-ink)]">{displayName}</div>
      </div>
      <Divider />

      {recommended.length > 0 && (
        <>
          <SectionTitle>Санал болгох сувгууд</SectionTitle>
          <div className="flex flex-col gap-1 mb-6">
            {recommended.map(seller => (
              <SellerRow
                key={seller._id}
                name={seller.shop_name || seller.display_name || 'Худалдагч'}
                avatarUrl={seller.avatar_url}
                onClick={() => goToShop(seller._id)}
              />
            ))}
          </div>
        </>
      )}

      {followed.length > 0 && (
        <>
          <Divider />
          <SectionTitle>Дагаж буй</SectionTitle>
          <div className="flex flex-col gap-1">
            {followed.map(seller => (
              <SellerRow
                key={seller._id}
                name={followedSellerName(seller)}
                avatarUrl={seller.avatar_url}
                onClick={() => goToShop(seller._id)}
              />
            ))}
          </div>
        </>
      )}
    </aside>
  );
};
