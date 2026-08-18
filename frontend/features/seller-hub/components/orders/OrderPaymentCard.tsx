"use client"

import React from 'react';
import { SellerOrder } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { paymentTone } from '../statusTones';
import { Panel } from '../DataCard';

export const OrderPaymentCard: React.FC<{ order: SellerOrder }> = ({ order }) => (
  <Panel
    title="Payment"
    action={<StatusPill label={order.paymentStatus} tone={paymentTone(order.paymentStatus)} />}
  >
    <div className="flex flex-col gap-2 text-[14px]">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span><span>₮{order.total.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Shipping</span><span>₮0</span>
      </div>
      <div className="h-px bg-gray-100 my-2" />
      <div className="flex justify-between font-[800] text-black text-[16px]">
        <span>Total</span><span>₮{order.total.toLocaleString()}</span>
      </div>
    </div>
  </Panel>
);