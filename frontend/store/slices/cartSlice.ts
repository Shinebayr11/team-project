import { StoreState, CartLine } from '../../types';
import { StateUpdater, CartSlice, CheckoutSummary } from '../types';
import { makeId, parsePrice } from '../state';
import { ApiError } from '@/lib/api';

type ApiCaller = <T,>(path: string, options?: RequestInit) => Promise<T>;

const sumLines = (lines: CartLine[]) =>
  lines.reduce((acc, line) => acc + parsePrice(line.price) * line.qty, 0);

const lineKey = (line: CartLine) => `${line.seller}-${line.name}`;

export const createCartSlice = (
  state: StoreState,
  update: StateUpdater,
  callApi: ApiCaller,
): CartSlice => ({
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

  /**
   * Сагс нь өөр өөр худалдагчийн бараа агуулж болох тул нэг том транзакц
   * биш, мөр тус бүрийг бие даасан захиалга гэж үзнэ: зарим нь амжилттай,
   * зарим нь (жишээ нь нөөц дууссан) амжилтгүй байж болно. `productId`-тэй
   * мөр бодит `POST /api/order`-оор явна; хуучин (id-гүй) мөр локал mock
   * замаараа хэвээр явна.
   */
  checkoutCart: async () => {
    const lines = state.cart;
    if (lines.length === 0) return null;

    const realLines = lines.filter(l => l.productId);
    const mockLines = lines.filter(l => !l.productId);

    const failed: CheckoutSummary['failed'] = [];
    const succeededReal: CartLine[] = [];

    for (const line of realLines) {
      try {
        await callApi('/api/order', {
          method: 'POST',
          body: JSON.stringify({ product_id: line.productId, quantity: line.qty }),
        });
        succeededReal.push(line);
      } catch (error) {
        failed.push({
          line,
          message: error instanceof ApiError ? error.message : 'Захиалга үүсгэхэд алдаа гарлаа.',
        });
      }
    }

    const mockTotal = sumLines(mockLines);
    const mockAffordable = mockLines.length > 0 && state.credits >= mockTotal;
    const succeededMock = mockAffordable ? mockLines : [];
    if (mockLines.length > 0 && !mockAffordable) {
      mockLines.forEach(line => failed.push({ line, message: 'Үлдэгдэл хүрэлцэхгүй байна.' }));
    }

    const succeeded = [...succeededReal, ...succeededMock];
    const succeededKeys = new Set(succeeded.map(lineKey));

    update(s => ({
      ...s,
      credits: succeededMock.length > 0 ? s.credits - mockTotal : s.credits,
      cart: s.cart.filter(line => !succeededKeys.has(lineKey(line))),
      purchases: [
        ...succeeded.map(line => ({
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

    return { succeeded: succeeded.length, failed };
  },
});
