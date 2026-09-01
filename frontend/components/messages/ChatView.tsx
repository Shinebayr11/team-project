"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { ChatParticipant, participantName } from '@/hooks/useConversations';
import { ChatLine } from '@/hooks/useMessages';

interface ChatViewProps {
  other?: ChatParticipant;
  messages: ChatLine[];
  loading: boolean;
  onSend: (text: string) => Promise<{ ok: boolean; message?: string }>;
  onOpenShop: () => void;
}

const clockTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' });

export const ChatView: React.FC<ChatViewProps> = ({
  other,
  messages,
  loading,
  onSend,
  onOpenShop,
}) => {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const name = participantName(other);

  // Шинэ зурвас ирэх бүрд хамгийн доод тал руу гүйлгэнэ.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);
    const result = await onSend(text);
    if (result.ok) setInput('');
    else setError(result.message ?? 'Илгээж чадсангүй');
    setSending(false);
  };

  return (
    <>
      <div className="h-[72px] px-4 sm:px-6 gap-3 border-b border-[var(--wn-line)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onOpenShop}>
          <Avatar name={name} />
          <span className="text-[16px] font-[800] text-[var(--wn-ink)] group-hover:text-[var(--wn-accent)] transition-colors">
            {name}
          </span>
        </div>
        <button
          onClick={onOpenShop}
          className="px-4 py-2 rounded-full border border-[var(--wn-line-2)] text-[13px] font-[700] text-[var(--wn-ink)] hover:bg-[var(--wn-surface-2)] transition-colors"
        >
          Дэлгүүр үзэх
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
        {loading ? (
          <p className="text-[14px] text-[var(--wn-ink-3)]">Уншиж байна...</p>
        ) : messages.length === 0 ? (
          <p className="text-[14px] text-[var(--wn-ink-3)]">
            Одоогоор зурвас алга. Эхний зурвасаа бичээрэй.
          </p>
        ) : (
          messages.map(m => (
            <div
              key={m._id}
              className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[70%] ${m.mine ? 'self-end items-end' : 'self-start items-start'}`}
            >
              {/* URL, захиалгын дугаар мэт таслагдахгүй мөр бөмбөлгийг
                  тэсэлгэхээс сэргийлнэ. */}
              <div className={`px-4 py-2.5 rounded-[18px] text-[15px] leading-relaxed break-words ${
                m.mine
                  ? 'bg-[var(--wn-accent)] text-white rounded-br-[4px]'
                  : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)] rounded-bl-[4px]'
              }`}>
                {m.text}
              </div>
              <span className="text-[11px] font-[600] text-[var(--wn-ink-4)] mt-1 px-1">
                {clockTime(m.createdAt)}
              </span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-[var(--wn-line)]">
        <form onSubmit={handleSubmit} className="relative flex items-center w-full h-[48px] rounded-xl bg-[var(--wn-surface-2)] px-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Зурвас бичих..."
            aria-label="Зурвас"
            autoComplete="off"
            className="bg-transparent border-none outline-none w-full text-[15px] text-[var(--wn-ink)]"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="ml-2 text-[14px] font-[700] text-[var(--wn-accent)] disabled:opacity-50"
          >
            {sending ? '...' : 'Илгээх'}
          </button>
        </form>
        {error && <p className="mt-2 text-[12px] text-[var(--wn-live)]">{error}</p>}
      </div>
    </>
  );
};
