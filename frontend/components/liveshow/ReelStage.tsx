"use client"

import React, { useEffect, useRef } from 'react';
import { ReelShow } from '../../types';
import { ReelItemBar } from './ReelItemBar';
import { ReelNavRail } from './ReelNavRail';

interface ReelStageProps {
  shows: ReelShow[];
  currentIndex: number;
  countdown: number;
  viewers: number;
  showScrollHint: boolean;
  onWheel: (deltaY: number) => void;
  onGoTo: (index: number) => void;
  onItemAction: (show: ReelShow) => void;
}

export const ReelStage: React.FC<ReelStageProps> = ({
  shows, currentIndex, countdown, viewers, showScrollHint, onWheel, onGoTo, onItemAction,
}) => {
  // Гар утсан дээр гүйлгэлтийг хөтөч өөрөө (snap scroll) хийдэг тул хуруугаар
  // гүйлгэхэд `onWheel` огт дуудагддаггүй. Иймд идэвхтэй шоуг гүйлгэлтийн
  // байрлалаас нь уншиж, overlay-ууд (Buy/Bid, чат, худалдагч) үзэж буй шоутай
  // нь тааруулна — эс тэгвэл тэдгээр нь shows[0] дээр гацна.
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const indexFromScroll = (el: HTMLDivElement) =>
    el.clientHeight > 0 ? Math.round(el.scrollTop / el.clientHeight) : 0;

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const next = indexFromScroll(e.currentTarget);
    if (next !== currentIndex && next >= 0 && next < shows.length) onGoTo(next);
  };

  // Гаднаас индекс өөрчлөгдсөн үед (deep link, эсвэл desktop-ийн nav rail)
  // гүйлгэлтийн байрлалыг гүйцээнэ. Хэрэглэгч өөрөө гүйлгэсэн тохиолдолд
  // байрлал аль хэдийн таарсан байх тул энэ нь юу ч хийхгүй өнгөрнө.
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el || indexFromScroll(el) === currentIndex) return;
    el.scrollTo({ top: currentIndex * el.clientHeight, behavior: 'smooth' });
  }, [currentIndex]);

  return (
  <>
    {/* Desktop layout (lg and above) */}
    <div
      className="hidden lg:flex flex-1 h-full relative rounded-[20px] overflow-hidden bg-[var(--wn-shot-deep)]"
      onWheel={e => onWheel(e.deltaY)}
    >
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-[580ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translate3d(0, -${currentIndex * 100}%, 0)` }}
      >
        {shows.map((show, i) => (
          <div key={show.slug} className="w-full h-full relative bg-[var(--wn-shot)]">
            {show.thumbnail && (
              <img src={show.thumbnail} alt={show.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
            )}

            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[12px] font-[600] z-10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Шууд</span>
              <span className="opacity-60 ml-1">{i === currentIndex ? viewers : show.viewers} watching</span>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button className="px-3 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center gap-2 text-white text-[12px] font-[600] hover:bg-black/60 transition-colors">
                whynot.live/{show.slug}
              </button>
            </div>

            <ReelItemBar
              item={show.item}
              seconds={i === currentIndex ? countdown : show.item.seconds}
              onAction={() => onItemAction(show)}
            />
          </div>
        ))}
      </div>

      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-1000 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}>
        <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-[13px] font-[600]">
          Scroll for the next live
        </div>
      </div>

      <ReelNavRail count={shows.length} currentIndex={currentIndex} onGoTo={onGoTo} />
    </div>

    {/* Mobile layout (below lg) — full screen with snap scrolling.
        Гүйлгэлтийг хөтөч өөрөө хийдэг тул `onWheel` энд хэрэггүй — хулганы дугуй
        ч мөн адил төрөлх гүйлгэлт үүсгэж, `onScroll`-оор баригдана. */}
    <div
      ref={mobileScrollRef}
      className="lg:hidden w-screen fixed inset-0 overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ height: '100dvh', maxHeight: '100dvh' }}
      onScroll={handleMobileScroll}
    >
      {shows.map((show, i) => (
        <div
          key={show.slug}
          className="w-screen relative bg-[var(--wn-shot)] shrink-0 snap-start"
          style={{ height: '100dvh' }}
        >
          {show.thumbnail && (
            <img
              src={show.thumbnail}
              alt={show.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {i === currentIndex && (
            <ReelItemBar
              item={show.item}
              seconds={countdown}
              onAction={() => onItemAction(show)}
            />
          )}
        </div>
      ))}
    </div>
  </>
  );
};