"use client"

import React, { useState } from 'react';
import { Sheet, SheetBody, SheetFooter, SheetHeader } from '@/components/ui/sheet';
import { ApiError } from '@/lib/api';
import type { Address, AddressBody } from '@/types/account';

interface AddressFormSheetProps {
  open: boolean;
  /** Байвал засварлаж байна, үгүй бол шинээр нэмж байна. */
  editing: Address | null;
  onClose: () => void;
  onSubmit: (body: AddressBody) => Promise<void>;
}

const field =
  'w-full h-11 rounded-xl border border-[var(--wn-line-2)] px-4 text-[15px] text-[var(--wn-ink)] outline-none transition-colors focus:border-[var(--wn-accent)]';
const label = 'block text-[13px] font-[700] text-[var(--wn-ink-2)] mb-2';

const emptyDraft = (): AddressBody => ({
  fullName: '',
  phone: '',
  city: '',
  district: '',
  khoroo: '',
  detail: '',
  isDefault: false,
});

const draftOf = (address: Address | null): AddressBody =>
  address
    ? {
        fullName: address.fullName,
        phone: address.phone,
        city: address.city,
        district: address.district,
        khoroo: address.khoroo ?? '',
        detail: address.detail,
        isDefault: address.isDefault,
      }
    : emptyDraft();

/** Хаяг нэмэх, засах маягт. Талбарын алдааг серверээс авч, доор нь харуулна. */
export const AddressFormSheet: React.FC<AddressFormSheetProps> = ({
  open, editing, onClose, onSubmit,
}) => {
  // Цонх нээгдэх бүрд шинэ хуулбар авахын тулд `key`-ээр дахин холбоно.
  const [draft, setDraft] = useState<AddressBody>(() => draftOf(editing));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [footerError, setFooterError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const patch = (updates: Partial<AddressBody>) => {
    setDraft(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  const submit = async () => {
    setSaving(true);
    setErrors({});
    setFooterError(null);

    try {
      await onSubmit(draft);
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        const detail = error.body as { fields?: Record<string, string> } | null;
        if (detail?.fields && Object.keys(detail.fields).length > 0) {
          setErrors(detail.fields);
          return;
        }
      }
      setFooterError('Хадгалж чадсангүй. Дахин оролдоно уу.');
    } finally {
      setSaving(false);
    }
  };

  // ЭНГИЙН ФУНКЦ, компонент БИШ: компонент болговол render бүрд шинэ төрөл
  // үүсч, React input-уудыг дахин холбоод бичих бүрд фокус алддаг.
  const renderField = (
    name: keyof AddressBody,
    title: string,
    placeholder?: string
  ) => (
    <div key={name}>
      <label className={label} htmlFor={`addr-${name}`}>{title}</label>
      <input
        id={`addr-${name}`}
        value={String(draft[name] ?? '')}
        onChange={e => patch({ [name]: e.target.value } as Partial<AddressBody>)}
        placeholder={placeholder}
        disabled={saving}
        className={field}
      />
      {errors[name] && (
        <p className="mt-1 text-[12.5px] font-[600] text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={next => !next && onClose()} wide>
      <SheetHeader title={editing ? 'Хаяг засах' : 'Шинэ хаяг'} />

      <SheetBody>
        <div className="flex flex-col gap-4">
          {renderField('fullName', 'Хүлээн авагчийн нэр', 'Овог нэр')}
          {renderField('phone', 'Утасны дугаар', '99112233')}
          {renderField('city', 'Хот / аймаг', 'Улаанбаатар')}
          {renderField('district', 'Дүүрэг / сум', 'Сүхбаатар')}
          {renderField('khoroo', 'Хороо / баг (заавал биш)', '1-р хороо')}
          {renderField('detail', 'Дэлгэрэнгүй хаяг', 'Гудамж, байр, тоот')}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={!!draft.isDefault}
              onChange={e => patch({ isDefault: e.target.checked })}
              disabled={saving}
              className="size-5 accent-[var(--wn-accent)]"
            />
            <span className="text-[14.5px] font-[500] text-[var(--wn-ink)]">
              Үндсэн хаяг болгох
            </span>
          </label>

          {footerError && (
            <p className="text-[13px] font-[600] text-red-600">{footerError}</p>
          )}
        </div>
      </SheetBody>

      <SheetFooter>
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="h-11 rounded-xl bg-[var(--wn-ink)] text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-ink-2)] disabled:opacity-60"
        >
          {saving ? 'Хадгалж байна...' : 'Хадгалах'}
        </button>
      </SheetFooter>
    </Sheet>
  );
};
