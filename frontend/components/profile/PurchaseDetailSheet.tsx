"use client"

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Sheet, SheetBody, SheetFooter, SheetHeader } from '@/components/ui/sheet';
import { MyPurchase } from '@/hooks/useMyPurchases';

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 border-b border-[var(--wn-line)] py-3 last:border-b-0">
    <span className="shrink-0 text-[13px] font-[600] text-[var(--wn-ink-3)]">{label}</span>
    <span className="min-w-0 text-right text-[14px] font-[700] text-[var(--wn-ink)]">
      {children}
    </span>
  </div>
);

/**
 * Худалдан авалтын дэлгэрэнгүй. Хожсон лотын мэдээлэл болон худалдагчтай
 * холбогдох зам — хүргэлт, төлбөрөө тохирох цорын ганц суваг нь чат.
 */
export const PurchaseDetailSheet: React.FC<{
  purchase: MyPurchase | null;
  onClose: () => void;
}> = ({ purchase, onClose }) => (
  <Sheet open={!!purchase} onOpenChange={(open) => !open && onClose()} wide>
    {purchase && (
      <>
        <SheetHeader eyebrow="Худалдан авалт" title={purchase.title} />

        <SheetBody>
          {purchase.product?.images?.[0] && (
            // Vercel Blob-ийн хаяг тул next/image-ийн домэйн тохиргоо шаардахгүй.
            <img
              src={purchase.product.images[0]}
              alt={purchase.title}
              className="mb-4 aspect-square w-full rounded-2xl border border-[var(--wn-line)] object-cover"
            />
          )}

          {purchase.description && (
            <p className="mb-4 text-[14px] leading-relaxed text-[var(--wn-ink-2)]">
              {purchase.description}
            </p>
          )}

          <Row label="Худалдагч">{purchase.seller}</Row>
          <Row label="Төлсөн дүн">₮{purchase.price.toLocaleString()}</Row>
          {purchase.showTitle && <Row label="Шууд дамжуулалт">{purchase.showTitle}</Row>}
          {purchase.date && (
            <Row label="Хожсон огноо">{new Date(purchase.date).toLocaleString()}</Row>
          )}
          <Row label="Төлөв">Худалдагчтай тохирох</Row>
        </SheetBody>

        <SheetFooter>
          {purchase.sellerId ? (
            <a
              href={`/messages?user=${purchase.sellerId}`}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--wn-ink)] text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-ink-2)]"
            >
              <MessageSquare className="size-4" /> Худалдагчтай холбогдох
            </a>
          ) : (
            <p className="pb-2 text-center text-[13px] font-[600] text-[var(--wn-ink-3)]">
              Худалдагчийн мэдээлэл олдсонгүй.
            </p>
          )}
        </SheetFooter>
      </>
    )}
  </Sheet>
);
