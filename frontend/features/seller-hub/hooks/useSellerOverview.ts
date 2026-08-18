"use client"

import { useEffect, useMemo, useState } from 'react';
import { StoreState } from '@/types';
import { SellerShow, InventoryProduct } from '@/features/seller-hub/types';

const CLOCK_MS = 60_000;
const LOW_STOCK_THRESHOLD = 5;
const OPEN_FULFILLMENT = ['PENDING', 'PROCESSING', 'READY_TO_SHIP'];

const byScheduledAsc = (a: SellerShow, b: SellerShow) =>
  new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();

/** Blocking problems that stop a scheduled show from going live. */
const findShowIssues = (show: SellerShow, inventory: InventoryProduct[]): string[] => {
  const linked = show.products
    .map(sp => inventory.find(i => i.id === sp.inventoryId))
    .filter((i): i is InventoryProduct => Boolean(i));

  const issues: string[] = [];
  if (show.products.length === 0) issues.push('No products assigned');

  const outOfStock = linked.filter(i => i.quantity === 0).length;
  if (outOfStock > 0) issues.push(`${outOfStock} products out of stock`);

  const drafts = linked.filter(i => i.status === 'DRAFT').length;
  if (drafts > 0) issues.push(`${drafts} products are drafts`);

  return issues;
};

export const formatCountdown = (dateString: string, now: number): string => {
  const diff = new Date(dateString).getTime() - now;
  if (diff <= 0) return 'Starting now';

  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hours > 24) return `Starts in ${Math.floor(hours / 24)} days`;
  if (hours > 0) return `Starts in ${hours}h ${mins}m`;
  return `Starts in ${mins}m`;
};

export const useSellerOverview = (state: StoreState) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CLOCK_MS);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    const paidOrders = state.sellerOrders.filter(o => o.paymentStatus === 'PAID');
    const ordersToFulfill = state.sellerOrders.filter(o => OPEN_FULFILLMENT.includes(o.fulfillmentStatus));

    const upcomingShows = state.sellerShows
      .filter(s => s.status === 'SCHEDULED' || s.status === 'STARTING_SOON')
      .sort(byScheduledAsc);

    const recentShows = state.sellerShows
      .filter(s => s.status === 'COMPLETED')
      .sort((a, b) => byScheduledAsc(b, a));

    const nextShow = upcomingShows[0];
    const nextShowIssues = nextShow ? findShowIssues(nextShow, state.inventory) : [];

    return {
      now,
      totalRevenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
      ordersToFulfill,
      pendingValue: ordersToFulfill.reduce((sum, o) => sum + o.total, 0),
      lowStockItems: state.inventory.filter(i => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD),
      outOfStockItems: state.inventory.filter(i => i.quantity === 0),
      liveShow: state.sellerShows.find(s => s.status === 'LIVE'),
      nextShow,
      nextShowIssues,
      nextShowReady: Boolean(nextShow) && nextShowIssues.length === 0,
      upcomingShows,
      recentShows,
      lastShow: recentShows[0],
    };
  }, [state, now]);
};