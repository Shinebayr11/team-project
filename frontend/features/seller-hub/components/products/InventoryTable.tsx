"use client"

import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { InventoryProduct } from '@/features/seller-hub/types';
import { EmptyRow } from '../DataCard';
import { InventoryRow } from './InventoryRow';

interface InventoryTableProps {
  products: InventoryProduct[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (product: InventoryProduct) => void;
  onAdjustStock: (id: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products, selectedIds, onToggleSelect, onToggleSelectAll, onEdit, onAdjustStock,
}) => {
  const allSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <table className="w-full text-left border-collapse min-w-[900px]">
      <thead>
        <tr className="bg-white text-[12px] font-[800] text-gray-500 uppercase tracking-wider border-b border-gray-200">
          <th className="p-4 w-12">
            <button onClick={onToggleSelectAll} aria-label="Select all" className="text-gray-400 hover:text-black">
              {allSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </button>
          </th>
          <th className="p-4">Product</th>
          <th className="p-4">SKU</th>
          <th className="p-4">Price</th>
          <th className="p-4 text-right">Available</th>
          <th className="p-4 text-right">Reserved</th>
          <th className="p-4 text-right">Sold</th>
          <th className="p-4">Status</th>
          <th className="p-4 text-right">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {products.map(product => (
          <InventoryRow
            key={product.id}
            product={product}
            selected={selectedIds.includes(product.id)}
            onToggleSelect={() => onToggleSelect(product.id)}
            onEdit={() => onEdit(product)}
            onAdjustStock={() => onAdjustStock(product.id)}
          />
        ))}

        {products.length === 0 && <EmptyRow colSpan={9} message="No products found." />}
      </tbody>
    </table>
  );
};