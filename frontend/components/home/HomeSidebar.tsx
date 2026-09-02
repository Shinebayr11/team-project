"use client"

import React from 'react';
import { useDisplayName } from '@/hooks/useDisplayName';
import { useNavigate } from '@/lib/router';
import { SELLERS } from '../../data';
import { SellerRow } from './SellerRow';

const Divider = () => <div className="h-px bg-[var(--wn-line)] w-full mb-4" />;

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[12px] font-[800] text-[var(--wn-ink-4)] uppercase tracking-wider mb-3 px-2">{children}</div>
);

export const HomeSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { displayName } = useDisplayName();
  const sellers = Object.values(SELLERS);
  const recommended = sellers.slice(0, 6);
  const following = sellers.slice(6, 10);

  const goToShop = (slug: string) => navigate(`/shop?seller=${slug}`);

  return (
    <aside className="hidden w-[236px] shrink-0 flex-col sticky top-[100px] h-[calc(100vh-100px)] overflow-y-auto pb-8 lg:flex">
      <div className="mb-6">
        <div className="text-[11px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase mb-1">Welcome back</div>
        <div className="text-[18px] font-[800] text-[var(--wn-ink)]">{displayName}</div>
      </div>
      <Divider />

      <SectionTitle>Recommended Channels</SectionTitle>
      <div className="flex flex-col gap-1 mb-6">
        {recommended.map(seller => (
          <SellerRow key={seller.slug} seller={seller} onClick={() => goToShop(seller.slug)} />
        ))}
      </div>

      <Divider />

      <SectionTitle>Following</SectionTitle>
      <div className="flex flex-col gap-1">
        {following.map(seller => (
          <SellerRow key={seller.slug} seller={seller} onClick={() => goToShop(seller.slug)} forceOffline />
        ))}
      </div>
    </aside>
  );
};