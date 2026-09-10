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

export interface CheckoutSummary {
  succeeded: number;
  failed: { line: CartLine; message: string }[];
}

export interface CartSlice {
  cart: () => CartLine[];
  cartCount: () => number;
  cartTotal: () => number;
  addToCart: (item: CartLine) => void;
  setCartQty: (index: number, qty: number) => void;
  removeFromCart: (index: number) => void;
  /** `null` — сагс хоосон байсан тул юу ч хийгээгүй. */
  checkoutCart: () => Promise<CheckoutSummary | null>;
}

export interface SocialSlice {
  /**
   * Browse (`/live-show`) болон дэлгүүрийн хуудас mock худалдагчаар (SELLERS,
   * REEL_SHOWS) ажилладаг тул бодит хэрэглэгчийн id байхгүй — тэдгээр нь
   * localStorage-д нэрээр нь тэмдэглэсээр байна. Бодит худалдагчтай газарт
   * `hooks/useFollow.ts` серверийн `User.following`-ыг ашиглана.
   */
  isFollowing: (slug: string) => boolean;
  toggleFollow: (slug: string) => void;
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
  /** Серверээс уншсан бараагаар кэшийг бүхэлд нь солино. */
  setInventory: (products: InventoryProduct[]) => void;
}

export interface OrdersSlice {
  updateSellerOrderStatus: (id: string, status: SellerOrder['fulfillmentStatus']) => void;
  setOrderDelivery: (id: string, driverPhone: string, vehiclePlate: string) => void;
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
