"use client"

import React from 'react';
import { useNavigate } from '@/lib/router';
import { ShoppingBag, AlertTriangle } from 'lucide-react';
import { ActionCard } from './ActionCard';

interface ActionRequiredProps {
  /** Зарагдсан ч ялагчтай нь хараахан холбогдоогүй лотууд. */
  pendingHandover: number;
  lowStockCount: number;
}

export const ActionRequired: React.FC<ActionRequiredProps> = ({
  pendingHandover, lowStockCount,
}) => {
  const navigate = useNavigate();
  const isClear = pendingHandover === 0 && lowStockCount === 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[18px] font-[800] text-black">Анхаарал шаардлагатай</h2>

      {pendingHandover > 0 && (
        <ActionCard
          icon={ShoppingBag}
          tone="red"
          title={`${pendingHandover} лот хүргэлт хүлээж байна`}
          description="Ялагчтай холбогдож хүргэлт, төлбөрөө тохирно уу."
          onClick={() => navigate('/seller/orders')}
        />
      )}

      {lowStockCount > 0 && (
        <ActionCard
          icon={AlertTriangle}
          tone="amber"
          title={`${lowStockCount} барааны нөөц багассан байна`}
          description="Дуусахаас сэргийлж нөөцөө шинэчилнэ үү."
          onClick={() => navigate('/seller/products')}
        />
      )}

      {isClear && (
        <div className="p-8 rounded-2xl border border-gray-200 bg-white text-center text-gray-500 font-[500]">
          Бүх зүйл бэлэн байна! Анхаарах зүйл алга.
        </div>
      )}
    </div>
  );
};