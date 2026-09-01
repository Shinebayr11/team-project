"use client"

import React, { useState, useRef } from 'react';
import { ReelItem } from '../../types';

interface ReelMobileBottomBarProps {
  item: ReelItem;
  countdown: number;
  onAction: () => void;
  onSendChat: (text: string) => void;
}

export const ReelMobileBottomBar: React.FC<ReelMobileBottomBarProps> = ({
  item,
  countdown,
  onAction,
  onSendChat,
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendChat(input.trim());
    setInput('');
    inputRef.current?.blur();
  };

  const isBidding = item.mode === 'bid';

  return (
    <div
      className="absolute inset-x-0 z-20 lg:hidden bg-gradient-to-t from-black/80 to-transparent"
      style={{ bottom: 0, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Row 1: Auction item strip */}
      <div
        className="mx-3 mb-1 mt-2 bg-black/60 rounded-[12px] p-2 flex items-center gap-2.5 backdrop-blur-sm"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
      >
        <div className="w-[48px] h-[48px] rounded-lg bg-[var(--wn-shot)] shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-[700] text-white truncate">{item.name}</div>
          <div className="text-[11px] font-[600] text-white/80 mt-0.5">₮{item.price}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isBidding && (
            <div className="w-[32px] h-[32px] rounded-full border border-white/40 flex items-center justify-center text-[11px] font-[800] text-white">
              {countdown}
            </div>
          )}
          <button
            onClick={onAction}
            className="h-[36px] px-4 rounded-lg bg-[var(--wn-accent)] text-white text-[12px] font-[800] hover:bg-[var(--wn-accent-hover)] transition-colors shrink-0"
          >
            {isBidding ? 'Bid' : 'Buy'}
          </button>
        </div>
      </div>

      {/* Row 2: Chat input */}
      <form onSubmit={handleSubmit} className="mx-3 mb-2">
        <div className="relative flex items-center w-full h-[36px] rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            aria-label="Chat message"
            className="bg-transparent border-none outline-none w-full text-[13px] text-white placeholder:text-white/60"
          />
        </div>
      </form>
    </div>
  );
};
