"use client"

import { useCallback, useEffect, useMemo, useState } from 'react';
import { HomeShow } from '../types';
import { useApiClient } from './useApiClient';
import { useLiveShows } from './useLiveShows';

/** Серверийн эрэлттэй бараа — `soldCount` нь бодит борлуулалтын тоо. */
export interface TrendingProduct {
  _id: string;
  name: string;
  price_coins?: number;
  images?: string[];
  soldCount: number;
  seller?: { _id?: string; display_name?: string; shop_name?: string };
}

const TRENDING_LIMIT = 8;

const matches = (show: HomeShow, term: string) =>
  show.title.toLowerCase().includes(term) ||
  show.seller.toLowerCase().includes(term) ||
  show.category.toLowerCase().includes(term);

const sellerNameOf = (product: TrendingProduct) =>
  product.seller?.shop_name || product.seller?.display_name || 'Худалдагч';

export const useExploreFeed = (query: string) => {
  const term = query.trim().toLowerCase();
  const { shows, loading, error } = useLiveShows();
  const { callApi } = useApiClient();
  const [allTrending, setAllTrending] = useState<TrendingProduct[]>([]);

  // Эрэлттэй бараа нь дуудлага худалдаагаар хэдэн удаа зарагдсанаас
  // тооцогдоно — жагсаалт нэвтрэлт шаардахгүй, нийтэд нээлттэй.
  const loadTrending = useCallback(async () => {
    const { products } = await callApi<{ products: TrendingProduct[] }>(
      `/api/product/trending?limit=${TRENDING_LIMIT}`
    );
    setAllTrending(products);
  }, [callApi]);

  useEffect(() => {
    let cancelled = false;
    loadTrending().catch(error => {
      if (!cancelled) console.error('Эрэлттэй бараа уншиж чадсангүй:', error);
    });
    return () => {
      cancelled = true;
    };
  }, [loadTrending]);

  const result = useMemo(() => {
    const pool = term ? shows.filter(s => matches(s, term)) : shows;
    const live = pool.filter(s => s.live).sort((a, b) => (b.live || 0) - (a.live || 0));

    return {
      liveShows: live,
      recommendedShows: live,
      upcomingShows: pool.filter(s => !s.live),
      trendingProducts: term
        ? allTrending.filter(
            p =>
              p.name.toLowerCase().includes(term) ||
              sellerNameOf(p).toLowerCase().includes(term)
          )
        : allTrending,
    };
  }, [term, allTrending, shows]);

  return { ...result, loading, error };
};