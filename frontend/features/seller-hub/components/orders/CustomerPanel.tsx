"use client"

import React from 'react';
import { SellerOrder } from '@/features/seller-hub/types';

export const CustomerPanel: React.FC<{ order: SellerOrder }> = ({ order }) => {
  const address = order.shippingAddress;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-[16px] font-[800] text-black mb-4">Customer</h2>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[14px] font-[700] text-gray-600">
          {order.buyerName.charAt(0).toUpperCase()}
        </div>
        <div className="font-[700] text-[14px] text-black">{order.buyerName}</div>
      </div>

      <h3 className="text-[13px] font-[800] text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h3>
      <div className="text-[14px] text-gray-600 leading-relaxed">
        <div className="font-[600] text-black">{address.fullName}</div>
        <div>{address.addressLine1}</div>
        <div>{address.city}, {address.state} {address.postalCode}</div>
        <div>{address.country}</div>
      </div>
    </div>
  );
};