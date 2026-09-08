"use client"

import { useMemo } from 'react';

import { useStore } from '@/store';
import { useMySales } from '@/hooks/useMySales';
import { useSellerShows } from './useSellerShows';

const LOW_STOCK_THRESHOLD = 5;

/**
 * Ерөнхий тоймын өгөгдөл — бүгд БОДИТ эх сурвалжаас.
 *
 * Өмнө нь энэ хуудас `data/seedOrders.ts`, `seedShows.ts` жишээ өгөгдлөөс
 * тоолдог байсан тул бодит орлого, бодит шууд дамжуулалттай ямар ч холбоогүй тоо
 * харуулдаг байв. Одоо:
 *   - орлого, зарагдсан лот → `/api/productlisting/sales`
 *   - шууд дамжуулалтын үзүүлэлт → `/api/liveshow/mine?stats=1`
 *   - нөөц → store дахь серверийн барааны кэш
 *
 * `Order` цуглуулга бодитоор бөглөгддөггүй тул "захиалга" гэсэн ойлгол энд
 * байхгүй: зарагдсан лот бүр худалдагчаас хүргэлт хүлээж буй нэгж юм.
 */
export const useSellerOverview = () => {
  const { state } = useStore();
  const { sales, loading: salesLoading } = useMySales();
  const { shows, loading: showsLoading } = useSellerShows();

  return useMemo(() => {
    const revenue = sales.reduce(
      (sum, sale) => sum + (sale.current_highest_bid_coins ?? 0),
      0
    );

    return {
      loading: salesLoading || showsLoading,
      /** Зарагдсан лотуудын нийлбэр — бодит орлого. */
      totalRevenue: revenue,
      /** Хүргэж өгөх хүлээгдэж буй лотууд. */
      pendingHandover: sales,
      lowStockItems: state.inventory.filter(
        i => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD
      ),
      outOfStockItems: state.inventory.filter(i => i.quantity === 0),
      recentShows: shows,
      lastShow: shows[0],
    };
  }, [sales, shows, state.inventory, salesLoading, showsLoading]);
};
