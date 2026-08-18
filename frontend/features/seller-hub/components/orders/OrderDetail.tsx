"use client"

import React from 'react';
import { SellerOrder } from '@/features/seller-hub/types';
import { PageHeader } from '../PageHeader';
import { OrderItemsCard } from './OrderItemsCard';
import { OrderPaymentCard } from './OrderPaymentCard';
import { FulfillmentPanel } from './FulfillmentPanel';
import { CustomerPanel } from './CustomerPanel';

interface OrderDetailProps {
  order: SellerOrder;
  onBack: () => void;
  onAdvance: (status: SellerOrder['fulfillmentStatus']) => void;
  onGenerateLabel: () => void;
  onShip: (carrier: string, trackingNumber: string) => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({
  order, onBack, onAdvance, onGenerateLabel, onShip,
}) => (
  <>
    <PageHeader
      title={`Order ${order.id}`}
      description={`Placed on ${new Date(order.date).toLocaleDateString()}`}
      onBack={onBack}
    />

    <div className="flex gap-6 max-w-[1100px]">
      <div className="flex-1 flex flex-col gap-6">
        <OrderItemsCard items={order.items} />
        <OrderPaymentCard order={order} />
      </div>

      <div className="w-[340px] shrink-0 flex flex-col gap-6">
        <FulfillmentPanel
          order={order}
          onAdvance={onAdvance}
          onGenerateLabel={onGenerateLabel}
          onShip={onShip}
        />
        <CustomerPanel order={order} />
      </div>
    </div>
  </>
);