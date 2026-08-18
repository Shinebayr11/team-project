"use client"

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SellerOrder } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { fulfillmentTone } from '../statusTones';
import { Panel } from '../DataCard';
import { ShippingForm } from './ShippingForm';

interface FulfillmentPanelProps {
  order: SellerOrder;
  onAdvance: (status: SellerOrder['fulfillmentStatus']) => void;
  onGenerateLabel: () => void;
  onShip: (carrier: string, trackingNumber: string) => void;
}

const primaryButton = 'w-full py-2.5 rounded-xl bg-black text-white text-[14px] font-[700] hover:bg-gray-800 transition-colors';

export const FulfillmentPanel: React.FC<FulfillmentPanelProps> = ({
  order, onAdvance, onGenerateLabel, onShip,
}) => (
  <Panel
    title="Fulfillment"
    action={<StatusPill label={order.fulfillmentStatus} tone={fulfillmentTone(order.fulfillmentStatus)} />}
  >
    <div className="flex flex-col gap-4">
      {order.fulfillmentStatus === 'PENDING' && (
        <button onClick={() => onAdvance('PROCESSING')} className={primaryButton}>Start Processing</button>
      )}

      {order.fulfillmentStatus === 'PROCESSING' && (
        <button onClick={() => onAdvance('READY_TO_SHIP')} className={primaryButton}>Mark Ready to Ship</button>
      )}

      {order.fulfillmentStatus === 'READY_TO_SHIP' && (
        <ShippingForm onGenerateLabel={onGenerateLabel} onShip={onShip} />
      )}

      {order.fulfillmentStatus === 'SHIPPED' && (
        <>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1 mb-2">
            <div className="text-[12px] font-[700] text-gray-500">Tracking Information</div>
            <div className="text-[14px] font-[700] text-black">{order.carrier} — {order.trackingNumber}</div>
          </div>
          <button onClick={() => onAdvance('DELIVERED')} className={`${primaryButton} flex items-center justify-center gap-2`}>
            <CheckCircle2 className="w-4 h-4" /> Mark Delivered
          </button>
        </>
      )}

      {order.fulfillmentStatus === 'DELIVERED' && (
        <div className="p-4 rounded-xl bg-[#E6F4EA] border border-[#166534]/20 flex flex-col gap-1">
          <div className="text-[12px] font-[700] text-[#166534]">Status</div>
          <div className="text-[14px] font-[700] text-[#166534]">Package Delivered</div>
          {order.trackingNumber && (
            <div className="text-[12px] font-[500] text-[#166534]/80 mt-1">{order.carrier} — {order.trackingNumber}</div>
          )}
        </div>
      )}
    </div>
  </Panel>
);