import { StateUpdater, OrdersSlice } from '@/store/types';

export const createOrdersSlice = (update: StateUpdater): OrdersSlice => ({
  updateSellerOrderStatus: (id, status) => {
    update(s => ({
      ...s,
      sellerOrders: s.sellerOrders.map(o => o.id === id ? { ...o, fulfillmentStatus: status } : o),
    }));
  },

  setOrderTracking: (id, carrier, trackingNumber) => {
    update(s => ({
      ...s,
      sellerOrders: s.sellerOrders.map(o =>
        o.id === id ? { ...o, carrier, trackingNumber, fulfillmentStatus: 'SHIPPED' as const } : o
      ),
    }));
  },
});
