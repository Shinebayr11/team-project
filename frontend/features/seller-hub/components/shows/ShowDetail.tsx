"use client"

import React, { useState } from 'react';
import { SellerShow, InventoryProduct } from '@/features/seller-hub/types';
import { PageHeader } from '../PageHeader';
import { ShowProductsCard } from './ShowProductsCard';
import { ShowStatusPanel } from './ShowStatusPanel';
import { ShowStatsPanel } from './ShowStatsPanel';
import { InventoryPickerModal } from './InventoryPickerModal';

interface ShowDetailProps {
  show: SellerShow;
  availableInventory: InventoryProduct[];
  onBack: () => void;
  onChangeStatus: (status: SellerShow['status']) => void;
  onAddProduct: (inventoryId: string) => void;
  onRemoveProduct: (showProductId: string) => void;
}

export const ShowDetail: React.FC<ShowDetailProps> = ({
  show, availableInventory, onBack, onChangeStatus, onAddProduct, onRemoveProduct,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const showsStats = show.status === 'COMPLETED' || show.status === 'LIVE';

  return (
    <>
      <PageHeader
        title={show.title}
        description={`${new Date(show.scheduledAt).toLocaleString()} • ${show.category}`}
        onBack={onBack}
      />

      <div className="flex gap-6 max-w-[1100px]">
        <div className="flex-1 flex flex-col gap-6">
          <ShowProductsCard
            products={show.products}
            onAdd={() => setPickerOpen(true)}
            onRemove={onRemoveProduct}
          />
        </div>

        <div className="w-[340px] shrink-0 flex flex-col gap-6">
          <ShowStatusPanel show={show} onChangeStatus={onChangeStatus} />
          {showsStats && <ShowStatsPanel stats={show.stats} />}
        </div>
      </div>

      {pickerOpen && (
        <InventoryPickerModal
          products={availableInventory}
          onAdd={onAddProduct}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
};