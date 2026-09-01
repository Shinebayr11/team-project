"use client"

import React, { useRef } from 'react';
import { ReelChatLine } from '../../types';

interface ReelMobileChatProps {
  lines: ReelChatLine[];
  hostName: string;
}

export const ReelMobileChat: React.FC<ReelMobileChatProps> = ({
  lines,
  hostName,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const recentLines = lines.slice(-6);

  return (
    <div
      className="absolute left-3 z-10 w-[70%] max-w-xs max-h-32 overflow-hidden pointer-events-none lg:hidden"
      style={{ bottom: 'calc(180px + max(12px, env(safe-area-inset-bottom)))' }}
      ref={scrollRef}
    >
      {/* Top mask gradient — fade out oldest messages */}
      <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-1 py-0">
        {recentLines.map((line, i) => (
          <div
            key={i}
            className="text-[12px] leading-snug break-words animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            <span
              className={`font-[700] mr-1 ${
                line.name === hostName
                  ? 'text-[var(--wn-accent)]'
                  : 'text-white'
              }`}
            >
              {line.name}
            </span>
            {line.mod && (
              <span className="px-1 py-0.5 rounded bg-white/30 text-white text-[8px] font-[800] uppercase mr-1 inline-block">
                Mod
              </span>
            )}
            <span className="text-white/90 drop-shadow-lg">{line.text}</span>
          </div>
        ))}
      </div>

      {/* Bottom mask gradient */}
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
    </div>
  );
};
