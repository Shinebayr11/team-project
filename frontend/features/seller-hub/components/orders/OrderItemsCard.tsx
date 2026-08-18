"use client"

import React from 'react';
import { SellerOrder } from '@/features/seller-hub/types';
import { Panel } from '../DataCard';

export const OrderItemsCard: React.FC<{ items: SellerOrder['items'] }> = ({ items }) => (
  <Panel title="Order Items">
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={`${item.productId}-${i}`} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-[700] text-black truncate">{item.name}</div>
            <div className="text-[12px] font-[500] text-gray-500 mt-0.5">SKU: {item.sku}</div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-[700] text-black">₮{item.price.toLocaleString()}</div>
            <div className="text-[12px] font-[500] text-gray-500 mt-0.5">Qty: {item.qty}</div>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);