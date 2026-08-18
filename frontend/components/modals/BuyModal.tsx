"use client"

import React from 'react';
import { SellerProduct } from '../../types';
import { useStore, parsePrice } from '../../store';
import { Modal } from '../ui/Modal';
import { BalanceSummary } from './BalanceSummary';
import { ModalActionButton } from './ModalActionButton';

export interface BuyModalData {
  product: SellerProduct;
  seller: string;
  qty: number;
}

export const BuyModal: React.FC<{ data: BuyModalData }> = ({ data }) => {
  const { closeModal, credits, buy, addToast } = useStore();
  const { product, seller, qty } = data;

  const total = parsePrice(product.price) * qty;
  const balance = credits();

  const handleBuy = () => {
    if (!buy({ title: product.name, seller, price: product.price, qty })) return;
    closeModal();
    addToast('Order confirmed');
  };

  return (
    <Modal title="Confirm purchase" onClose={closeModal}>
      <div className="px-6 py-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--wn-shot)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-[700] text-[var(--wn-ink)] truncate">{product.name}</div>
            <div className="text-[14px] font-[600] text-[var(--wn-ink-3)] mt-0.5">₮{product.price} each</div>
          </div>
          <div className="text-[16px] font-[800] text-[var(--wn-ink)]">₮{total.toLocaleString()}</div>
        </div>

        <div className="flex items-center justify-between text-[14px] font-[600] text-[var(--wn-ink-2)]">
          <span>Quantity</span><span>{qty}</span>
        </div>
        <div className="flex items-center justify-between text-[14px] font-[600] text-[var(--wn-ink-2)]">
          <span>Shipping</span><span>Combined</span>
        </div>

        <div className="h-px bg-[var(--wn-line)] w-full" />

        <BalanceSummary balance={balance} cost={total} />

        <ModalActionButton
          onClick={handleBuy}
          enabled={balance >= total}
          label={`Buy — ₮${total.toLocaleString()}`}
        />
      </div>
    </Modal>
  );
};