"use client"

import React from 'react';
import { InventoryProduct } from '@/features/seller-hub/types';
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

const control = 'w-full h-10 rounded-lg border border-gray-300 px-3 text-[14px] font-[500] text-black outline-none focus:border-black';

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
    <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
      {LISTING_TYPES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onPatch({ listingType: value })}
          className={`flex-1 py-1.5 rounded-lg text-[13px] font-[700] transition-colors ${
            draft.listingType === value ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    <div className="mb-4">
      <label className="block text-[12px] font-[700] text-gray-500 mb-1" htmlFor="price">Үнэ (₮) *</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-[600]">₮</span>
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
          className={`${control} pl-8`}
        />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-[12px] font-[700] text-gray-500 mb-1" htmlFor="quantity">Тоо ширхэг *</label>
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
        className={control}
      />
    </div>

    <div className="flex items-start justify-between">
      <div>
        <div className="text-[14px] font-[700] text-black">Санал хүлээн авах</div>
        <div className="text-[12px] text-gray-500 leading-tight mt-0.5">
          Үүнийг асаавал худалдан авагчийн саналыг хүлээн авах, эсрэг санал өгөх эсвэл татгалзах боломжтой болно.
        </div>
      </div>
      <button
        onClick={() => onPatch({ acceptOffers: !draft.acceptOffers })}
        aria-pressed={draft.acceptOffers}
        className={`w-10 h-6 rounded-full relative shrink-0 transition-colors ${draft.acceptOffers ? 'bg-[#34C759]' : 'bg-gray-300'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${draft.acceptOffers ? 'right-1' : 'left-1'}`} />
      </button>
    </div>
  </Panel>
  );
};