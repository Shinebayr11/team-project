"use client"

import React from 'react';
import { Video } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useSellerProfile } from '@/hooks/useSellerProfile';
import { SellerShow } from '@/features/seller-hub/types';
import { PRODUCT_CATEGORY_LABELS } from '../products/productDraft';
import { SHOW_TYPES, shortWhen } from './showSchedule';

interface ShowPreviewProps {
  title: string;
  category: string;
  type: SellerShow['type'];
  /** Хүчингүй огноо ирвэл цагийн тэмдэг харагдахгүй. */
  when: Date | null;
}

/**
 * Худалдан авагчийн талын карт. Маягтын хажууд бодит цагийн урьдчилсан
 * харагдац болж явна.
 *
 * Бүтэц нь `components/cards/ShowCard` болон `components/explore/UpcomingShows`
 * ХОЁРТОЙ ижил байх ёстой — аватар, 3/4 хавтас, зүүн дээд буланд цаг, доор нь
 * гарчиг, ангилал. Тэр хоёрыг өөрчлөх бол энийг хамт өөрчил, эс тэгвээс
 * урьдчилсан харагдац худал болно.
 */
export const ShowPreview: React.FC<ShowPreviewProps> = ({ title, category, type, when }) => {
  const { profile } = useSellerProfile();
  const shopName = profile?.storeName ?? 'Таны дэлгүүр';
  const typeLabel = SHOW_TYPES.find(t => t.value === type)?.label;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[13px] font-[800] uppercase tracking-wider text-[var(--wn-admin-muted)]">
        Худалдан авагчид ингэж харагдана
      </h2>

      <div className="rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Avatar name={shopName} size={26} tint="var(--wn-accent-soft)" className="!text-[var(--wn-accent)]" />
          <span className="truncate text-[13.5px] font-[700] text-[var(--wn-ink)]">{shopName}</span>
        </div>

        <div className="relative mt-3 aspect-[3/4] w-full overflow-hidden rounded-[16px] bg-[var(--wn-shot)]">
          {when && (
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-[700] text-[var(--wn-ink)] backdrop-blur-md">
              {shortWhen(when)}
            </div>
          )}

          {/* Хавтасны зураг нь эфирт орсны дараа л гарна — `useLiveThumbnail`
              дамжуулалтын явцад хөтчөөс нь авдаг. Урьдчилж зураг сонгодоггүй
              тул энд хоосон гэж хэлэх нь үнэн. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <Video className="h-6 w-6 text-white/40" />
            <span className="text-[12px] font-[600] leading-relaxed text-white/50">
              Хавтасны зураг эфирт орсны дараа автоматаар гарна
            </span>
          </div>
        </div>

        <h3 className="mt-3 text-[15px] font-[700] leading-tight text-[var(--wn-ink)]">
          {title.trim() || <span className="text-[var(--wn-ink-4)]">Нэргүй дамжуулалт</span>}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-[13px]">
          <span className="font-[600] text-[var(--wn-accent)]">
            {PRODUCT_CATEGORY_LABELS[category] ?? category}
          </span>
          {typeLabel && (
            <>
              <span className="text-[var(--wn-ink-4)]">•</span>
              <span className="truncate text-[var(--wn-ink-3)]">{typeLabel}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
