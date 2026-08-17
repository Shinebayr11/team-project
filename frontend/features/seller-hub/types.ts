// Seller-hub records: inventory, orders and scheduled shows.
export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'OUT_OF_STOCK';
  listingType: 'buy_it_now' | 'auction';
  condition: string;
  createdAt: string;
}

export interface SellerOrder {
  id: string;
  buyerName: string;
  date: string;
  total: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  fulfillmentStatus: 'PENDING' | 'PROCESSING' | 'READY_TO_SHIP' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  items: {
    productId: string;
    name: string;
    sku: string;
    price: number;
    qty: number;
  }[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  carrier?: string;
  labelUrl?: string;
}

export interface ShowProduct {
  id: string;
  inventoryId: string;
  name: string;
  sku: string;
  type: 'auction' | 'buy_it_now';
  price: number;
  quantity: number;
  position: number;
}

export interface SellerShow {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'DRAFT' | 'SCHEDULED' | 'STARTING_SOON' | 'LIVE' | 'ENDING' | 'COMPLETED' | 'CANCELLED';
  type: 'auction' | 'buy_it_now' | 'mixed';
  scheduledAt: string;
  products: ShowProduct[];
  reminders?: number;
  stats: {
    viewers: number;
    peakViewers?: number;
    sales: number;
    revenue: number;
    orders?: number;
  };
  createdAt: string;
}

