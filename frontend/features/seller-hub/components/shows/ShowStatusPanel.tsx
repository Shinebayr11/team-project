"use client"

import React from 'react';
import { Play } from 'lucide-react';
import { SellerShow } from '@/features/seller-hub/types';
import { StatusPill } from '../StatusPill';
import { showTone } from '../statusTones';
import { Panel } from '../DataCard';

interface ShowStatusPanelProps {
  show: SellerShow;
  onChangeStatus: (status: SellerShow['status']) => void;
}

const dark = 'w-full py-2.5 rounded-xl bg-black text-white text-[14px] font-[700] hover:bg-gray-800 transition-colors';
const outline = 'w-full py-2.5 rounded-xl border border-gray-300 text-black text-[14px] font-[700] hover:bg-gray-50 transition-colors';

export const ShowStatusPanel: React.FC<ShowStatusPanelProps> = ({ show, onChangeStatus }) => {
  const isDraftOrScheduled = show.status === 'DRAFT' || show.status === 'SCHEDULED';

  return (
    <Panel title="Show Status" action={<StatusPill label={show.status} tone={showTone(show.status)} />}>
      <div className="flex flex-col gap-3">
        {show.status === 'DRAFT' && (
          <button onClick={() => onChangeStatus('SCHEDULED')} className={dark}>Schedule Show</button>
        )}

        {show.status === 'SCHEDULED' && (
          <>
            <button
              onClick={() => onChangeStatus('LIVE')}
              className="w-full py-2.5 rounded-xl bg-[#E5484D] text-white text-[14px] font-[700] hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" /> Go Live Now
            </button>
            <button onClick={() => onChangeStatus('DRAFT')} className={outline}>Revert to Draft</button>
          </>
        )}

        {show.status === 'LIVE' && (
          <button onClick={() => onChangeStatus('COMPLETED')} className={dark}>End Show</button>
        )}

        {isDraftOrScheduled && (
          <button
            onClick={() => onChangeStatus('CANCELLED')}
            className="w-full py-2.5 rounded-xl text-red-600 text-[14px] font-[700] hover:bg-red-50 transition-colors"
          >
            Cancel Show
          </button>
        )}
      </div>
    </Panel>
  );
};