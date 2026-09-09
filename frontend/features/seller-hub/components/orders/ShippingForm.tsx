"use client"

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { CONTROL } from "@/features/seller-hub/components/FormField"
import { useSellerProfile } from '@/hooks/useSellerProfile';
import { settingsOf } from '@/features/seller-hub/sellerSettings';
import { btn } from "@/features/seller-hub/components/buttons"

interface ShippingFormProps {
  onGenerateLabel: () => void;
  onShip: (carrier: string, trackingNumber: string) => void;
}

/** Тохиргооны хуудас ч ижил жагсаалтаас сонгодог тул эндээс экспортлов. */
export const CARRIERS = ['USPS', 'UPS', 'FedEx'];
export const ShippingForm: React.FC<ShippingFormProps> = ({ onGenerateLabel, onShip }) => {
  const { profile } = useSellerProfile();
  const settings = settingsOf(profile);

  const [carrier, setCarrier] = useState(settings.shipping.defaultCarrier);
  const [tracking, setTracking] = useState('');

  return (
    <>
      <button
        onClick={onGenerateLabel}
        className={btn("outline", "block")}
      >
        <FileText className="w-4 h-4" /> Хаягийн наалт үүсгэх
      </button>

      <div className="h-px bg-[var(--wn-admin-chip)] my-2" />

      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-[700] text-[var(--wn-admin-muted)]" htmlFor="carrier">Тээвэрлэгч</label>
        <select id="carrier" value={carrier} onChange={e => setCarrier(e.target.value)} className={CONTROL}>
          {CARRIERS.map(c => <option key={c}>{c}</option>)}
        </select>

        <label className="text-[12px] font-[700] text-[var(--wn-admin-muted)] mt-2" htmlFor="tracking">Хүргэлтийн код</label>
        <input
          id="tracking"
          type="text"
          value={tracking}
          onChange={e => setTracking(e.target.value)}
          placeholder="Хүргэлтийн код оруулах..."
          className={CONTROL}
        />

        <button
          onClick={() => onShip(carrier, tracking.trim())}
          className={`${btn("ink", "block")} mt-2`}
        >
          Илгээсэн гэж тэмдэглэх
        </button>
      </div>
    </>
  );
};