"use client"

import React from 'react';
import { SellerShow } from '@/features/seller-hub/types';
import { Field } from '../FormField';
import { SHOW_TYPES } from './showSchedule';

export type ShowType = SellerShow['type'];

/** `?type=` зэрэг гаднаас ирсэн мөрийг мэдэгдэж буй хэлбэр рүү нааж авна. */
export const asShowType = (value: string | null | undefined): ShowType =>
  SHOW_TYPES.some(t => t.value === value) ? (value as ShowType) : 'mixed';

interface ShowTypePickerProps {
  value: ShowType;
  onChange: (value: ShowType) => void;
  label?: string;
}

/**
 * Худалдааны хэлбэр сонгох. Товлох маягт (`ShowForm`) ба эфирт шууд орох
 * дэлгэц (`StartShowScreen`) хоёулаа ҮҮНИЙГ дуудна — хоёр газарт өөр өөр
 * жагсаалт зурагдвал худалдагч товлохдоо «Дуудлага худалдаа» сонгоод эхлэхдээ
 * өөр хэлбэрээр эфирт ордог байв.
 */
export const ShowTypePicker: React.FC<ShowTypePickerProps> = ({
  value,
  onChange,
  label = 'Худалдааны хэлбэр *',
}) => (
  <Field label={label}>
    <div className="flex flex-col gap-2">
      {SHOW_TYPES.map(({ value: option, label: name, hint }) => {
        const chosen = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={chosen}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              chosen
                ? 'border-[var(--wn-admin-ink)] bg-[var(--wn-admin-row-rule)]'
                : 'border-[var(--wn-ink-4)] hover:bg-[var(--wn-admin-row-rule)]'
            }`}
          >
            <div className="text-[14px] font-[800] text-black">{name}</div>
            <div className="mt-0.5 text-[13px] font-[500] text-[var(--wn-admin-muted)]">{hint}</div>
          </button>
        );
      })}
    </div>
  </Field>
);
