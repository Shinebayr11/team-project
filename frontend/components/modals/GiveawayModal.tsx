"use client"

import React from 'react';
import { SellerProduct } from '../../types';
import { useStore } from '../../store';
import { Modal } from '../ui/Modal';

export interface GiveawayModalData {
  product: SellerProduct;
}

export const GiveawayModal: React.FC<{ data: GiveawayModalData }> = ({ data }) => {
  const { closeModal, addToast } = useStore();

  const handleEnter = () => {
    closeModal();
    addToast("You're entered in the giveaway!");
  };

  return (
    <Modal title="Enter Giveaway" onClose={closeModal}>
      <div className="px-6 py-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--wn-shot)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-[700] text-[var(--wn-ink)] truncate">{data.product.name}</div>
            <div className="text-[14px] font-[600] text-[var(--wn-accent)] mt-0.5">Free entry</div>
          </div>
        </div>
        <button
          onClick={handleEnter}
          className="w-full h-[52px] rounded-xl bg-[var(--wn-accent)] text-white text-[16px] font-[800] hover:bg-[var(--wn-accent-hover)] transition-colors"
        >
          Enter giveaway
        </button>
      </div>
    </Modal>
  );
};