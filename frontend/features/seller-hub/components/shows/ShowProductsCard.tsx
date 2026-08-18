"use client"

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ShowProduct } from '@/features/seller-hub/types';
import { Panel } from '../DataCard';

interface ShowProductsCardProps {
  products: ShowProduct[];
  onAdd: () => void;
  onRemove: (showProductId: string) => void;
}

export const ShowProductsCard: React.FC<ShowProductsCardProps> = ({ products, onAdd, onRemove }) => (
  <Panel
    title="Show Products"
    action={
      <button onClick={onAdd} className="px-4 py-1.5 rounded-lg bg-gray-100 text-[13px] font-[700] text-black hover:bg-gray-200 transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add Product
      </button>
    }
  >
    {products.length > 0 ? (
      <div className="flex flex-col gap-3">
        {products.map((product, i) => (
          <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 bg-gray-50">
            <div className="w-6 text-center text-[13px] font-[700] text-gray-400">{i + 1}</div>
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-[700] text-black truncate">{product.name}</div>
              <div className="text-[12px] font-[500] text-gray-500 mt-0.5">
                {product.type === 'auction' ? 'Auction' : 'Buy It Now'} • ₮{product.price.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => onRemove(product.id)}
              aria-label={`Remove ${product.name}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-8 text-center text-[14px] font-[500] text-gray-500 border border-dashed border-gray-300 rounded-xl">
        No products added to this show yet.
      </div>
    )}
  </Panel>
);