import { StoreState, CartLine } from '../../types';
import { StateUpdater, CartSlice } from '../types';
import { makeId, parsePrice } from '../state';

const sumLines = (lines: CartLine[]) =>
  lines.reduce((acc, line) => acc + parsePrice(line.price) * line.qty, 0);

export const createCartSlice = (state: StoreState, update: StateUpdater): CartSlice => ({
  cart: () => state.cart,
  cartCount: () => state.cart.reduce((acc, line) => acc + line.qty, 0),
  cartTotal: () => sumLines(state.cart),

  addToCart: (item) => {
    update(s => {
      const index = s.cart.findIndex(c => c.seller === item.seller && c.name === item.name);
      if (index < 0) return { ...s, cart: [...s.cart, item] };
      return {
        ...s,
        cart: s.cart.map((line, i) => i === index ? { ...line, qty: line.qty + item.qty } : line),
      };
    });
  },

  setCartQty: (index, qty) => {
    update(s => ({
      ...s,
      cart: qty <= 0
        ? s.cart.filter((_, i) => i !== index)
        : s.cart.map((line, i) => i === index ? { ...line, qty } : line),
    }));
  },

  removeFromCart: (index) => {
    update(s => ({ ...s, cart: s.cart.filter((_, i) => i !== index) }));
  },

  checkoutCart: () => {
    const total = sumLines(state.cart);
    if (state.cart.length === 0 || state.credits < total) return false;

    update(s => ({
      ...s,
      credits: s.credits - total,
      cart: [],
      purchases: [
        ...s.cart.map(line => ({
          id: makeId('buy_'),
          title: line.name,
          seller: line.seller,
          price: line.price,
          qty: line.qty,
          date: 'Just now',
          status: 'processing' as const,
        })),
        ...s.purchases,
      ],
    }));
    return true;
  },
});
