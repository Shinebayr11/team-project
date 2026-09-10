import { StateUpdater, OrdersSlice } from '@/store/types';

export const createOrdersSlice = (update: StateUpdater): OrdersSlice => ({
  updateSellerOrderStatus: (id, status) => {
    update(s => ({
      ...s,
      sellerOrders: s.sellerOrders.map(o => o.id === id ? { ...o, fulfillmentStatus: status } : o),
    }));
  },

  setOrderDelivery: (id, driverPhone, vehiclePlate) => {
    update(s => ({
      ...s,
      sellerOrders: s.sellerOrders.map(o =>
        o.id === id ? { ...o, driverPhone, vehiclePlate, fulfillmentStatus: 'SHIPPED' as const } : o
      ),
    }));
  },
});
