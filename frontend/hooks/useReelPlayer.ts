"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import { ReelChatLine, ReelShow } from '../types';

const SCROLL_LOCK_MS = 720;
const CHAT_INTERVAL_MS = 2800;
const TICK_MS = 1000;
const BID_RESET_SECONDS = 45;
const MIN_VIEWERS = 120;

/** Drives the reel: which show is on screen, its countdown, viewer drift and chat feed. */
export const useReelPlayer = (shows: ReelShow[], startIndex: number) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [countdown, setCountdown] = useState(shows[startIndex].item.seconds);
  const [viewers, setViewers] = useState(shows[startIndex].viewers);
  const [chatLines, setChatLines] = useState<ReelChatLine[]>([]);

  const scrollLock = useRef(false);
  const chatCursor = useRef(0);

  const currentShow = shows[currentIndex];

  useEffect(() => {
    setCountdown(currentShow.item.seconds);
    setViewers(currentShow.viewers);
    setChatLines([]);
    chatCursor.current = 0;
  }, [currentShow]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentShow.item.mode === 'bid') {
        setCountdown(c => (c <= 0 ? BID_RESET_SECONDS : c - 1));
      }
      setViewers(v => Math.max(MIN_VIEWERS, v + Math.round((Math.random() - 0.45) * 5)));
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [currentShow]);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = currentShow.chat[chatCursor.current];
      if (!next) return;
      chatCursor.current += 1;
      setChatLines(prev => [...prev, next]);
    }, CHAT_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [currentShow]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.min(shows.length - 1, Math.max(0, index)));
  }, [shows.length]);

  const handleWheel = useCallback((deltaY: number) => {
    if (scrollLock.current || Math.abs(deltaY) <= 50) return;
    const next = currentIndex + (deltaY > 0 ? 1 : -1);
    if (next < 0 || next > shows.length - 1) return;

    scrollLock.current = true;
    setCurrentIndex(next);
    setTimeout(() => { scrollLock.current = false; }, SCROLL_LOCK_MS);
  }, [currentIndex, shows.length]);

  const pushChatLine = useCallback((line: ReelChatLine) => {
    setChatLines(prev => [...prev, line]);
  }, []);

  return { currentIndex, currentShow, countdown, viewers, chatLines, goTo, handleWheel, pushChatLine };
};