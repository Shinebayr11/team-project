import { Purchase, Bid, CartLine } from './commerce';
import { Thread } from './messaging';
// The Seller Hub owns these records; the global state just composes them in.
import { InventoryProduct, SellerOrder, SellerShow } from '@/features/seller-hub/types';

export interface StoreState {
  credits: number;
  following: Record<string, boolean>;
  purchases: Purchase[];
  bids: Bid[];
  cart: CartLine[];
  threads: Thread[];
  inventory: InventoryProduct[];
  sellerOrders: SellerOrder[];
  sellerShows: SellerShow[];
}
