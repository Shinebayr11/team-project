"use client"

import React from 'react';
import { Copy, X } from 'lucide-react';
import { LiveDot } from '../ui/LiveDot';

interface ReelMobileTopOverlayProps {
  viewers: number;
  shareUrl: string;
  onClose?: () => void;
}

export const ReelMobileTopOverlay: React.FC<ReelMobileTopOverlayProps> = ({
  viewers,
  shareUrl,
  onClose,
}) => (
  <>
    {/* Top scrim gradient — ensures text is readable over bright video */}
    <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-[11]" />

    {/* Live badge + viewer count (left) */}
    <div
      className="absolute left-3 z-20 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 text-white text-[12px] font-[600]"
      style={{ top: 'max(12px, env(safe-area-inset-top))' }}
    >
      <LiveDot className="w-2 h-2" />
      <span>Шууд</span>
      <span className="opacity-60 ml-1">{viewers} watching</span>
    </div>

    {/* Share/copy link + close buttons (right) */}
    <div
      className="absolute right-3 z-20 flex items-center gap-2"
      style={{ top: 'max(12px, env(safe-area-inset-top))' }}
    >
      <button
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
        }}
        className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        aria-label="Copy link"
      >
        <Copy className="w-4 h-4" />
      </button>
      {onClose && (
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  </>
);
