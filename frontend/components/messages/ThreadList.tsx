"use client"

import React from 'react';
import { Avatar } from '../ui/Avatar';
import { ConversationSummary, participantName } from '@/hooks/useConversations';

interface ThreadListProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
}

/** "5 мин өмнө" маягийн товч хугацаа. */
const shortTime = (iso: string | null) => {
  if (!iso) return '';
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return 'сая';
  if (diffMin < 60) return `${diffMin}м`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}ц`;
  return `${Math.floor(diffHour / 24)}ө`;
};

export const ThreadList: React.FC<ThreadListProps> = ({
  conversations,
  activeId,
  loading,
  onSelect,
}) => (
  <div className="w-[340px] shrink-0 border-r border-[var(--wn-line)] flex flex-col bg-[var(--wn-surface-4)]">
    <div className="p-5 border-b border-[var(--wn-line)] bg-white">
      <h1 className="text-[20px] font-[800] text-[var(--wn-ink)] tracking-tight">Зурвас</h1>
    </div>

    <div className="flex-1 overflow-y-auto">
      {loading ? (
        <p className="p-4 text-[14px] text-[var(--wn-ink-3)]">Уншиж байна...</p>
      ) : conversations.length === 0 ? (
        <p className="p-4 text-[14px] text-[var(--wn-ink-3)]">
          Одоогоор яриа алга. Аукцион хожсоны дараа худалдагчтайгаа энд холбогдоно.
        </p>
      ) : (
        conversations.map(conversation => {
          const name = participantName(conversation.other);
          const isActive = conversation._id === activeId;
          const unread = conversation.unread > 0;

          return (
            <div
              key={conversation._id}
              onClick={() => onSelect(conversation._id)}
              className={`flex items-start gap-3 p-4 cursor-pointer border-b border-[var(--wn-line)] transition-colors ${
                isActive ? 'bg-white' : 'hover:bg-white/60'
              }`}
            >
              <Avatar name={name} size={48} />
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[15px] truncate ${unread ? 'font-[800] text-[var(--wn-ink)]' : 'font-[700] text-[var(--wn-ink-2)]'}`}>
                    {name}
                  </span>
                  <span className="text-[12px] text-[var(--wn-ink-4)] shrink-0 ml-2">
                    {shortTime(conversation.last_message_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[14px] truncate ${unread ? 'font-[600] text-[var(--wn-ink)]' : 'text-[var(--wn-ink-3)]'}`}>
                    {conversation.last_message_text ?? 'Зурвас алга'}
                  </span>
                  {unread && <div className="w-2 h-2 rounded-full bg-[var(--wn-live)] shrink-0 ml-2" />}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);
