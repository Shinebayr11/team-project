"use client"

import { useMemo } from 'react';

import { useStore } from '@/store';
import { useMySellerOrders } from '@/hooks/useMySellerOrders';
import { useSellerShows } from './useSellerShows';

const LOW_STOCK_THRESHOLD = 5;

/** Ерөнхий тоймын мөнгөн дүн хэдэн хоногийг хамрах вэ. Аналитикийн үндсэн харагдацтай ижил. */
const RANGE_DAYS = 30;

/**
 * Худалдагчаас хийх ажил үлдсэн захиалгууд.
 *
 * Хажуугийн цэсийн тоо (`SellerHubLayout`) ба ерөнхий тоймын карт ХОЁУЛАА
 * үүнийг ашиглана — тус тусдаа жагсаалт барьвал нэг дэлгэц дээр хоёр өөр тоо
 * харагдана.
 */
export const OPEN_FULFILLMENT = ["PENDING", "CONFIRMED"];

/**
 * Ерөнхий тоймын өгөгдөл — бүгд БОДИТ эх сурвалжаас.
 *
 * Орлого, хүргэлт нь `useMySellerOrders`-оос ирнэ (`GET /api/order/seller`).
 * Өмнө нь эдгээр нь дуудлага худалдааны лотоос бодогддог байсан бөгөөд тэр үед
 * `Order` цуглуулга бөглөгддөггүй байлаа: үүнээс болж захиалгатай мөртлөө
 * орлого нь ₮0 харагдаж, хажуугийн цэсний тоотой зөрдөг байв.
 */
export const useSellerOverview = () => {
  const { state } = useStore();
  const { orders, loading: ordersLoading } = useMySellerOrders();
  const { shows, loading: showsLoading } = useSellerShows();

  return useMemo(() => {
    const cutoff = Date.now() - RANGE_DAYS * 86_400_000;

    const recent = orders.filter(
      o => new Date(o.createdAt ?? o.updatedAt ?? 0).getTime() >= cutoff
    );
    const revenue = recent.reduce((sum, o) => sum + (o.price_coins ?? 0), 0);

    // Хугацаагаар хязгаарлахгүй: сарын өмнөх илгээгээгүй захиалга ч гэсэн
    // хүргэгдээгүй хэвээр бөгөөд жагсаалтаас алга болох ёсгүй.
    const open = orders.filter(o =>
      OPEN_FULFILLMENT.includes(o.fulfillment_status ?? 'PENDING')
    );

    return {
      loading: ordersLoading || showsLoading,
      totalRevenue: revenue,
      pendingHandoverCount: open.length,
      lowStockItems: state.inventory.filter(
        i => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD
      ),
      outOfStockItems: state.inventory.filter(i => i.quantity === 0),
      recentShows: shows,
      lastShow: shows[0],
    };
  }, [orders, shows, state.inventory, ordersLoading, showsLoading]);
};
