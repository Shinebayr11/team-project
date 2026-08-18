"use client"

import React from 'react';
import { useNavigate } from '@/lib/router';
import { ShoppingBag, AlertTriangle, AlertCircle } from 'lucide-react';
import { ActionCard } from './ActionCard';

interface ActionRequiredProps {
  pendingOrders: number;
  lowStockCount: number;
  showBlocker?: string;
}

export const ActionRequired: React.FC<ActionRequiredProps> = ({
  pendingOrders, lowStockCount, showBlocker,
}) => {
  const navigate = useNavigate();
  const isClear = pendingOrders === 0 && lowStockCount === 0 && !showBlocker;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[18px] font-[800] text-black">Action Required</h2>

      {pendingOrders > 0 && (
        <ActionCard
          icon={ShoppingBag}
          tone="red"
          title={`${pendingOrders} orders need fulfillment`}
          description="Process and ship pending orders."
          onClick={() => navigate('/admin/orders')}
        />
      )}

      {lowStockCount > 0 && (
        <ActionCard
          icon={AlertTriangle}
          tone="amber"
          title={`${lowStockCount} items are low in stock`}
          description="Update inventory to prevent stockouts."
          onClick={() => navigate('/admin/products')}
        />
      )}

      {showBlocker && (
        <ActionCard
          icon={AlertCircle}
          tone="red"
          title="Next show is not ready"
          description={showBlocker}
          onClick={() => navigate('/admin/shows')}
        />
      )}

      {isClear && (
        <div className="p-8 rounded-2xl border border-gray-200 bg-white text-center text-gray-500 font-[500]">
          You're all caught up! No actions required.
        </div>
      )}
    </div>
  );
};