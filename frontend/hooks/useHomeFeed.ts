"use client"

import { useEffect, useMemo, useRef, useState } from 'react';
import { HomeShow } from '../types';
import { HOME_SHOWS } from '../data';

const PAGE_SIZE = 8;
const INITIAL_COUNT = 12;

const matchesQuery = (show: HomeShow, term: string) =>
  show.title.toLowerCase().includes(term) ||
  show.seller.toLowerCase().includes(term) ||
  show.category.toLowerCase().includes(term) ||
  show.tags.toLowerCase().includes(term);

/**
 * Home feed state: the browse view groups by category, while search or a picked
 * category switches to a flat, infinitely-scrolled list.
 */
export const useHomeFeed = (query: string, category: string) => {
  const isBrowsing = !query && category === 'For You';
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const loaderRef = useRef<HTMLDivElement>(null);

  const hottestShow = useMemo(
    () => [...HOME_SHOWS].filter(s => s.live).sort((a, b) => (b.live || 0) - (a.live || 0))[0],
    [],
  );

  const filteredShows = useMemo(() => {
    if (query) {
      const term = query.toLowerCase();
      return HOME_SHOWS.filter(s => matchesQuery(s, term));
    }
    if (category !== 'For You') return HOME_SHOWS.filter(s => s.category === category);
    return HOME_SHOWS;
  }, [query, category]);

  const groupedShows = useMemo(() => {
    if (!isBrowsing) return {};
    return HOME_SHOWS.reduce<Record<string, HomeShow[]>>((groups, show) => {
      (groups[show.category] ??= []).push(show);
      return groups;
    }, {});
  }, [isBrowsing]);

  // Reset paging whenever the query or category changes.
  useEffect(() => { setVisibleCount(INITIAL_COUNT); }, [query, category]);

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
  }, [isBrowsing, query, category]);

  return {
    isBrowsing,
    hottestShow,
    groupedShows,
    filteredShows,
    displayShows: isBrowsing ? [] : filteredShows.slice(0, visibleCount),
    hasMore: filteredShows.length > visibleCount,
    loaderRef,
  };
};