import { StoreState } from '../../types';
import { StateUpdater, WalletSlice } from '../types';
import { makeId, parsePrice } from '../state';

export const createWalletSlice = (state: StoreState, update: StateUpdater): WalletSlice => ({
  credits: () => state.credits,
  creditsLabel: () => state.credits.toLocaleString(),

  canAfford: (price) => state.credits >= parsePrice(price),

  topUp: (amount) => {
    if (amount <= 0) return;
    update(s => ({ ...s, credits: s.credits + amount }));
  },

  buy: ({ title, seller, price, qty }) => {
    const total = parsePrice(price) * qty;
    if (state.credits < total) return false;

    update(s => ({
      ...s,
      credits: s.credits - total,
      purchases: [
        { id: makeId('buy_'), title, seller, price, qty, date: 'Just now', status: 'processing' },
        ...s.purchases,
      ],
    }));
    return true;
  },

  bid: ({ title, seller, amount }) => {
    update(s => ({
      ...s,
      bids: [
        { id: makeId('bid_'), title, seller, amount, date: 'Just now', status: 'leading' },
        ...s.bids.filter(b => b.title !== title || b.seller !== seller),
      ],
    }));
  },
});
