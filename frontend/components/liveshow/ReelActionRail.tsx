"use client"

import React from 'react';
import { ShoppingBag, MessageCircle, Heart, ShoppingCart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReelActionRailProps {
  itemCount: number;
  cartCount: number;
  onShop: () => void;
  onChatToggle: () => void;
  onLike?: () => void;
  onCart?: () => void;
  onShare?: () => void;
  /** Байрлал солих. `static` өгвөл урсгал дотор сууж, доорх `bottom` үйлчлэхгүй
   *  (`live-viewer.tsx` чатын хажууд ингэж байрлуулдаг). */
  className?: string;
}

export const ReelActionRail: React.FC<ReelActionRailProps> = ({
  itemCount,
  cartCount,
  onShop,
  onChatToggle,
  onLike,
  onCart,
  onShare,
  className,
}) => (
  <div
    className={cn("absolute right-3 z-20 flex flex-col items-center gap-3 lg:hidden", className)}
    style={{ bottom: 'calc(115px + max(12px, env(safe-area-inset-bottom)))' }}
  >
    {/* Shop */}
    <button
      onClick={onShop}
      className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white hover:bg-black/60 transition-colors"
      aria-label="Дэлгүүр"
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="text-[8px] font-[700] mt-0.5">{itemCount}</span>
      )}
    </button>

    {/* Chat toggle */}
    <button
      onClick={onChatToggle}
      className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      aria-label="Чат нээх/хаах"
    >
      <MessageCircle className="w-5 h-5" />
    </button>

    {/* Like */}
    {onLike && (
      <button
        onClick={onLike}
        className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        aria-label="Таалагдсан"
      >
        <Heart className="w-5 h-5" />
      </button>
    )}

    {/* Cart */}
    {onCart && (
      <button
        onClick={onCart}
        className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white hover:bg-black/60 transition-colors"
        aria-label="Сагс"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="text-[8px] font-[700] mt-0.5">{cartCount}</span>
        )}
      </button>
    )}

    {/* Share */}
    {onShare && (
      <button
        onClick={onShare}
        className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        aria-label="Хуваалцах"
      >
        <Share2 className="w-5 h-5" />
      </button>
    )}
  </div>
);
