"use client"

import React, { useState } from 'react';
import { Skeleton, SkeletonRows, SkeletonScreen } from '@/components/ui/Skeleton';
import { ChevronRight } from 'lucide-react';
import { MyActiveBid, MyPurchase } from '@/hooks/useMyPurchases';
import { ProductThumb } from '@/components/ui/ProductThumb';
import { LiveDot } from '../ui/LiveDot';
import { PurchaseDetailSheet } from './PurchaseDetailSheet';

interface PurchasesTabProps {
  purchases: MyPurchase[];
  bids: MyActiveBid[];
  loading: boolean;
}

/** Жагсаалт урт болоход хуудас биш, өөрөө гүйнэ. */
const scrollList = 'flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1';

/**
 * Худалдан авалт — дуудлага худалдаагаар хожсон лотууд. Мөр дээр дарахад
 * дэлгэрэнгүй нь хажуугийн цонхоор гарч, тэндээсээ худалдагчтай холбогдоно.
 */
export const PurchasesTab: React.FC<PurchasesTabProps> = ({ purchases, bids, loading }) => {
  const [selected, setSelected] = useState<MyPurchase | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Худалдан авалт</h2>

      {loading ? (
        <SkeletonScreen className="flex flex-col gap-4">
          <Skeleton className="h-5 w-40" />
          <SkeletonRows rows={4} />
        </SkeletonScreen>
      ) : (
        <>
          {bids.length > 0 && (
            <div>
              <h3 className="text-[16px] font-[800] text-[var(--wn-ink)] mb-4">
                Идэвхтэй үнийн санал
              </h3>
              <div className={scrollList}>
                {bids.map(bid => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-[16px] bg-[var(--wn-surface-3)] border border-[var(--wn-line)]"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <ProductThumb product={bid.product} size={44} />
                      <div className="min-w-0">
                        <div className="truncate font-[700] text-[15px] text-[var(--wn-ink)]">
                          {bid.title}
                        </div>
                        <div className="text-[13px] text-[var(--wn-ink-3)] mt-0.5">{bid.seller}</div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <div className="text-[16px] font-[800] text-[var(--wn-ink)]">
                        ₮{bid.price.toLocaleString()}
                      </div>
                      {bid.leading ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-[var(--wn-live-soft)] px-3 py-1 text-[12px] font-[700] text-[var(--wn-live)]">
                          <LiveDot /> Тэргүүлж байна
                        </div>
                      ) : (
                        <div className="rounded-full bg-[var(--wn-surface-2)] px-3 py-1 text-[12px] font-[700] text-[var(--wn-ink-3)]">
                          Давуулагдсан
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-[16px] font-[800] text-[var(--wn-ink)] mb-4">
              Худалдан авалтын түүх
            </h3>
            {purchases.length > 0 ? (
              <div className={scrollList}>
                {purchases.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p)}
                    className="flex w-full items-center justify-between gap-4 p-4 rounded-[16px] border border-[var(--wn-line)] text-left transition-colors hover:border-[var(--wn-line-2)] hover:bg-[var(--wn-accent-wash)]"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <ProductThumb product={p.product} size={44} />
                      <div className="min-w-0">
                        <div className="truncate font-[700] text-[15px] text-[var(--wn-ink)]">
                          {p.title}
                        </div>
                        <div className="text-[13px] text-[var(--wn-ink-3)] mt-0.5">
                          {p.seller}
                          {p.date ? ` • ${new Date(p.date).toLocaleDateString()}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-[15px] font-[800] text-[var(--wn-ink)]">
                        ₮{p.price.toLocaleString()}
                      </div>
                      <ChevronRight className="size-4 text-[var(--wn-ink-4)]" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-[15px] font-[600] text-[var(--wn-ink-3)] border border-[var(--wn-line)] rounded-[16px]">
                Худалдан авалтын түүх алга байна.
              </div>
            )}
          </div>
        </>
      )}

      <PurchaseDetailSheet purchase={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
