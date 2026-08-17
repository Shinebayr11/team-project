"use client"

import { useMemo } from 'react';
import { HomeShow } from '../types';
import { HOME_SHOWS, SELLERS } from '../data';

export interface TrendingProduct {
  name: string;
  price: string;
  seller: string;
}

const TRENDING_LIMIT = 8;

/** Fisher-Yates with a fixed seed so the "trending" order is stable across renders. */
const shuffle = <T,>(items: T[], seed = 7): T[] => {
  const out = [...items];
  let state = seed;
  for (let i = out.length - 1; i > 0; i--) {
    state = (state * 1103515245 + 12345) % 2147483648;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const matches = (show: HomeShow, term: string) =>
  show.title.toLowerCase().includes(term) ||
  show.seller.toLowerCase().includes(term) ||
  show.category.toLowerCase().includes(term);

export const useExploreFeed = (query: string) => {
  const term = query.trim().toLowerCase();

  const allTrending = useMemo<TrendingProduct[]>(() => {
    const products = Object.entries(SELLERS).flatMap(([slug, seller]) =>
      seller.products
        .slice(0, 2)
        .filter(p => p.tag === 'Buy now')
        .map(p => ({ name: p.name, price: p.price, seller: slug })),
    );
    return shuffle(products).slice(0, TRENDING_LIMIT);
  }, []);

  return useMemo(() => {
    const pool = term ? HOME_SHOWS.filter(s => matches(s, term)) : HOME_SHOWS;
    const live = pool.filter(s => s.live).sort((a, b) => (b.live || 0) - (a.live || 0));

    return {
      liveShows: live,
      recommendedShows: live,
      upcomingShows: pool.filter(s => !s.live),
      trendingProducts: term
        ? allTrending.filter(p => p.name.toLowerCase().includes(term) || p.seller.toLowerCase().includes(term))
        : allTrending,
    };
  }, [term, allTrending]);
};