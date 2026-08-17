"use client"

import React from 'react';
import { Thread } from '../../types';
import { Avatar } from '../ui/Avatar';

interface ThreadListProps {
  threads: Thread[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}

export const ThreadList: React.FC<ThreadListProps> = ({ threads, activeSlug, onSelect }) => (
  <div className="w-[340px] shrink-0 border-r border-[var(--wn-line)] flex flex-col bg-[var(--wn-surface-4)]">
    <div className="p-5 border-b border-[var(--wn-line)] bg-white">
      <h1 className="text-[20px] font-[800] text-[var(--wn-ink)] tracking-tight">Messages</h1>
    </div>

    <div className="flex-1 overflow-y-auto">
      {threads.map(thread => {
        const lastMsg = thread.messages[thread.messages.length - 1];
        const isActive = thread.slug === activeSlug;

        return (
          <div
            key={thread.slug}
            onClick={() => onSelect(thread.slug)}
            className={`flex items-start gap-3 p-4 cursor-pointer border-b border-[var(--wn-line)] transition-colors ${
              isActive ? 'bg-white' : 'hover:bg-white/60'
            }`}
          >
            <Avatar name={thread.slug} initial={thread.initial} tint={thread.tint} size={48} />
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[15px] truncate ${thread.unread > 0 ? 'font-[800] text-[var(--wn-ink)]' : 'font-[700] text-[var(--wn-ink-2)]'}`}>
                  {thread.slug}
                </span>
                {lastMsg && <span className="text-[12px] text-[var(--wn-ink-4)] shrink-0 ml-2">{lastMsg.at}</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[14px] truncate ${thread.unread > 0 ? 'font-[600] text-[var(--wn-ink)]' : 'text-[var(--wn-ink-3)]'}`}>
                  {lastMsg ? (lastMsg.from === 'me' ? `You: ${lastMsg.text}` : lastMsg.text) : 'No messages yet'}
                </span>
                {thread.unread > 0 && <div className="w-2 h-2 rounded-full bg-[var(--wn-live)] shrink-0 ml-2" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);