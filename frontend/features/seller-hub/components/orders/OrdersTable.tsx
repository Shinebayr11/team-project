"use client"

import React from 'react';
import { SellerOrder } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { paymentTone, fulfillmentTone } from '../statusTones';
import { EmptyRow } from '../DataCard';

interface OrdersTableProps {
  orders: SellerOrder[];
  onSelect: (id: string) => void;
}

const HEADERS = ['Order', 'Date', 'Customer', 'Payment', 'Fulfillment'];

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onSelect }) => (
  <table className="w-full text-left border-collapse min-w-[900px]">
    <thead>
      <tr className="bg-white text-[12px] font-[800] text-gray-500 uppercase tracking-wider border-b border-gray-200">
        {HEADERS.map(h => <th key={h} className="p-4">{h}</th>)}
        <th className="p-4 text-right">Total</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {orders.map(order => (
        <tr
          key={order.id}
          onClick={() => onSelect(order.id)}
          className="text-[14px] hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <td className="p-4 font-[800] text-black">{order.id}</td>
          <td className="p-4 font-[500] text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
          <td className="p-4 font-[600] text-gray-600">{order.buyerName}</td>
          <td className="p-4">
            <StatusPill label={order.paymentStatus} tone={paymentTone(order.paymentStatus)} />
          </td>
          <td className="p-4">
            <StatusPill label={order.fulfillmentStatus} tone={fulfillmentTone(order.fulfillmentStatus)} withDot />
          </td>
          <td className="p-4 text-right font-[700] text-black">₮{order.total.toLocaleString()}</td>
        </tr>
      ))}

      {orders.length === 0 && <EmptyRow colSpan={6} message="No orders found." />}
    </tbody>
  </table>
);