"use client"

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ReelNavRailProps {
  count: number;
  currentIndex: number;
  onGoTo: (index: number) => void;
}

const arrowClass = 'w-6 h-6 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors disabled:opacity-30';

export const ReelNavRail: React.FC<ReelNavRailProps> = ({ count, currentIndex, onGoTo }) => (
  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
    <button
      onClick={() => onGoTo(currentIndex - 1)}
      disabled={currentIndex === 0}
      aria-label="Previous show"
      className={arrowClass}
    >
      <ChevronUp className="w-4 h-4" />
    </button>

    <div className="flex flex-col gap-1.5 py-1">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-300 ${
            i === currentIndex ? 'h-5 bg-[var(--wn-accent)]' : 'h-1.5 bg-white/40'
          }`}
        />
      ))}
    </div>

    <button
      onClick={() => onGoTo(currentIndex + 1)}
      disabled={currentIndex === count - 1}
      aria-label="Next show"
      className={arrowClass}
    >
      <ChevronDown className="w-4 h-4" />
    </button>
  </div>
);