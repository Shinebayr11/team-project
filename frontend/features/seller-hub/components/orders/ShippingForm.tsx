"use client"

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { CONTROL } from "@/features/seller-hub/components/FormField"
import { btn } from "@/features/seller-hub/components/buttons"

interface ShippingFormProps {
  onGenerateLabel: () => void;
  onShip: (driverPhone: string, vehiclePlate: string) => void;
}

/**
 * Хүргэлтэд гаргах маягт. Олон улсын тээвэрлэгч биш — барааг хүргэж яваа
 * ЖОЛООЧИЙН утас, машины дугаарыг бүртгэнэ (дотоодын хүргэлтийн бодит хэлбэр).
 */
export const ShippingForm: React.FC<ShippingFormProps> = ({ onGenerateLabel, onShip }) => {
  const [driverPhone, setDriverPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

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
        <label className="text-[12px] font-[700] text-[var(--wn-admin-muted)]" htmlFor="driver-phone">
          Жолоочийн утас
        </label>
        <input
          id="driver-phone"
          type="tel"
          inputMode="numeric"
          value={driverPhone}
          onChange={e => setDriverPhone(e.target.value)}
          placeholder="99112233"
          className={CONTROL}
        />

        <label className="text-[12px] font-[700] text-[var(--wn-admin-muted)] mt-2" htmlFor="vehicle-plate">
          Машины дугаар
        </label>
        <input
          id="vehicle-plate"
          type="text"
          value={vehiclePlate}
          onChange={e => setVehiclePlate(e.target.value)}
          placeholder="1234 УБА"
          className={CONTROL}
        />

        <button
          onClick={() => onShip(driverPhone.trim(), vehiclePlate.trim())}
          className={`${btn("ink", "block")} mt-2`}
        >
          Хүргэлтэд гарсан гэж тэмдэглэх
        </button>
      </div>
    </>
  );
};
