import { SellerOrder } from '@/features/seller-hub/types';

export const SEED_SELLER_ORDERS: SellerOrder[] = [
  {
    id: "#1041",
    buyerName: "kewpiepie_vintage",
    date: "2023-10-24T10:00:00Z",
    total: 223200,
    paymentStatus: "PAID",
    fulfillmentStatus: "PENDING",
    items: [
      { productId: "inv_1", name: "Nike Dunk Low 'Dusty Olive'", sku: "NK-DUNK-DO-10", price: 100000, qty: 2 },
      { productId: "inv_2", name: "Vintage Glass Vase", sku: "VG-VASE-01", price: 23200, qty: 1 }
    ],
    shippingAddress: {
      fullName: "Kewpie Pie",
      addressLine1: "123 Vintage Ln",
      city: "Portland",
      state: "OR",
      postalCode: "97204",
      country: "USA"
    }
  },
  {
    id: "#1040",
    buyerName: "sallysnow",
    date: "2023-10-23T14:30:00Z",
    total: 64800,
    paymentStatus: "PAID",
    fulfillmentStatus: "PROCESSING",
    items: [
      { productId: "inv_5", name: "Retro Arcade Console", sku: "ARC-RETRO-01", price: 64800, qty: 1 }
    ],
    shippingAddress: {
      fullName: "Sally Snow",
      addressLine1: "456 Winter Ave",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "USA"
    }
  },
  {
    id: "#1039",
    buyerName: "vintagecurator",
    date: "2023-10-22T09:15:00Z",
    total: 477000,
    paymentStatus: "PAID",
    fulfillmentStatus: "READY_TO_SHIP",
    items: [
      { productId: "inv_3", name: "Pokemon Booster Box", sku: "PKMN-BB-ES", price: 350000, qty: 1 },
      { productId: "inv_4", name: "Silver Flatware Set", sku: "SLV-FLAT-42", price: 127000, qty: 1 }
    ],
    shippingAddress: {
      fullName: "Vin Curator",
      addressLine1: "789 Collector Blvd",
      city: "Austin",
      state: "TX",
      postalCode: "73301",
      country: "USA"
    }
  },
  {
    id: "#1038",
    buyerName: "junglefinds",
    date: "2023-10-20T16:45:00Z",
    total: 147600,
    paymentStatus: "PAID",
    fulfillmentStatus: "SHIPPED",
    trackingNumber: "1Z9999999999999999",
    carrier: "UPS",
    items: [
      { productId: "inv_1", name: "Nike Dunk Low 'Dusty Olive'", sku: "NK-DUNK-DO-10", price: 147600, qty: 1 }
    ],
    shippingAddress: {
      fullName: "Jungle Finds",
      addressLine1: "321 Safari St",
      city: "Miami",
      state: "TX",
      postalCode: "33101",
      country: "USA"
    }
  },
  {
    id: "#1037",
    buyerName: "mysunroomchair",
    date: "2023-10-18T11:20:00Z",
    total: 99000,
    paymentStatus: "PAID",
    fulfillmentStatus: "DELIVERED",
    trackingNumber: "9400100000000000000000",
    carrier: "USPS",
    items: [
      { productId: "inv_2", name: "Vintage Glass Vase", sku: "VG-VASE-01", price: 99000, qty: 1 }
    ],
    shippingAddress: {
      fullName: "Sunroom Chair",
      addressLine1: "654 Sunny Rd",
      city: "San Diego",
      state: "FL",
      postalCode: "32101",
      country: "USA"
    }
  }
];

