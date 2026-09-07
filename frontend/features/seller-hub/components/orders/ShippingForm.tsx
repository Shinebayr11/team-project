"use client"

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useSellerProfile } from '@/hooks/useSellerProfile';
import { settingsOf } from '@/features/seller-hub/sellerSettings';

interface ShippingFormProps {
  onGenerateLabel: () => void;
  onShip: (carrier: string, trackingNumber: string) => void;
}

/** Тохиргооны хуудас ч ижил жагсаалтаас сонгодог тул эндээс экспортлов. */
export const CARRIERS = ['USPS', 'UPS', 'FedEx'];
const inputClass = 'w-full h-10 rounded-lg border border-gray-300 px-3 text-[14px] font-[500] text-black outline-none focus:border-black';

export const ShippingForm: React.FC<ShippingFormProps> = ({ onGenerateLabel, onShip }) => {
  const { profile } = useSellerProfile();
  const settings = settingsOf(profile);

  const [carrier, setCarrier] = useState(settings.shipping.defaultCarrier);
  const [tracking, setTracking] = useState('');

  return (
    <>
      <button
        onClick={onGenerateLabel}
        className="w-full py-2.5 rounded-xl border border-gray-300 text-black text-[14px] font-[700] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <FileText className="w-4 h-4" /> Наалт үүсгэх
      </button>

      <div className="h-px bg-gray-100 my-2" />

      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-[700] text-gray-500" htmlFor="carrier">Тээвэрлэгч</label>
        <select id="carrier" value={carrier} onChange={e => setCarrier(e.target.value)} className={inputClass}>
          {CARRIERS.map(c => <option key={c}>{c}</option>)}
        </select>

        <label className="text-[12px] font-[700] text-gray-500 mt-2" htmlFor="tracking">Хүргэлтийн код</label>
        <input
          id="tracking"
          type="text"
          value={tracking}
          onChange={e => setTracking(e.target.value)}
          placeholder="Хүргэлтийн код оруулах..."
          className={inputClass}
        />

        <button
          onClick={() => onShip(carrier, tracking.trim())}
          className="w-full py-2.5 mt-2 rounded-xl bg-[#C9F73D] text-black text-[14px] font-[800] hover:bg-[#b8e62c] transition-colors"
        >
          Илгээсэн гэж тэмдэглэх
        </button>
      </div>
    </>
  );
};