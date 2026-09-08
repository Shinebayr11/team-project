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
    title="Шууд дамжуулалтын бараа"
    action={
      <button onClick={onAdd} className="px-4 py-1.5 rounded-lg bg-[var(--wn-admin-chip)] text-[13px] font-[700] text-black hover:bg-[var(--wn-admin-chip-2)] transition-colors flex items-center gap-2">
        <Plus className="w-4 h-4" /> Бараа нэмэх
      </button>
    }
  >
    {products.length > 0 ? (
      <div className="flex flex-col gap-3">
        {products.map((product, i) => (
          <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl border border-[var(--wn-admin-card-border)] bg-[var(--wn-admin-row-rule)]">
            <div className="w-6 text-center text-[13px] font-[700] text-[var(--wn-admin-muted)]">{i + 1}</div>
            <div className="w-10 h-10 rounded-lg bg-white border border-[var(--wn-admin-card-border)] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-[700] text-black truncate">{product.name}</div>
              <div className="text-[12px] font-[500] text-[var(--wn-admin-muted)] mt-0.5">
                {product.type === 'auction' ? 'Дуудлага худалдаа' : 'Шууд худалдах'} • ₮{product.price.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => onRemove(product.id)}
              aria-label={`Хасах: ${product.name}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--wn-admin-muted)] hover:bg-white hover:text-[var(--wn-admin-danger)] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-8 text-center text-[14px] font-[500] text-[var(--wn-admin-muted)] border border-dashed border-[var(--wn-ink-4)] rounded-xl">
        Энэ шууд дамжуулалтад бараа хараахан нэмэгдээгүй байна.
      </div>
    )}
  </Panel>
);