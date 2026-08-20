"use client"

import React, { useEffect, useRef, useState } from 'react';
import { ReelChatLine } from '../../types';
import { LiveDot } from '../ui/LiveDot';

interface ChatPanelProps {
  lines: ReelChatLine[];
  viewers: number;
  hostName: string;
  onSend: (text: string) => void;
  /** Replaces the input with a prompt — used when a visitor must sign in first. */
  lockedNotice?: React.ReactNode;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ lines, viewers, hostName, onSend, lockedNotice }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="w-[280px] shrink-0 flex flex-col h-full bg-white rounded-[20px] border border-[var(--wn-line)] overflow-hidden">
      <div className="p-3 border-b border-[var(--wn-line)] flex items-center justify-between">
        <h2 className="text-[14px] font-[800] text-[var(--wn-ink)]">Chat</h2>
        <div className="flex items-center gap-1.5 text-[12px] font-[600] text-[var(--wn-ink-3)]">
          <LiveDot /> {viewers}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scroll-smooth">
        {lines.map((line, i) => (
          <div key={i} className="text-[13px] leading-snug">
            <span className={`font-[700] mr-1.5 ${line.name === hostName ? 'text-[var(--wn-accent)]' : 'text-[var(--wn-ink-2)]'}`}>
              {line.name}
            </span>
            {line.mod && (
              <span className="px-1 py-0.5 rounded bg-[var(--wn-surface-2)] text-[var(--wn-ink-4)] text-[9px] font-[800] uppercase mr-1.5">Mod</span>
            )}
            <span className="text-[var(--wn-ink)]">{line.text}</span>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-[var(--wn-line)] bg-[var(--wn-surface-4)]">
        {lockedNotice ?? (
          <form onSubmit={handleSubmit} className="relative flex items-center w-full h-[36px] rounded-xl bg-white border border-[var(--wn-line)] px-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Say something..."
              aria-label="Chat message"
              className="bg-transparent border-none outline-none w-full text-[13px] text-[var(--wn-ink)]"
            />
          </form>
        )}
      </div>
    </div>
  );
};