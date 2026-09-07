"use client"

import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { useAddresses } from '@/hooks/useAddresses';
import type { Address, AddressBody } from '@/types/account';
import { AddressFormSheet } from './AddressFormSheet';

/** Хаягийг нэг мөрөнд уншигдахаар нийлүүлнэ. */
const addressLine = (address: Address) =>
  [address.city, address.district, address.khoroo, address.detail]
    .filter(Boolean)
    .join(', ');

export const AddressesTab: React.FC = () => {
  const { addresses, loading, create, update, remove } = useAddresses();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const submit = async (body: AddressBody) => {
    if (editing) await update(editing._id, body);
    else await create(body);
  };

  const handleDelete = async (address: Address) => {
    setBusyId(address._id);
    try {
      await remove(address._id);
    } catch (error) {
      console.error('Хаяг устгаж чадсангүй:', error);
    } finally {
      setBusyId(null);
    }
  };

  /** Үндсэн болгох нь хаягаа өөрчлөхгүй — зөвхөн тэмдэглэгээг нь шилжүүлнэ. */
  const makeDefault = async (address: Address) => {
    setBusyId(address._id);
    try {
      await update(address._id, {
        fullName: address.fullName,
        phone: address.phone,
        city: address.city,
        district: address.district,
        khoroo: address.khoroo,
        detail: address.detail,
        isDefault: true,
      });
    } catch (error) {
      console.error('Үндсэн хаяг тохируулж чадсангүй:', error);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex max-w-[600px] flex-col gap-6">
      <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Хүргэлтийн хаяг</h2>

      {loading ? (
        <p className="text-[15px] font-[600] text-[var(--wn-ink-3)]">Уншиж байна...</p>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--wn-line-2)] py-12 text-center">
              <MapPin className="mx-auto size-6 text-[var(--wn-ink-4)]" />
              <p className="mt-2 text-[14px] font-[600] text-[var(--wn-ink-3)]">
                Хадгалсан хаяг алга байна.
              </p>
            </div>
          ) : (
            addresses.map(address => (
              <div
                key={address._id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--wn-line)] bg-white p-6"
              >
                <div className="flex min-w-0 flex-col gap-1 text-[14px] text-[var(--wn-ink-2)]">
                  <div className="mb-1 flex flex-wrap items-center gap-2 font-[700] text-[var(--wn-ink)]">
                    {address.fullName}
                    {address.isDefault && (
                      <span className="rounded bg-[var(--wn-surface-2)] px-2 py-0.5 text-[10px] font-[800] tracking-wider text-[var(--wn-ink-3)] uppercase">
                        Үндсэн
                      </span>
                    )}
                  </div>
                  <div>{addressLine(address)}</div>
                  <div className="text-[var(--wn-ink-3)]">{address.phone}</div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(address)}
                      className="text-[13px] font-[700] text-[var(--wn-accent)] hover:underline"
                    >
                      Засах
                    </button>
                    <button
                      onClick={() => handleDelete(address)}
                      disabled={busyId === address._id}
                      className="text-[13px] font-[700] text-[var(--wn-ink-4)] transition-colors hover:text-red-600 disabled:opacity-60"
                    >
                      Устгах
                    </button>
                  </div>
                  {!address.isDefault && (
                    <button
                      onClick={() => makeDefault(address)}
                      disabled={busyId === address._id}
                      className="text-[13px] font-[600] text-[var(--wn-ink-3)] hover:underline disabled:opacity-60"
                    >
                      Үндсэн болгох
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          <button
            onClick={openNew}
            className="flex h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[var(--wn-line-2)] text-[14px] font-[700] text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-surface-2)]"
          >
            <Plus className="size-4" /> Шинэ хаяг нэмэх
          </button>
        </>
      )}

      {/* `key` — цонх нээгдэх бүрд маягт шинэ утгаараа эхэлнэ. */}
      {formOpen && (
        <AddressFormSheet
          key={editing?._id ?? 'new'}
          open={formOpen}
          editing={editing}
          onClose={() => setFormOpen(false)}
          onSubmit={submit}
        />
      )}
    </div>
  );
};
