"use client"

import React from 'react';
import { Search } from 'lucide-react';
import { ReelProduct, ReelTab } from '../../types';
import { LiveDot } from '../ui/LiveDot';

interface ShowProductListProps {
  products: Record<ReelTab, ReelProduct[]>;
  activeTab: ReelTab;
  onTabChange: (tab: ReelTab) => void;
  onSelect: (product: ReelProduct) => void;
}

const TABS: { id: ReelTab; label: string }[] = [
  { id: 'buynow', label: 'Buy Now' },
  { id: 'giveaways', label: 'Giveaways' },
  { id: 'sold', label: 'Sold' },
];

const tagClass = (tag: string) => {
  if (tag === 'Live now') return 'bg-[var(--wn-live-soft)] text-[var(--wn-live)]';
  if (tag === 'Sold') return 'bg-[var(--wn-surface-3)] text-[var(--wn-ink-4)]';
  return 'bg-[var(--wn-accent-soft)] text-[var(--wn-accent)]';
};

export const ShowProductList: React.FC<ShowProductListProps> = ({
  products, activeTab, onTabChange, onSelect,
}) => (
  <>
    <div className="flex items-center px-2 pt-2 border-b border-[var(--wn-line)]">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 pb-2 pt-1 text-[12px] font-[700] border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-[var(--wn-accent)] text-[var(--wn-accent)]'
              : 'border-transparent text-[var(--wn-ink-3)] hover:text-[var(--wn-ink)]'
          }`}
        >
          {tab.label} <span className="ml-1 opacity-60 font-[500]">{products[tab.id].length}</span>
        </button>
      ))}
    </div>

    <div className="p-2 border-b border-[var(--wn-line)]">
      <div className="relative flex items-center w-full h-[32px] rounded-lg bg-[var(--wn-surface-2)] px-3">
        <Search className="w-4 h-4 text-[var(--wn-ink-4)] mr-2" />
        <input type="text" placeholder="Search items" aria-label="Search items" className="bg-transparent border-none outline-none w-full text-[12px] text-[var(--wn-ink)]" />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-2">
      {/* Ижил нэртэй бараа жагсаалтад орж болох тул нэрийг ганцаараа key болгож
          болохгүй. */}
      {products[activeTab].map((product, index) => (
        <div
          key={`${product.name}-${index}`}
          onClick={() => onSelect(product)}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--wn-surface-2)] cursor-pointer transition-colors"
        >
          <div className="w-[48px] h-[48px] rounded-lg bg-[var(--wn-shot)] shrink-0 relative overflow-hidden">
            {product.image && (
              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
            )}
            {product.live && <LiveDot className="absolute top-1 left-1 w-1.5 h-1.5 z-10" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-[600] text-[var(--wn-ink)] truncate">{product.name}</div>
            <div className="text-[12px] font-[700] text-[var(--wn-ink-2)] mt-0.5">
              {product.price === 'Free' ? 'Free' : `₮${product.price}`}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md text-[10px] font-[700] shrink-0 ${tagClass(product.tag)}`}>
            {product.tag}
          </div>
        </div>
      ))}
    </div>
  </>
);