"use client"

import React from 'react';
import { TopProduct } from '@/features/seller-hub/hooks/useSellerAnalytics';
import { AnalyticsTableCard } from './AnalyticsTableCard';

interface TopProductsTableProps {
  products: TopProduct[];
  grossSales: number;
  onViewInventory: () => void;
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({
  products, grossSales, onViewInventory,
}) => (
  <AnalyticsTableCard
    title="Top Products"
    actionLabel="View Inventory"
    onAction={onViewInventory}
    headers={['Product', 'Sold', 'Revenue']}
    isEmpty={products.length === 0}
  >
    {products.map(product => (
      <tr key={product.productId} className="text-[14px] hover:bg-gray-50 transition-colors cursor-pointer" onClick={onViewInventory}>
        <td className="p-4 font-[700] text-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 shrink-0" />
            <div className="truncate max-w-[180px]">{product.name}</div>
          </div>
        </td>
        <td className="p-4 text-right font-[600] text-gray-600">{product.sold}</td>
        <td className="p-4 text-right font-[800] text-black">
          <div>₮{product.revenue.toLocaleString()}</div>
          <div className="text-[11px] font-[600] text-gray-400 mt-0.5">
            {grossSales > 0 ? Math.round((product.revenue / grossSales) * 100) : 0}% of total
          </div>
        </td>
      </tr>
    ))}
  </AnalyticsTableCard>
);