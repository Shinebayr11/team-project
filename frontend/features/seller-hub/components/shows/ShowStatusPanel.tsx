"use client"

import React from 'react';
import { Radio } from 'lucide-react';
import { SellerShow } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { showTone, SHOW_STATUS_LABELS } from '../statusTones';
import { Panel } from '../DataCard';
import { btn } from "@/features/seller-hub/components/buttons"

interface ShowStatusPanelProps {
  show: SellerShow;
  onChangeStatus: (status: SellerShow['status']) => void;
  /** Жинхэнэ LiveKit шууд дамжуулалтын дэлгэц рүү аваачна. */
  onGoLive: () => void;
}

const dark = btn("ink", "block");
const outline = btn("outline", "block");
const live = 'w-full py-2.5 rounded-xl bg-[var(--wn-live-deep)] text-white text-[14px] font-[700] hover:bg-[var(--wn-live-deep-hover)] transition-colors flex items-center justify-center gap-2';

/**
 * Шууд дамжуулалтын төлөв.
 *
 * "Go Live Now" нь ӨМНӨ НЬ store доторх статусыг шууд `LIVE` болгодог байсан —
 * камер огт асаагүй атлаа шууд дамжуулалт нь LIVE харагддаг байв. Одоо энэ товч жинхэнэ
 * шууд дамжуулалтын дэлгэц рүү (`/seller/shows/start`) гарчиг, ангиллыг нь бэлдээд
 * аваачна. `LIVE` төлөв нь `useActiveStream()`-ээс ГАРГАЖ АВСАН утга тул энд
 * дуусгах товч байхгүй — шууд дамжуулалт нь шууд эфирийн дэлгэцээрээ дуусна.
 */
export const ShowStatusPanel: React.FC<ShowStatusPanelProps> = ({ show, onChangeStatus, onGoLive }) => {
  const isDraftOrScheduled = show.status === 'DRAFT' || show.status === 'SCHEDULED';

  return (
    <Panel title="Шууд дамжуулалтын төлөв" action={<StatusPill label={SHOW_STATUS_LABELS[show.status]} tone={showTone(show.status)} />}>
      <div className="flex flex-col gap-3">
        {show.status === 'DRAFT' && (
          <button onClick={() => onChangeStatus('SCHEDULED')} className={dark}>Шууд дамжуулалт товлох</button>
        )}

        {show.status === 'SCHEDULED' && (
          <>
            <button onClick={onGoLive} className={live}>
              <Radio className="w-4 h-4" /> Одоо дамжуулж эхлэх
            </button>
            <button onClick={() => onChangeStatus('DRAFT')} className={outline}>Ноорог болгох</button>
          </>
        )}

        {show.status === 'LIVE' && (
          <>
            <button onClick={onGoLive} className={live}>
              <Radio className="w-4 h-4" /> Шууд дамжуулалт руу буцах
            </button>
            <p className="text-[13px] font-[500] text-[var(--wn-admin-muted)] text-center">
              Шууд дамжуулалтаа шууд эфирийн дэлгэцээс дуусгана уу.
            </p>
          </>
        )}

        {isDraftOrScheduled && (
          <button
            onClick={() => onChangeStatus('CANCELLED')}
            className="w-full py-2.5 rounded-xl text-[var(--wn-live-deep)] text-[14px] font-[700] hover:bg-[var(--wn-live-soft)] transition-colors"
          >
            Шууд дамжуулалт цуцлах
          </button>
        )}
      </div>
    </Panel>
  );
};
