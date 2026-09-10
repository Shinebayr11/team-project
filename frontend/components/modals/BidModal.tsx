"use client"

import React, { useState } from 'react';
import { ReelShow } from '../../types';
import { useStore, parsePrice } from '../../store';
import { Modal } from '../ui/Modal';
import { BalanceSummary } from './BalanceSummary';
import { ModalActionButton } from './ModalActionButton';
import { CountdownRing, useCountdown } from '../live/auction-countdown';

export interface BidModalData {
  show: ReelShow;
}

const INCREMENTS = [
  { value: 0, label: 'Min' },
  { value: 25, label: '+25' },
  { value: 50, label: '+50' },
];

export const BidModal: React.FC<{ data: BidModalData }> = ({ data }) => {
  const { closeModal, credits, bid, addToast } = useStore();
  const [increment, setIncrement] = useState(25);
  // Гараар бичсэн дүн. `null` бол товчны сонголтыг дага.
  const [typedAmount, setTypedAmount] = useState<string | null>(null);
  const { show } = data;

  // Демо өгөгдөлд дуусах мөч байхгүй тул цонх нээгдэх агшнаас тоолж эхэлнэ.
  // `useMemo` биш `useState`-ийн залхуу эхлүүлэлт: memo хаягдвал тоолуур
  // дахин эхлэх байсан бөгөөд `Date.now()` нь render-ийн цэвэр үйлдэл биш.
  const [endsAt] = useState(
    () => new Date(Date.now() + show.item.seconds * 1000).toISOString()
  );
  const { seconds, progress, urgent } = useCountdown(endsAt);

  const currentBid = parsePrice(show.item.price);
  const minimumBid = parsePrice(show.item.next);
  const stepBid = Math.max(minimumBid, currentBid + increment);
  const myBid =
    typedAmount !== null ? Math.max(0, Math.floor(Number(typedAmount) || 0)) : stepBid;
  const tooLow = myBid < minimumBid;
  const balance = credits();

  const handleBid = () => {
    bid({ title: show.item.name, seller: show.seller, amount: myBid.toString() });
    closeModal();
    addToast("You're the top bidder");
  };

  return (
    <Modal title="Үнийн санал өгөх" onClose={closeModal}>
      <div className="px-6 py-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--wn-shot)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-[700] text-[var(--wn-ink)] truncate">{show.item.name}</div>
            <div className="text-[14px] font-[600] text-[var(--wn-ink-3)] mt-0.5">Одоогийн үнэ: ₮{show.item.price}</div>
          </div>
          <CountdownRing seconds={seconds} progress={progress} urgent={urgent} />
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="text-[12px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase mb-2">Таны санал</div>
          {/* Бэлэн алхмууд түгээмэл тохиолдлыг хурдан болгоно, гэхдээ дуудлага
              худалдаанд хүн өөрийн дүнгээ шийддэг — тоог нь шууд засаж болно. */}
          <label className="mb-6 flex items-baseline justify-center gap-1">
            <span className="text-[32px] sm:text-[48px] font-[800] leading-none text-[var(--wn-ink)]">₮</span>
            <input
              type="number"
              inputMode="numeric"
              min={minimumBid}
              value={typedAmount ?? myBid}
              onChange={(e) => setTypedAmount(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Саналын дүн"
              className="w-[min(240px,55vw)] border-0 bg-transparent p-0 text-center text-[32px] leading-none font-[800] tracking-tight text-[var(--wn-ink)] tabular-nums outline-none focus:underline focus:decoration-[var(--wn-accent)] focus:decoration-2 focus:underline-offset-8 sm:text-[48px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </label>
          <div className="flex items-center gap-3">
            {INCREMENTS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  setIncrement(value);
                  setTypedAmount(null);
                }}
                className={`px-4 py-2 rounded-full text-[14px] font-[700] transition-colors ${
                  typedAmount === null && increment === value
                    ? 'bg-[var(--wn-ink)] text-white'
                    : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)] hover:bg-[var(--wn-line)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <BalanceSummary balance={balance} cost={myBid} />

        <ModalActionButton
          onClick={handleBid}
          enabled={balance >= myBid && !tooLow && seconds > 0}
          disabledLabel={
            seconds <= 0
              ? 'Хугацаа дууслаа'
              : tooLow
                ? `Доод дүн ₮${minimumBid.toLocaleString()}`
                : 'Үлдэгдэл хүрэлцэхгүй'
          }
          label={`Санал өгөх — ₮${myBid.toLocaleString()}`}
        />
      </div>
    </Modal>
  );
};