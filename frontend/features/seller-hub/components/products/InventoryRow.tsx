"use client"

import React from 'react';
import { Edit2, CheckSquare, Square } from 'lucide-react';
import { InventoryProduct } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { productTone } from '../statusTones';

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
    <tr className={`text-[14px] transition-colors ${selected ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
      <td className="p-4">
        <button
          onClick={onToggleSelect}
          aria-label={selected ? `Deselect ${product.name}` : `Select ${product.name}`}
          className={`hover:text-black ${selected ? 'text-blue-600' : 'text-gray-400'}`}
        >
          {selected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        </button>
      </td>

      <td className="p-4 font-[700] text-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 shrink-0" />
          <div>
            <div className="truncate max-w-[200px]">{product.name}</div>
            <div className="text-[12px] font-[500] text-gray-500">{product.category}</div>
          </div>
        </div>
      </td>

      <td className="p-4 font-[500] text-gray-600">{product.sku}</td>
      <td className="p-4 font-[700] text-black">₮{product.price.toLocaleString()}</td>
      <td className="p-4 text-right font-[700] text-black">{available}</td>
      <td className="p-4 text-right font-[500] text-gray-500">{product.reservedQuantity}</td>
      <td className="p-4 text-right font-[500] text-gray-500">{product.soldQuantity}</td>
      <td className="p-4"><StatusPill label={product.status} tone={productTone(product.status)} withDot /></td>

      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={onAdjustStock} className="px-3 py-1.5 rounded-lg bg-gray-100 text-[12px] font-[700] text-black hover:bg-gray-200 transition-colors">
            Stock
          </button>
          <button
            onClick={onEdit}
            aria-label={`Edit ${product.name}`}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};