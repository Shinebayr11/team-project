import { StoreState } from '../types';
import { SEED_CREDITS, SEED_FOLLOWING, SEED_PURCHASES, SEED_THREADS } from '../data';
import { SEED_INVENTORY } from '@/features/seller-hub/data/seedInventory';
import { SEED_SELLER_ORDERS } from '@/features/seller-hub/data/seedOrders';
import { SEED_SELLER_SHOWS } from '@/features/seller-hub/data/seedShows';

export const STORAGE_KEY = 'whynot_store';

export const defaultState: StoreState = {
  credits: SEED_CREDITS,
  following: SEED_FOLLOWING,
  purchases: SEED_PURCHASES,
  bids: [],
  cart: [],
  threads: SEED_THREADS,
  inventory: SEED_INVENTORY,
  sellerOrders: SEED_SELLER_ORDERS,
  sellerShows: SEED_SELLER_SHOWS,
};

/**
 * Payloads written before the Seller Hub rename used adminOrders/adminShows.
 * Reading both keys means an existing browser keeps its seller data instead of
 * silently snapping back to the seed.
 */
type PersistedState = Partial<StoreState> & {
  adminOrders?: StoreState['sellerOrders'];
  adminShows?: StoreState['sellerShows'];
};

const pickArray = <T,>(...candidates: (T[] | undefined)[]): T[] | undefined =>
  candidates.find(Array.isArray);

/** Merge persisted state per slice so a partial/stale payload can't blank a key. */
export const loadState = (): StoreState => {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (!saved) return defaultState;

  try {
    const parsed = JSON.parse(saved) as PersistedState;
    return {
      credits: typeof parsed.credits === 'number' ? parsed.credits : defaultState.credits,
      following: parsed.following ?? defaultState.following,
      purchases: Array.isArray(parsed.purchases) ? parsed.purchases : defaultState.purchases,
      bids: Array.isArray(parsed.bids) ? parsed.bids : defaultState.bids,
      cart: Array.isArray(parsed.cart) ? parsed.cart : defaultState.cart,
      threads: Array.isArray(parsed.threads) ? parsed.threads : defaultState.threads,
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : defaultState.inventory,
      sellerOrders: pickArray(parsed.sellerOrders, parsed.adminOrders) ?? defaultState.sellerOrders,
      sellerShows: pickArray(parsed.sellerShows, parsed.adminShows) ?? defaultState.sellerShows,
    };
  } catch {
    return defaultState;
  }
};

export const persistState = (state: StoreState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode — persistence is best-effort */
  }
};

/** Short random id, prefixed so ids stay readable in devtools. */
export const makeId = (prefix = '') =>
  `${prefix}${Math.random().toString(36).slice(2, 9)}`;

/** "1,240" | 1240 -> 1240. Returns 0 for unparseable input. */
export const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return Number.isFinite(price) ? price : 0;
  const n = parseInt(String(price).replace(/,/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
};
