"use client"

import React from 'react';
import { InventoryProduct } from '@/features/seller-hub/types';
import { CONTROL } from "@/features/seller-hub/components/FormField"
import { Toggle } from '@/features/seller-hub/components/Toggle';
import { Panel } from '../DataCard';
import { ProductDraft } from './productDraft';

interface ProductPricingCardProps {
  draft: ProductDraft;
  onPatch: (updates: Partial<ProductDraft>) => void;
}

const LISTING_TYPES: { value: InventoryProduct['listingType']; label: string }[] = [
  { value: 'buy_it_now', label: 'Шууд худалдах' },
  { value: 'auction', label: 'Дуудлага худалдаа' },
];

/**
 * Тоон талбарууд текстээрээ хадгалагдана. Шууд `value={draft.price}` өгвөл
 * анхны 0 арилахгүй тул хэрэглэгч "0500" гэж бичих эрсдэлтэй байв — хоосон
 * тэмдэгт мөрийг зөвшөөрч, хадгалахдаа тоо болгож хөрвүүлнэ.
 */
export const ProductPricingCard: React.FC<ProductPricingCardProps> = ({ draft, onPatch }) => {
  const [priceText, setPriceText] = React.useState(draft.price ? String(draft.price) : '');
  const [quantityText, setQuantityText] = React.useState(
    draft.quantity ? String(draft.quantity) : ''
  );

  return (
  <Panel title="Үнэ, нөөц">
    <div className="flex p-1 bg-[var(--wn-admin-chip)] rounded-xl mb-4">
      {LISTING_TYPES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onPatch({ listingType: value })}
          className={`flex-1 py-1.5 rounded-lg text-[13px] font-[700] transition-colors ${
            draft.listingType === value ? 'bg-[var(--wn-admin-ink)] text-white shadow-sm' : 'text-[var(--wn-admin-ink-2)]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    <div className="mb-4">
      <label className="block text-[12px] font-[700] text-[var(--wn-admin-muted)] mb-1" htmlFor="price">Үнэ (₮) *</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--wn-admin-muted)] font-[600]">₮</span>
        <input
          id="price"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="0"
          value={priceText}
          onChange={e => {
            setPriceText(e.target.value);
            onPatch({ price: Number(e.target.value) || 0 });
          }}
          className={`${CONTROL} pl-8`}
        />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-[12px] font-[700] text-[var(--wn-admin-muted)] mb-1" htmlFor="quantity">Тоо ширхэг *</label>
      <input
        id="quantity"
        type="number"
        min={0}
        inputMode="numeric"
        placeholder="0"
        value={quantityText}
        onChange={e => {
          setQuantityText(e.target.value);
          onPatch({ quantity: Number(e.target.value) || 0 });
        }}
        className={CONTROL}
      />
    </div>

    <div className="flex items-start justify-between">
      <div>
        <div className="text-[14px] font-[700] text-black">Санал хүлээн авах</div>
        <div className="text-[12px] text-[var(--wn-admin-muted)] leading-tight mt-0.5">
          Үүнийг асаавал худалдан авагчийн саналыг хүлээн авах, эсрэг санал өгөх эсвэл татгалзах боломжтой болно.
        </div>
      </div>
      <Toggle
        checked={draft.acceptOffers}
        label="Санал хүлээн авах"
        onChange={() => onPatch({ acceptOffers: !draft.acceptOffers })}
      />
    </div>
  </Panel>
  );
};