"use client"

import React, { useState } from 'react';
import { Thread } from '../../types';
import { Avatar } from '../ui/Avatar';

interface ChatViewProps {
  thread: Thread;
  onSend: (text: string) => void;
  onOpenShop: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ thread, onSend, onOpenShop }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <>
      <div className="h-[72px] px-6 border-b border-[var(--wn-line)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onOpenShop}>
          <Avatar name={thread.slug} initial={thread.initial} tint={thread.tint} />
          <span className="text-[16px] font-[800] text-[var(--wn-ink)] group-hover:text-[var(--wn-accent)] transition-colors">
            {thread.slug}
          </span>
        </div>
        <button
          onClick={onOpenShop}
          className="px-4 py-2 rounded-full border border-[var(--wn-line-2)] text-[13px] font-[700] text-[var(--wn-ink)] hover:bg-[var(--wn-surface-2)] transition-colors"
        >
          View shop
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {thread.messages.map((m, i) => (
          <div key={i} className={`flex flex-col max-w-[70%] ${m.from === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`px-4 py-2.5 rounded-[18px] text-[15px] leading-relaxed ${
              m.from === 'me'
                ? 'bg-[var(--wn-accent)] text-white rounded-br-[4px]'
                : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)] rounded-bl-[4px]'
            }`}>
              {m.text}
            </div>
            <span className="text-[11px] font-[600] text-[var(--wn-ink-4)] mt-1 px-1">{m.at}</span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--wn-line)]">
        <form onSubmit={handleSubmit} className="relative flex items-center w-full h-[48px] rounded-xl bg-[var(--wn-surface-2)] px-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message..."
            aria-label="Message"
            className="bg-transparent border-none outline-none w-full text-[15px] text-[var(--wn-ink)]"
          />
          <button type="submit" disabled={!input.trim()} className="ml-2 text-[14px] font-[700] text-[var(--wn-accent)] disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </>
  );
};