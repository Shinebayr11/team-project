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
  { value: 'buy_it_now', label: 'Buy It Now' },
  { value: 'auction', label: 'Auction' },
];

const control = 'w-full h-10 rounded-lg border border-gray-300 px-3 text-[14px] font-[500] text-black outline-none focus:border-black';

export const ProductPricingCard: React.FC<ProductPricingCardProps> = ({ draft, onPatch }) => (
  <Panel title="Pricing & Inventory">
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
      <label className="block text-[12px] font-[700] text-gray-500 mb-1" htmlFor="price">Price (₮) *</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-[600]">₮</span>
        <input
          id="price"
          type="number"
          min={0}
          value={draft.price}
          onChange={e => onPatch({ price: Number(e.target.value) })}
          className={`${control} pl-8`}
        />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-[12px] font-[700] text-gray-500 mb-1" htmlFor="quantity">Quantity *</label>
      <input
        id="quantity"
        type="number"
        min={0}
        value={draft.quantity}
        onChange={e => onPatch({ quantity: Number(e.target.value) })}
        className={control}
      />
    </div>

    <div className="flex items-start justify-between">
      <div>
        <div className="text-[14px] font-[700] text-black">Accept Offers</div>
        <div className="text-[12px] text-gray-500 leading-tight mt-0.5">
          Turn this on to accept offers. You can accept, counter or decline the offers.
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