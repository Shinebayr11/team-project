"use client"

import { useMemo } from 'react';

import { useStore } from '@/store';
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
export const OPEN_FULFILLMENT = ["PENDING", "PROCESSING", "READY_TO_SHIP"];

/**
 * Ерөнхий тоймын өгөгдөл — бүгд БОДИТ эх сурвалжаас.
 *
 * Орлого, хүргэлт нь `state.sellerOrders`-оос ирнэ. Тэр нь `/api/order/mine`-аар
 * серверээс уншигдаж, зөвхөн нэвтэрсэн худалдагчийн захиалгыг агуулна.
 *
 * Өмнө нь эдгээр нь дуудлага худалдааны лотоос (`/api/productlisting/sales`)
 * бодогддог байсан: тэр үед `Order` цуглуулга бөглөгддөггүй байлаа. Үүнээс болж
 * захиалгатай мөртлөө орлого нь ₮0 харагдаж, хажуугийн цэсний тоотой зөрдөг байв.
 *
 * Лотыг энд НЭМЖ тооцохгүй: хажуугийн цэс болон "Захиалга" дэлгэц нь зөвхөн
 * захиалгыг харуулдаг тул нэмбэл нэг дэлгэц дээр дахин хоёр өөр тоо гарна.
 * Лотын дүн нь эфир тус бүрийн мөрөнд (`recentShows`) харагдана.
 *
 * ЦООРХОЙ: аукционоор зарагдсан лот нь `Order` үүсгэдэггүй тул эдгээр карт
 * дуудлага худалдааны орлогыг тоохгүй. Лот хаагдахдаа захиалга үүсгэдэг
 * болбол энэ нь өөрөө зөв болно.
 */
export const useSellerOverview = () => {
  const { state } = useStore();
  const { shows, loading: showsLoading } = useSellerShows();

  return useMemo(() => {
    const cutoff = Date.now() - RANGE_DAYS * 86_400_000;

    const paidOrders = state.sellerOrders.filter(
      o => o.paymentStatus === 'PAID' && new Date(o.date).getTime() >= cutoff
    );
    const orderRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    // Хугацаагаар хязгаарлахгүй: сарын өмнөх илгээгээгүй захиалга ч гэсэн
    // хүргэгдээгүй хэвээр бөгөөд жагсаалтаас алга болох ёсгүй.
    const openOrders = state.sellerOrders.filter(o =>
      OPEN_FULFILLMENT.includes(o.fulfillmentStatus)
    );

    return {
      loading: showsLoading,
      /** Сүүлийн 30 хоногийн төлөгдсөн захиалгын нийлбэр — Аналитиктай ижил тоо. */
      totalRevenue: orderRevenue,
      /** Худалдагчаас хийх ажил үлдсэн захиалга — хажуугийн цэсний тоотой ижил. */
      pendingHandoverCount: openOrders.length,
      lowStockItems: state.inventory.filter(
        i => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD
      ),
      outOfStockItems: state.inventory.filter(i => i.quantity === 0),
      recentShows: shows,
      lastShow: shows[0],
    };
  }, [shows, state.sellerOrders, state.inventory, showsLoading]);
};
