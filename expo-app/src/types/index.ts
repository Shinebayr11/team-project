/**
 * Domain types for the Live Auction mobile app.
 *
 * These mirror the models that already exist in `server/src/models/`
 * (see ARCHITECTURE.md §9). They are intentionally minimal and type-only —
 * no mock data, no business logic. Fields will be tightened once each
 * backend route is mounted and its real response shape is confirmed.
 *
 * Source of truth: server/src/models/*.ts
 */

export type ID = string;

export interface User {
  id: ID;
  clerkUserId: string;
  role: 'buyer' | 'seller' | 'admin';
  displayName: string;
  avatarUrl?: string;
  shopName?: string;
}

export interface Category {
  id: ID;
  name: string;
}

export interface Product {
  id: ID;
  name: string;
  description?: string;
  categoryId: ID;
  images: string[];
}

export interface ProductListing {
  id: ID;
  productId: ID;
  sellerId: ID;
  startingPrice: number;
  currentPrice: number;
}

export type LiveShowStatus = 'upcoming' | 'live' | 'ended';

export interface LiveShow {
  id: ID;
  sellerId: ID;
  title: string;
  status: LiveShowStatus;
  roomName: string;
  startsAt: string;
  endsAt?: string;
}

export interface ShowProduct {
  id: ID;
  liveShowId: ID;
  listingId: ID;
}

export interface Bid {
  id: ID;
  listingId: ID;
  buyerId: ID;
  amountCoins: number;
  createdAt: string;
}

export interface Order {
  id: ID;
  buyerId: ID;
  listingId: ID;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  totalCoins: number;
}

export interface Wallet {
  id: ID;
  userId: ID;
  balanceCoins: number;
}

export interface CoinTransaction {
  id: ID;
  walletId: ID;
  amountCoins: number;
  type: 'topup' | 'bid_hold' | 'bid_release' | 'purchase' | 'refund';
}
