"use client"

import React, { useEffect, useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { SellerProduct } from '../../types';
import { useStore, parsePrice } from '../../store';
import { useApiClient } from '@/hooks/useApiClient';
import { useWallet } from '@/hooks/useWallet';
import { useAddresses } from '@/hooks/useAddresses';
import { addressLine } from '@/lib/address';
import { ApiError } from '@/lib/api';
import { AddressFormSheet } from '../profile/AddressFormSheet';
import { Modal } from '../ui/Modal';
import { BalanceSummary } from './BalanceSummary';
import { ModalActionButton } from './ModalActionButton';

export interface BuyModalData {
  product: SellerProduct;
  seller: string;
  qty: number;
}

export const BuyModal: React.FC<{ data: BuyModalData }> = ({ data }) => {
  const { closeModal, buy, addToast } = useStore();
  const { callApi } = useApiClient();
  const { available, loading: walletLoading, refresh: refreshWallet } = useWallet();
  const { product, seller, qty } = data;
  const [submitting, setSubmitting] = useState(false);

  const total = parsePrice(product.price) * qty;
  // Үлдэгдэл үргэлж сервер дээрх хэтэвчнээс. `productId`-гүй demo бараа
  // (`LiveShow`-ийн reel) зөвхөн локал бичлэг үлдээнэ.
  const isReal = !!product.productId;
  const balance = available;

  // Хүргэлтийн хаяг — зөвхөн бодит захиалгад хэрэгтэй, `Profile`-ийн
  // "Хүргэлтийн хаяг" таб ашигладаг ЯГ ТЭР л hook/маягтыг дахин ашиглана.
  const { addresses, loading: addressesLoading, create: createAddress } = useAddresses();
  const [pickedAddressId, setPickedAddressId] = useState<string | null>(null);
  const [addAddressOpen, setAddAddressOpen] = useState(false);

  // Хэрэглэгч өөрөө сонгоогүй л бол үндсэн (эсвэл эхний) хаяг автоматаар
  // сонгогдсон байна — effect биш, render үеийн дериватив тул шаардлагагүй
  // дахин render хийхгүй.
  const selectedAddressId =
    pickedAddressId ?? (addresses.find(a => a.isDefault) ?? addresses[0])?._id ?? null;

  // Шинэ хаяг нэмэгдэхэд `addresses`-ийн шинэчлэл дараагийн render дээр л
  // ирдэг тул эффектээр шинэ (өмнө байгаагүй) id-г олж шууд сонгоно —
  // хэрэглэгч дөнгөж бөглөсөн хаягаа дахин олж сонгох шаардлагагүй.
  const prevAddressIds = React.useRef<Set<string>>(new Set());
  useEffect(() => {
    const prevIds = prevAddressIds.current;
    const added = addresses.find(a => !prevIds.has(a._id));
    if (added && addAddressOpen === false && prevIds.size > 0) {
      setPickedAddressId(added._id);
    }
    prevAddressIds.current = new Set(addresses.map(a => a._id));
  }, [addresses, addAddressOpen]);

  const handleBuy = async () => {
    if (!isReal) {
      buy({ title: product.name, seller, price: product.price, qty });
      closeModal();
      addToast('Захиалга баталгаажлаа.');
      return;
    }

    setSubmitting(true);
    try {
      await callApi('/api/order', {
        method: 'POST',
        body: JSON.stringify({
          product_id: product.productId,
          quantity: qty,
          address_id: selectedAddressId,
        }),
      });
      closeModal();
      addToast('Захиалга баталгаажлаа.');
      refreshWallet();
    } catch (error) {
      addToast(error instanceof ApiError ? error.message : 'Худалдан авахад алдаа гарлаа.');
    } finally {
      setSubmitting(false);
    }
  };

  const needsAddress = isReal && !selectedAddressId;
  const canSubmit = balance >= total && !submitting && !walletLoading && !needsAddress;

  return (
    <Modal title="Худалдан авалт баталгаажуулах" onClose={closeModal}>
      <div className="px-6 py-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--wn-shot)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-[700] text-[var(--wn-ink)] truncate">{product.name}</div>
            <div className="text-[14px] font-[600] text-[var(--wn-ink-3)] mt-0.5">ширхэг нь ₮{product.price}</div>
          </div>
          <div className="text-[16px] font-[800] text-[var(--wn-ink)]">₮{total.toLocaleString()}</div>
        </div>

        <div className="flex items-center justify-between text-[14px] font-[600] text-[var(--wn-ink-2)]">
          <span>Тоо ширхэг</span><span>{qty}</span>
        </div>

        {isReal ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-[800] tracking-wider text-[var(--wn-ink-3)] uppercase">
                Хүргэлтийн хаяг
              </span>
              <button
                type="button"
                onClick={() => setAddAddressOpen(true)}
                className="flex items-center gap-1 text-[13px] font-[700] text-[var(--wn-accent)] hover:underline"
              >
                <Plus className="size-3.5" /> Шинэ хаяг
              </button>
            </div>

            {addressesLoading ? (
              <div className="h-[68px] w-full animate-pulse rounded-xl bg-[var(--wn-surface-2)]" />
            ) : addresses.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--wn-line-2)] px-4 py-3 text-[13px] font-[600] text-[var(--wn-ink-3)]">
                <MapPin className="size-4 shrink-0" />
                Хадгалсан хаяг алга байна — эхлээд нэг нэмнэ үү.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {addresses.map(address => (
                  <label
                    key={address._id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors ${
                      selectedAddressId === address._id
                        ? 'border-[var(--wn-accent)] bg-[var(--wn-accent-soft)]'
                        : 'border-[var(--wn-line)] hover:border-[var(--wn-line-2)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="buy-address"
                      className="mt-1 accent-[var(--wn-accent)]"
                      checked={selectedAddressId === address._id}
                      onChange={() => setPickedAddressId(address._id)}
                    />
                    <div className="min-w-0 text-[13.5px] text-[var(--wn-ink-2)]">
                      <div className="font-[700] text-[var(--wn-ink)]">{address.fullName}</div>
                      <div>{addressLine(address)}</div>
                      <div className="text-[var(--wn-ink-3)]">{address.phone}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-[14px] font-[600] text-[var(--wn-ink-2)]">
            <span>Хүргэлт</span><span>Нэгтгэсэн</span>
          </div>
        )}

        <div className="h-px bg-[var(--wn-line)] w-full" />

        <BalanceSummary balance={balance} cost={total} />

        <ModalActionButton
          onClick={handleBuy}
          enabled={canSubmit}
          label={submitting ? 'Боловсруулж байна…' : `Худалдаж авах — ₮${total.toLocaleString()}`}
          disabledLabel={
            walletLoading
              ? 'Үлдэгдэл шалгаж байна…'
              : needsAddress
                ? 'Эхлээд хаяг сонгоно уу'
                : undefined
          }
        />
      </div>

      {addAddressOpen && (
        <AddressFormSheet
          open={addAddressOpen}
          editing={null}
          onClose={() => setAddAddressOpen(false)}
          onSubmit={createAddress}
        />
      )}
    </Modal>
  );
};
