"use client"

import { useMemo } from 'react';
import { StoreState } from '@/types';
import { AuctionSale, saleProduct, saleWinner, useMySales, winnerName } from '@/hooks/useMySales';
import {
  DirectOrder,
  orderBuyer,
  orderBuyerName,
  orderProduct,
  useMySellerOrders,
} from '@/hooks/useMySellerOrders';

export type DateRange = '7d' | '30d' | '90d';
export type ChartMetric = 'revenue' | 'orders' | 'items';

export interface ChartPoint {
  name: string;
  time: number;
  revenue: number;
  orders: number;
  items: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  sold: number;
  revenue: number;
}

/** Дуудлага худалдаа, шууд захиалга, хуучин mock захиалга — гурвыг нэг хэлбэрт оруулна. */
interface NormalizedOrder {
  date: string;
  total: number;
  buyerName: string;
  items: { productId: string; name: string; price: number; qty: number }[];
}

const RANGE_DAYS: Record<DateRange, number> = { '7d': 7, '30d': 30, '90d': 90 };
const LOW_STOCK_THRESHOLD = 5;
const TOP_PRODUCT_LIMIT = 5;

const fromSale = (sale: AuctionSale): NormalizedOrder | null => {
  const product = saleProduct(sale);
  if (!product || !sale.updatedAt) return null;
  const total = sale.current_highest_bid_coins ?? 0;
  return {
    date: sale.updatedAt,
    total,
    buyerName: winnerName(saleWinner(sale)),
    items: [{ productId: product._id, name: product.name, price: total, qty: 1 }],
  };
};

const fromOrder = (order: DirectOrder): NormalizedOrder | null => {
  const product = orderProduct(order);
  const date = order.createdAt ?? order.updatedAt;
  if (!product || !date) return null;
  const total = order.price_coins ?? 0;
  const qty = order.quantity;
  return {
    date,
    total,
    buyerName: orderBuyerName(orderBuyer(order)),
    items: [{ productId: product._id, name: product.name, price: qty > 0 ? total / qty : total, qty }],
  };
};

export const useSellerAnalytics = (state: StoreState, range: DateRange) => {
  // Дуудлага худалдааны борлуулалт болон "Худалдаж авах" товчоор шууд
  // зарагдсан захиалга — хоёулаа бодит backend өгөгдөл. Хуучин
  // `state.sellerOrders` (mock seed) хэвээр орлого тооцоололд нэмэгдэнэ,
  // гэхдээ цорын ганц эх сурвалж биш болно.
  const { sales } = useMySales();
  const { orders } = useMySellerOrders();

  return useMemo(() => {
    const cutoff = Date.now() - RANGE_DAYS[range] * 86_400_000;

    const mockOrders: NormalizedOrder[] = state.sellerOrders
      .filter(o => o.paymentStatus === 'PAID')
      .map(o => ({ date: o.date, total: o.total, buyerName: o.buyerName, items: o.items }));

    const realOrders: NormalizedOrder[] = [
      ...sales.map(fromSale),
      ...orders.map(fromOrder),
    ].filter((o): o is NormalizedOrder => o !== null);

    const paidOrders = [...mockOrders, ...realOrders].filter(
      o => new Date(o.date).getTime() >= cutoff,
    );

    const grossSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const itemsSold = paidOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
    const uniqueBuyers = new Set(paidOrders.map(o => o.buyerName)).size;

    const chartByDay = new Map<string, ChartPoint>();
    paidOrders.forEach(order => {
      const date = new Date(order.date);
      const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const point = chartByDay.get(key)
        ?? { name: key, time: date.getTime(), revenue: 0, orders: 0, items: 0 };

      point.revenue += order.total;
      point.orders += 1;
      point.items += order.items.reduce((s, i) => s + i.qty, 0);
      chartByDay.set(key, point);
    });

    const productTotals = new Map<string, TopProduct>();
    paidOrders.forEach(order => {
      order.items.forEach(item => {
        const entry = productTotals.get(item.productId)
          ?? { productId: item.productId, name: item.name, sold: 0, revenue: 0 };
        entry.sold += item.qty;
        entry.revenue += item.price * item.qty;
        productTotals.set(item.productId, entry);
      });
    });

    const inventoryOnHand = state.inventory.reduce((sum, i) => sum + i.quantity, 0);
    const inventorySold = state.inventory.reduce((sum, i) => sum + i.soldQuantity, 0);
    const inventoryTotal = inventoryOnHand + inventorySold;

    return {
      grossSales,
      totalOrders: paidOrders.length,
      itemsSold,
      aov: paidOrders.length > 0 ? Math.round(grossSales / paidOrders.length) : 0,
      uniqueBuyers,
      avgSpend: uniqueBuyers > 0 ? Math.round(grossSales / uniqueBuyers) : 0,
      chartData: [...chartByDay.values()].sort((a, b) => a.time - b.time),
      topProducts: [...productTotals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, TOP_PRODUCT_LIMIT),
      completedShows: state.sellerShows
        .filter(s => s.status === 'COMPLETED')
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
        .slice(0, TOP_PRODUCT_LIMIT),
      sellThrough: inventoryTotal > 0 ? Math.round((inventorySold / inventoryTotal) * 100) : 0,
      lowStockCount: state.inventory.filter(i => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD).length,
      outOfStockCount: state.inventory.filter(i => i.quantity === 0).length,
    };
  }, [state, range, sales, orders]);
};
