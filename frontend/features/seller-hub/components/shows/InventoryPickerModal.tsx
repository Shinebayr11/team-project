"use client"

import React from 'react';
import { X } from 'lucide-react';
import { InventoryProduct } from '@/features/seller-hub/types';
import { btn } from "@/features/seller-hub/components/buttons"

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
      <div className="p-5 border-b border-[var(--wn-admin-card-border)] flex items-center justify-between">
        <h2 className="text-[18px] font-[800] text-black">Шууд дамжуулалтад бараа нэмэх</h2>
        <button onClick={onClose} aria-label="Хаах" className="w-8 h-8 rounded-full bg-[var(--wn-admin-chip)] flex items-center justify-center text-[var(--wn-admin-muted)] hover:bg-[var(--wn-admin-chip-2)]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {products.length > 0 ? products.map(product => (
          <div key={product.id} className="flex items-center justify-between p-3 hover:bg-[var(--wn-admin-row-rule)] rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--wn-admin-chip)] border border-[var(--wn-admin-card-border)] shrink-0" />
              <div>
                <div className="text-[14px] font-[700] text-black">{product.name}</div>
                <div className="text-[12px] font-[500] text-[var(--wn-admin-muted)]">
                  {product.quantity} боломжтой • ₮{product.price.toLocaleString()}
                </div>
              </div>
            </div>
            <button
              onClick={() => onAdd(product.id)}
              className={btn("ink", "compact")}
            >
              Нэмэх
            </button>
          </div>
        )) : (
          <div className="p-8 text-center text-[14px] font-[500] text-[var(--wn-admin-muted)]">
            Нэмэх идэвхтэй бараа алга байна.
          </div>
        )}
      </div>
    </div>
  </div>
);