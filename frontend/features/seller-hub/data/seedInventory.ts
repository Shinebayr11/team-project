import { InventoryProduct } from '@/features/seller-hub/types';

export const SEED_INVENTORY: InventoryProduct[] = [
  {
    id: "inv_1",
    name: "Nike Dunk Low 'Dusty Olive'",
    sku: "NK-DUNK-DO-10",
    category: "Sneakers",
    description: "First debuted in 1985, Nike's Dunk Low silhouette was originally designed as a college basketball silhouette...",
    price: 100000,
    quantity: 5,
    reservedQuantity: 1,
    soldQuantity: 12,
    status: "ACTIVE",
    listingType: "buy_it_now",
    condition: "New",
    createdAt: "2023-10-01T10:00:00Z"
  },
  {
    id: "inv_2",
    name: "Vintage Glass Vase",
    sku: "VG-VASE-01",
    category: "Vintage Decor",
    description: "Beautiful mid-century glass vase in excellent condition.",
    price: 45000,
    quantity: 1,
    reservedQuantity: 0,
    soldQuantity: 0,
    status: "DRAFT",
    listingType: "auction",
    condition: "Used - Excellent",
    createdAt: "2023-10-05T14:30:00Z"
  },
  {
    id: "inv_3",
    name: "Pokemon Booster Box",
    sku: "PKMN-BB-ES",
    category: "Trading Cards",
    description: "Sealed Evolving Skies booster box.",
    price: 350000,
    quantity: 10,
    reservedQuantity: 2,
    soldQuantity: 45,
    status: "ACTIVE",
    listingType: "buy_it_now",
    condition: "New",
    createdAt: "2023-09-15T09:15:00Z"
  },
  {
    id: "inv_4",
    name: "Silver Flatware Set",
    sku: "SLV-FLAT-42",
    category: "Estate Sales",
    description: "42 piece sterling silver flatware set.",
    price: 120000,
    quantity: 0,
    reservedQuantity: 0,
    soldQuantity: 1,
    status: "OUT_OF_STOCK",
    listingType: "auction",
    condition: "Used - Good",
    createdAt: "2023-08-20T11:45:00Z"
  },
  {
    id: "inv_5",
    name: "Retro Arcade Console",
    sku: "ARC-RETRO-01",
    category: "Electronics",
    description: "Mini retro arcade console with 100+ games.",
    price: 85000,
    quantity: 0,
    reservedQuantity: 0,
    soldQuantity: 5,
    status: "OUT_OF_STOCK",
    listingType: "buy_it_now",
    condition: "New",
    createdAt: "2023-10-10T16:20:00Z"
  }
];

