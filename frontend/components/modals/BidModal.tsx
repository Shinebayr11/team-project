"use client"

import React, { useState } from 'react';
import { ReelShow } from '../../types';
import { useStore, parsePrice } from '../../store';
import { Modal } from '../ui/Modal';
import { BalanceSummary } from './BalanceSummary';
import { ModalActionButton } from './ModalActionButton';

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
  const { show } = data;

  const currentBid = parsePrice(show.item.price);
  const minimumBid = parsePrice(show.item.next);
  const myBid = Math.max(minimumBid, currentBid + increment);
  const balance = credits();

  const handleBid = () => {
    bid({ title: show.item.name, seller: show.seller, amount: myBid.toString() });
    closeModal();
    addToast("You're the top bidder");
  };

  return (
    <Modal title="Place a bid" onClose={closeModal}>
      <div className="px-6 py-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--wn-shot)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-[700] text-[var(--wn-ink)] truncate">{show.item.name}</div>
            <div className="text-[14px] font-[600] text-[var(--wn-ink-3)] mt-0.5">Current bid: ₮{show.item.price}</div>
          </div>
          <div className="w-[42px] h-[42px] rounded-full border-2 border-[var(--wn-line-2)] flex items-center justify-center text-[15px] font-[800] text-[var(--wn-ink)] shrink-0">
            {show.item.seconds}
          </div>
        </div>

        <div className="flex flex-col items-center py-4">
          <div className="text-[12px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase mb-2">Your Bid</div>
          <div className="text-[48px] font-[800] text-[var(--wn-ink)] tracking-tight leading-none mb-6">₮{myBid.toLocaleString()}</div>
          <div className="flex items-center gap-3">
            {INCREMENTS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setIncrement(value)}
                className={`px-4 py-2 rounded-full text-[14px] font-[700] transition-colors ${
                  increment === value
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
          enabled={balance >= myBid}
          label={`Place bid — ₮${myBid.toLocaleString()}`}
        />
      </div>
    </Modal>
  );
};