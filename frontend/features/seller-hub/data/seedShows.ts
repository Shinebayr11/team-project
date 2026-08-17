import { SellerShow } from '@/features/seller-hub/types';

export const SEED_SELLER_SHOWS: SellerShow[] = [
  {
    id: "show_1",
    title: "Thrifted Glass & Vintage Finds",
    description: "Huge drop of vintage glass and pottery.",
    category: "Vintage Decor",
    status: "SCHEDULED",
    type: "mixed",
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    products: [
      { id: "sp_1", inventoryId: "inv_2", name: "Vintage Glass Vase", sku: "VG-VASE-01", type: "auction", price: 45000, quantity: 1, position: 1 }
    ],
    reminders: 128,
    stats: { viewers: 0, sales: 0, revenue: 0 },
    createdAt: new Date().toISOString()
  },
  {
    id: "show_2",
    title: "Milk Glass Mega Drop",
    description: "All milk glass, all night.",
    category: "Vintage Decor",
    status: "COMPLETED",
    type: "buy_it_now",
    scheduledAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    products: [],
    stats: { viewers: 1240, peakViewers: 1500, sales: 31, revenue: 1397500, orders: 28 },
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: "show_3",
    title: "Weekend Sneaker Heat",
    description: "Rare dunks and Jordans.",
    category: "Sneakers",
    status: "SCHEDULED",
    type: "auction",
    scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    products: [
      { id: "sp_2", inventoryId: "inv_1", name: "Nike Dunk Low 'Dusty Olive'", sku: "NK-DUNK-DO-10", type: "auction", price: 100000, quantity: 2, position: 1 }
    ],
    reminders: 45,
    stats: { viewers: 0, sales: 0, revenue: 0 },
    createdAt: new Date().toISOString()
  }
];

