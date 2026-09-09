"use client"

import React, { useState } from 'react';
import { Package } from 'lucide-react';

/**
 * Барааны зургууд. Өмнө нь энэ нь 5 ХООСОН бараан дөрвөлжин зурдаг, шошгыг нь
 * статик demo өгөгдлөөс авдаг байв — одоо худалдагчийн байршуулсан жинхэнэ
 * зургуудыг харуулна.
 */
export const ProductGallery: React.FC<{ images: string[]; name: string }> = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-[var(--wn-shot)]">
        {current ? (
          // Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо шаардахгүй.
          <img src={current} alt={name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-white/40">
            <Package className="size-7" />
            <span className="text-[13px] font-[600]">Зураг оруулаагүй</span>
          </div>
        )}
      </div>

      {/* Ганц зурагтай бол сонгох зүйл байхгүй тул мөр нь огт гарахгүй. */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-4">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1}-р зураг`}
              aria-pressed={i === active}
              className={`aspect-square flex-1 overflow-hidden rounded-[12px] border-2 bg-[var(--wn-shot)] transition-colors ${
                i === active ? 'border-[var(--wn-accent)]' : 'border-transparent hover:border-[var(--wn-line-3)]'
              }`}
            >
              <img src={url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
