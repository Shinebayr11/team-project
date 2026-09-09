"use client"

import React from 'react';
import { Edit2, CheckSquare, Square } from 'lucide-react';
import { InventoryProduct } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { productTone, PRODUCT_STATUS_LABELS } from '../statusTones';

interface InventoryRowProps {
  product: InventoryProduct;
  selected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onAdjustStock: () => void;
}

export const InventoryRow: React.FC<InventoryRowProps> = ({
  product, selected, onToggleSelect, onEdit, onAdjustStock,
}) => {
  const available = product.quantity - product.reservedQuantity;

  return (
    <tr className={`text-[14px] transition-colors ${selected ? 'bg-[var(--wn-admin-info-soft)]/50' : 'hover:bg-[var(--wn-admin-row-rule)]'}`}>
      <td className="p-4">
        <button
          onClick={onToggleSelect}
          aria-label={selected ? `Сонголтоос хасах: ${product.name}` : `Сонгох: ${product.name}`}
          className={`hover:text-black ${selected ? 'text-[var(--wn-admin-accent)]' : 'text-[var(--wn-admin-muted)]'}`}
        >
          {selected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>
      </td>

      <td className="p-4 font-[700] text-black">
        <div className="flex items-center gap-3">
          {/* Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо шаардахгүй. */}
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-10 h-10 rounded-lg border border-[var(--wn-admin-card-border)] object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--wn-admin-chip)] border border-[var(--wn-admin-card-border)] shrink-0" />
          )}
          <div>
            <div className="truncate max-w-[200px]">{product.name}</div>
            <div className="text-[12px] font-[500] text-[var(--wn-admin-muted)]">{product.category}</div>
          </div>
        </div>
      </td>

      <td className="p-4 font-[500] text-[var(--wn-admin-ink-2)]">{product.sku}</td>
      <td className="p-4 font-[700] text-black">₮{product.price.toLocaleString()}</td>
      <td className="p-4 text-right font-[700] text-black">{available}</td>
      <td className="p-4 text-right font-[500] text-[var(--wn-admin-muted)]">{product.reservedQuantity}</td>
      <td className="p-4 text-right font-[500] text-[var(--wn-admin-muted)]">{product.soldQuantity}</td>
      <td className="p-4"><StatusPill label={PRODUCT_STATUS_LABELS[product.status]} tone={productTone(product.status)} withDot /></td>

      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={onAdjustStock} className="px-3 py-1.5 rounded-lg bg-[var(--wn-admin-chip)] text-[12px] font-[700] text-black hover:bg-[var(--wn-admin-chip-2)] transition-colors">
            Нөөц
          </button>
          <button
            onClick={onEdit}
            aria-label={`Засах: ${product.name}`}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--wn-admin-muted)] hover:bg-[var(--wn-admin-nav-hover)] hover:text-black transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};