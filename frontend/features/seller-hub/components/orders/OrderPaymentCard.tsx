"use client"

import React from 'react';
import { SellerOrder } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { paymentTone, PAYMENT_STATUS_LABELS } from '../statusTones';
import { Panel } from '../DataCard';

export const OrderPaymentCard: React.FC<{ order: SellerOrder }> = ({ order }) => (
  <Panel
    title="Төлбөр"
    action={<StatusPill label={PAYMENT_STATUS_LABELS[order.paymentStatus]} tone={paymentTone(order.paymentStatus)} />}
  >
    <div className="flex flex-col gap-2 text-[14px]">
      <div className="flex justify-between text-[var(--wn-admin-ink-2)]">
        <span>Дэд дүн</span><span>₮{order.total.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-[var(--wn-admin-ink-2)]">
        <span>Хүргэлт</span><span>₮0</span>
      </div>
      <div className="h-px bg-[var(--wn-admin-chip)] my-2" />
      <div className="flex justify-between font-[800] text-black text-[16px]">
        <span>Нийт дүн</span><span>₮{order.total.toLocaleString()}</span>
      </div>
    </div>
  </Panel>
);