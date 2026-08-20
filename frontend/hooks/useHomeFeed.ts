"use client"

import { useEffect, useMemo, useRef, useState } from 'react';
import { HomeShow } from '../types';
import { useLiveShows } from './useLiveShows';

const PAGE_SIZE = 8;
const INITIAL_COUNT = 12;

const matchesQuery = (show: HomeShow, term: string) =>
  show.title.toLowerCase().includes(term) ||
  show.seller.toLowerCase().includes(term) ||
  show.category.toLowerCase().includes(term) ||
  show.tags.toLowerCase().includes(term);

export type StatusFilter = 'Live now' | 'Starting soon' | 'Most watched' | null;

/**
 * Home feed state: the browse view groups by category, while search or a picked
 * category switches to a flat, infinitely-scrolled list.
 */
export const useHomeFeed = (query: string, category: string, statusFilter: StatusFilter = null) => {
  const { shows: allShows, loading, error } = useLiveShows();
  const shows = useMemo(() => {
    if (statusFilter === 'Live now') return allShows.filter(s => s.live !== undefined);
    if (statusFilter === 'Starting soon') return allShows.filter(s => s.live === undefined);
    return allShows;
  }, [allShows, statusFilter]);
  const isBrowsing = !query && category === 'For You' && !statusFilter;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const loaderRef = useRef<HTMLDivElement>(null);

  const hottestShow = useMemo(() => {
    const liveShows = shows.filter(s => s.live !== undefined);
    if (!liveShows.length) return undefined;
    // A real seller broadcast (has a LiveKit room) always outranks a
    // decorative/demo card so the front-page spotlight never gets stuck on
    // filler content while someone is actually live.
    const real = liveShows.filter(s => s.roomId);
    const pool = real.length ? real : liveShows;
    return [...pool].sort((a, b) => (b.live ?? 0) - (a.live ?? 0))[0];
  }, [shows]);

  const filteredShows = useMemo(() => {
    if (query) {
      const term = query.toLowerCase();
      return shows.filter(s => matchesQuery(s, term));
    }
    if (category !== 'For You') return shows.filter(s => s.category === category);
    return shows;
  }, [query, category, shows]);

  const groupedShows = useMemo(() => {
    if (!isBrowsing) return {};
    return shows.reduce<Record<string, HomeShow[]>>((groups, show) => {
      (groups[show.category] ??= []).push(show);
      return groups;
    }, {});
  }, [isBrowsing, shows]);

  // Reset paging whenever the query, category, or status filter changes.
  useEffect(() => { setVisibleCount(INITIAL_COUNT); }, [query, category, statusFilter]);

  useEffect(() => {
    if (isBrowsing) return;
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisibleCount(prev => prev + PAGE_SIZE); },
      { threshold: 0.1, rootMargin: '400px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isBrowsing, query, category, statusFilter]);

  return {
    isBrowsing,
    hottestShow,
    groupedShows,
    filteredShows,
    displayShows: isBrowsing ? [] : filteredShows.slice(0, visibleCount),
    hasMore: filteredShows.length > visibleCount,
    loaderRef,
    loading,
    error,
  };
};