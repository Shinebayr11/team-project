"use client"

import React from 'react';
import { Radio } from 'lucide-react';
import { SellerShow } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { showTone, SHOW_STATUS_LABELS } from '../statusTones';
import { Panel } from '../DataCard';

interface ShowStatusPanelProps {
  show: SellerShow;
  onChangeStatus: (status: SellerShow['status']) => void;
  /** Жинхэнэ LiveKit дамжуулалтын дэлгэц рүү аваачна. */
  onGoLive: () => void;
}

const dark = 'w-full py-2.5 rounded-xl bg-black text-white text-[14px] font-[700] hover:bg-gray-800 transition-colors';
const outline = 'w-full py-2.5 rounded-xl border border-gray-300 text-black text-[14px] font-[700] hover:bg-gray-50 transition-colors';
const live = 'w-full py-2.5 rounded-xl bg-[var(--wn-live-deep)] text-white text-[14px] font-[700] hover:bg-[var(--wn-live)] transition-colors flex items-center justify-center gap-2';

/**
 * Лайвын төлөв.
 *
 * "Go Live Now" нь ӨМНӨ НЬ store доторх статусыг шууд `LIVE` болгодог байсан —
 * камер огт асаагүй атлаа лайв нь LIVE харагддаг байв. Одоо энэ товч жинхэнэ
 * дамжуулалтын дэлгэц рүү (`/seller/shows/start`) гарчиг, ангиллыг нь бэлдээд
 * аваачна. `LIVE` төлөв нь `useActiveStream()`-ээс ГАРГАЖ АВСАН утга тул энд
 * дуусгах товч байхгүй — лайв нь live консол дээрээ дуусна.
 */
export const ShowStatusPanel: React.FC<ShowStatusPanelProps> = ({ show, onChangeStatus, onGoLive }) => {
  const isDraftOrScheduled = show.status === 'DRAFT' || show.status === 'SCHEDULED';

  return (
    <Panel title="Лайвын төлөв" action={<StatusPill label={SHOW_STATUS_LABELS[show.status]} tone={showTone(show.status)} />}>
      <div className="flex flex-col gap-3">
        {show.status === 'DRAFT' && (
          <button onClick={() => onChangeStatus('SCHEDULED')} className={dark}>Лайв товлох</button>
        )}

        {show.status === 'SCHEDULED' && (
          <>
            <button onClick={onGoLive} className={live}>
              <Radio className="w-4 h-4" /> Одоо дамжуулж эхлэх
            </button>
            <button onClick={() => onChangeStatus('DRAFT')} className={outline}>Ноороглох руу буцаах</button>
          </>
        )}

        {show.status === 'LIVE' && (
          <>
            <button onClick={onGoLive} className={live}>
              <Radio className="w-4 h-4" /> Дамжуулалт руу буцах
            </button>
            <p className="text-[13px] font-[500] text-gray-500 text-center">
              Лайвыг дамжуулалтын консол дээрээс дуусгана уу.
            </p>
          </>
        )}

        {isDraftOrScheduled && (
          <button
            onClick={() => onChangeStatus('CANCELLED')}
            className="w-full py-2.5 rounded-xl text-[var(--wn-live-deep)] text-[14px] font-[700] hover:bg-[var(--wn-live-soft)] transition-colors"
          >
            Лайв цуцлах
          </button>
        )}
      </div>
    </Panel>
  );
};
