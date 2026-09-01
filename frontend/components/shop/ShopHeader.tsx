"use client"

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SellerRecord } from '../../types';
import { LiveDot } from '../ui/LiveDot';

interface ShopHeaderProps {
  seller: SellerRecord;
  following: boolean;
  showWatchLive: boolean;
  onToggleFollow: () => void;
  onWatchLive: () => void;
  onMessage: () => void;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  seller, following, showWatchLive, onToggleFollow, onWatchLive, onMessage,
}) => (
  <>
    <div
      className="w-full h-[200px] rounded-b-[20px] relative"
      style={{ background: `linear-gradient(135deg, ${seller.cover[0]} 0%, ${seller.cover[1]} 100%)` }}
    >
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[13px] font-[600] flex items-center gap-2 text-[var(--wn-ink)]">
        {seller.live.type === 'live' ? (
          <><LiveDot className="w-2 h-2" /> Live • {seller.live.watching} watching</>
        ) : (
          `Next show ${seller.live.at}`
        )}
      </div>
    </div>

    {/* Аватар + нэр + гурван товч 320px дээр ~370px шаарддаг тул нэг мөрөнд
        багтахгүй — sm-ээс доош хоёр давхар болно. */}
    <div className="px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div className="flex min-w-0 items-end gap-4 sm:gap-5">
        <div
          className="w-20 h-20 sm:w-[104px] sm:h-[104px] shrink-0 rounded-full border-[5px] border-[var(--wn-page)] flex items-center justify-center text-[30px] sm:text-[40px] font-[700] text-[var(--wn-ink)]"
          style={{ backgroundColor: seller.tint }}
        >
          {seller.initial}
        </div>
        <div className="pb-2">
          <h1 className="text-[25px] font-[800] text-[var(--wn-ink)] leading-tight">{seller.slug}</h1>
          <div className="text-[12px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase mt-1">
            {seller.cat1} • {seller.cat2}
          </div>
        </div>
      </div>

      <div className="flex w-full sm:w-auto flex-wrap items-center gap-2 sm:gap-3 pb-2">
        {showWatchLive && (
          <button onClick={onWatchLive} className="h-[40px] px-5 rounded-full bg-[var(--wn-shot)] text-white text-[14px] font-[700] flex items-center gap-2 hover:bg-[var(--wn-shot-deep)] transition-colors">
            ▶ Watch live
          </button>
        )}
        <button onClick={onMessage} aria-label="Message seller" className="w-[40px] h-[40px] rounded-full bg-white border border-[var(--wn-line)] flex items-center justify-center text-[var(--wn-ink)] hover:bg-[var(--wn-surface-2)] transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button
          onClick={onToggleFollow}
          className={`h-[40px] px-6 rounded-full text-[14.5px] font-[700] transition-colors ${
            following ? 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)]' : 'bg-[var(--wn-ink)] text-white hover:bg-[var(--wn-ink-2)]'
          }`}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  </>
);