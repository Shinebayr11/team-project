"use client"

import React from 'react';
import { X } from 'lucide-react';
import { InventoryProduct } from '@/features/seller-hub/types';

interface InventoryPickerModalProps {
  products: InventoryProduct[];
  onAdd: (inventoryId: string) => void;
  onClose: () => void;
}

export const InventoryPickerModal: React.FC<InventoryPickerModalProps> = ({ products, onAdd, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

    {/* `vh` нь гар утсан дээр хөтчийн мөрийн ард хэмжигддэг тул `dvh`. */}
    <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-[600px] flex flex-col max-h-[92dvh] sm:max-h-[80dvh] shadow-xl">
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-[18px] font-[800] text-black">Add Products to Show</h2>
        <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {products.length > 0 ? products.map(product => (
          <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 shrink-0" />
              <div>
                <div className="text-[14px] font-[700] text-black">{product.name}</div>
                <div className="text-[12px] font-[500] text-gray-500">
                  {product.quantity} available • ₮{product.price.toLocaleString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => onAdd(product.id)}
              className="px-4 py-1.5 rounded-lg bg-black text-white text-[13px] font-[700] hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        )) : (
          <div className="p-8 text-center text-[14px] font-[500] text-gray-500">
            No active inventory available to add.
          </div>
        )}
      </div>
    </div>
  </div>
);