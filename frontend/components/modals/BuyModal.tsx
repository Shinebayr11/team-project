"use client"

import React, { useState } from 'react';
import { SellerProduct } from '../../types';
import { useStore, parsePrice } from '../../store';
import { useApiClient } from '@/hooks/useApiClient';
import { useWallet } from '@/hooks/useWallet';
import { ApiError } from '@/lib/api';
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
  const { callApi } = useApiClient();
  const { available, loading: walletLoading, refresh: refreshWallet } = useWallet();
  const { product, seller, qty } = data;
  const [submitting, setSubmitting] = useState(false);

  const total = parsePrice(product.price) * qty;
  // Бодит `productId`-тай бол сервер дээрх Wallet-ийг ашиглана — mock
  // localStorage-ийн `credits` нь энэ тохиолдолд огт хөндөгдөхгүй.
  const isReal = !!product.productId;
  const balance = isReal ? available : credits();

  const handleBuy = async () => {
    if (!isReal) {
      if (!buy({ title: product.name, seller, price: product.price, qty })) return;
      closeModal();
      addToast('Захиалга баталгаажлаа.');
      return;
    }

    setSubmitting(true);
    try {
      await callApi('/api/order', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.productId, quantity: qty }),
      });
      closeModal();
      addToast('Захиалга баталгаажлаа.');
      refreshWallet();
    } catch (error) {
      addToast(error instanceof ApiError ? error.message : 'Худалдан авахад алдаа гарлаа.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Худалдан авалт баталгаажуулах" onClose={closeModal}>
      <div className="px-6 py-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--wn-shot)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-[700] text-[var(--wn-ink)] truncate">{product.name}</div>
            <div className="text-[14px] font-[600] text-[var(--wn-ink-3)] mt-0.5">ширхэг нь ₮{product.price}</div>
          </div>
          <div className="text-[16px] font-[800] text-[var(--wn-ink)]">₮{total.toLocaleString()}</div>
        </div>

        <div className="flex items-center justify-between text-[14px] font-[600] text-[var(--wn-ink-2)]">
          <span>Тоо ширхэг</span><span>{qty}</span>
        </div>
        <div className="flex items-center justify-between text-[14px] font-[600] text-[var(--wn-ink-2)]">
          <span>Хүргэлт</span><span>Нэгтгэсэн</span>
        </div>

        <div className="h-px bg-[var(--wn-line)] w-full" />

        <BalanceSummary balance={balance} cost={total} />

        <ModalActionButton
          onClick={handleBuy}
          enabled={balance >= total && !submitting && !(isReal && walletLoading)}
          label={submitting ? 'Боловсруулж байна…' : `Худалдаж авах — ₮${total.toLocaleString()}`}
          disabledLabel={isReal && walletLoading ? 'Үлдэгдэл шалгаж байна…' : undefined}
        />
      </div>
    </Modal>
  );
};