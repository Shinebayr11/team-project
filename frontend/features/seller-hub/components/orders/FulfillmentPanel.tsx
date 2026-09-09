"use client"

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SellerOrder } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { fulfillmentTone, FULFILLMENT_STATUS_LABELS } from '../statusTones';
import { Panel } from '../DataCard';
import { ShippingForm } from './ShippingForm';
import { useSellerProfile } from '@/hooks/useSellerProfile';
import { settingsOf } from '@/features/seller-hub/sellerSettings';
import { btn } from "@/features/seller-hub/components/buttons"

interface FulfillmentPanelProps {
  order: SellerOrder;
  onAdvance: (status: SellerOrder['fulfillmentStatus']) => void;
  onGenerateLabel: () => void;
  onShip: (carrier: string, trackingNumber: string) => void;
}

const primaryButton = btn("ink", "block");

export const FulfillmentPanel: React.FC<FulfillmentPanelProps> = ({
  order, onAdvance, onGenerateLabel, onShip,
}) => {
  const { profile } = useSellerProfile();
  const packingSlipNote = settingsOf(profile).orders.packingSlipNote;

  return (
  <Panel
    title="Захиалгын явц"
    action={<StatusPill label={FULFILLMENT_STATUS_LABELS[order.fulfillmentStatus]} tone={fulfillmentTone(order.fulfillmentStatus)} />}
  >
    <div className="flex flex-col gap-4">
      {order.fulfillmentStatus === 'PENDING' && (
        <button onClick={() => onAdvance('PROCESSING')} className={primaryButton}>Боловсруулж эхлэх</button>
      )}

      {order.fulfillmentStatus === 'PROCESSING' && (
        <button onClick={() => onAdvance('READY_TO_SHIP')} className={primaryButton}>Хүргэхэд бэлэн гэж тэмдэглэх</button>
      )}

      {order.fulfillmentStatus === 'READY_TO_SHIP' && (
        <>
          {packingSlipNote && (
            <div className="p-3 rounded-xl bg-[var(--wn-admin-row-rule)] border border-[var(--wn-admin-card-border)]">
              <div className="text-[12px] font-[700] text-[var(--wn-admin-muted)]">Баглааны тэмдэглэл</div>
              <div className="mt-0.5 text-[13px] font-[500] text-black">{packingSlipNote}</div>
            </div>
          )}
          <ShippingForm onGenerateLabel={onGenerateLabel} onShip={onShip} />
        </>
      )}

      {order.fulfillmentStatus === 'SHIPPED' && (
        <>
          <div className="p-4 rounded-xl bg-[var(--wn-admin-row-rule)] border border-[var(--wn-admin-card-border)] flex flex-col gap-1 mb-2">
            <div className="text-[12px] font-[700] text-[var(--wn-admin-muted)]">Хүргэлтийн мэдээлэл</div>
            <div className="text-[14px] font-[700] text-black">{order.carrier} — {order.trackingNumber}</div>
          </div>
          <button onClick={() => onAdvance('DELIVERED')} className={`${primaryButton} flex items-center justify-center gap-2`}>
            <CheckCircle2 className="w-4 h-4" /> Хүргэгдсэн гэж тэмдэглэх
          </button>
        </>
      )}

      {order.fulfillmentStatus === 'DELIVERED' && (
        <div className="p-4 rounded-xl bg-[var(--wn-admin-ok-soft)] border border-[var(--wn-admin-ok)]/20 flex flex-col gap-1">
          <div className="text-[12px] font-[700] text-[var(--wn-admin-ok)]">Төлөв</div>
          <div className="text-[14px] font-[700] text-[var(--wn-admin-ok)]">Бараа хүргэгдсэн</div>
          {order.trackingNumber && (
            <div className="text-[12px] font-[500] text-[var(--wn-admin-ok)] mt-1">{order.carrier} — {order.trackingNumber}</div>
          )}
        </div>
      )}
    </div>
  </Panel>
  );
};