import { StoreState, CartLine, Thread } from '../types';
import { InventoryProduct, SellerOrder, SellerShow } from '@/features/seller-hub/types';

export type StateUpdater = (updater: (prev: StoreState) => StoreState) => void;

export interface ModalState {
  type: 'buy' | 'bid' | 'wallet' | 'cart' | 'giveaway' | null;
  data?: any;
}

export interface ToastState {
  id: string;
  msg: string;
}

export interface WalletSlice {
  credits: () => number;
  creditsLabel: () => string;
  canAfford: (price: string | number) => boolean;
  topUp: (amount: number) => void;
  buy: (item: { title: string; seller: string; price: string; qty: number }) => boolean;
  bid: (item: { title: string; seller: string; amount: string }) => void;
}

export interface CartSlice {
  cart: () => CartLine[];
  cartCount: () => number;
  cartTotal: () => number;
  addToCart: (item: CartLine) => void;
  setCartQty: (index: number, qty: number) => void;
  removeFromCart: (index: number) => void;
  checkoutCart: () => boolean;
}

export interface SocialSlice {
  isFollowing: (slug: string) => boolean;
  toggleFollow: (slug: string) => void;
  followingCount: () => number;
}

export interface MessagesSlice {
  threads: () => Thread[];
  thread: (slug: string) => Thread | undefined;
  unread: () => number;
  markRead: (slug: string) => void;
  send: (slug: string, text: string) => void;
  ensureThread: (slug: string, initial?: string, tint?: string) => void;
}

export interface InventorySlice {
  addInventoryProduct: (product: Omit<InventoryProduct, 'id' | 'createdAt' | 'reservedQuantity' | 'soldQuantity'>) => void;
  updateInventoryProduct: (id: string, updates: Partial<InventoryProduct>) => void;
  deleteInventoryProduct: (id: string) => void;
  adjustStock: (id: string, type: 'add' | 'remove' | 'set', amount: number) => void;
  bulkAction: (ids: string[], action: 'archive' | 'delete' | 'activate' | 'draft') => void;
}

export interface OrdersSlice {
  updateSellerOrderStatus: (id: string, status: SellerOrder['fulfillmentStatus']) => void;
  setOrderTracking: (id: string, carrier: string, trackingNumber: string) => void;
}

export interface ShowsSlice {
  createSellerShow: (show: Omit<SellerShow, 'id' | 'createdAt' | 'products' | 'stats'>) => void;
  updateSellerShow: (id: string, updates: Partial<SellerShow>) => void;
  addShowProduct: (showId: string, inventoryId: string) => void;
  removeShowProduct: (showId: string, showProductId: string) => void;
  updateShowStatus: (showId: string, status: SellerShow['status']) => void;
}

export interface UiSlice {
  modal: ModalState;
  openModal: (type: ModalState['type'], data?: any) => void;
  closeModal: () => void;
  toasts: ToastState[];
  addToast: (msg: string) => void;
}

export type StoreContextType = { state: StoreState }
  & WalletSlice & CartSlice & SocialSlice & MessagesSlice
  & InventorySlice & OrdersSlice & ShowsSlice & UiSlice;
