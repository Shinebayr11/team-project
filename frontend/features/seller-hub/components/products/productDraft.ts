import { InventoryProduct } from '@/features/seller-hub/types';
import type { SellerSettings } from '@/types/seller';

export interface ProductDraft {
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  condition: string;
  listingType: InventoryProduct['listingType'];
  acceptOffers: boolean;
  images: string[];
  /**
   * Дуудлага худалдааны үргэлжлэх хугацаа секундээр. `listingType` нь
   * `auction` үед л хэрэглэгдэнэ.
   */
  auctionDurationSeconds: number;
}

/**
 * Дуудлага худалдааны хугацааны сонголт. Yahoo Auctions маягаар хоногоор
 * үргэлжилдэг ч, шуурхай зарах хүнд цагийн сонголт бас хэрэгтэй.
 */
export const AUCTION_DURATIONS: { seconds: number; label: string }[] = [
  { seconds: 60 * 60, label: '1 цаг' },
  { seconds: 6 * 60 * 60, label: '6 цаг' },
  { seconds: 12 * 60 * 60, label: '12 цаг' },
  { seconds: 24 * 60 * 60, label: '1 хоног' },
  { seconds: 2 * 24 * 60 * 60, label: '2 хоног' },
  { seconds: 3 * 24 * 60 * 60, label: '3 хоног' },
  { seconds: 5 * 24 * 60 * 60, label: '5 хоног' },
  { seconds: 7 * 24 * 60 * 60, label: '7 хоног' },
];

/** Хамгийн түгээмэл сонголт — Yahoo дээр ч анхдагч нь 3 хоног. */
export const DEFAULT_AUCTION_SECONDS = 3 * 24 * 60 * 60;

export const PRODUCT_CATEGORIES = ['Sneakers', 'Vintage Decor', 'Trading Cards', 'Electronics', 'Other'];

/**
 * Ангиллын монгол нэр. Хадгалагдах утга нь англиараа хэвээр — сервер дээрх
 * хуучин бараа, худалдагчийн тохиргоо тэр утгуудтай таарсаар байна.
 */
export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  'Sneakers': 'Пүүз',
  'Vintage Decor': 'Винтаж чимэглэл',
  'Trading Cards': 'Цуглуулгын карт',
  'Electronics': 'Электроник',
  'Other': 'Бусад',
};

/**
 * Шинэ барааны хоосон маягт. Урьдчилсан утгууд нь худалдагчийн тохиргооноос
 * ирнэ (`Тохиргоо → Худалдааны / Барааны жагсаалтын`); тохиргоо байхгүй бол
 * `settingsOf` default-ууд нь эдгээрийн өмнөх хатуу утгуудтай ижил.
 */
export const emptyProductDraft = (defaults: SellerSettings): ProductDraft => ({
  name: '',
  sku: '',
  category: defaults.listing.defaultCategory,
  description: '',
  price: 0,
  quantity: defaults.listing.defaultQuantity,
  condition: defaults.listing.defaultCondition,
  listingType: defaults.selling.defaultListingType,
  acceptOffers: defaults.selling.acceptOffers,
  images: [],
  auctionDurationSeconds: DEFAULT_AUCTION_SECONDS,
});

export const draftFromProduct = (product: InventoryProduct): ProductDraft => ({
  name: product.name,
  sku: product.sku,
  category: product.category,
  description: product.description,
  price: product.price,
  quantity: product.quantity,
  condition: product.condition,
  listingType: product.listingType,
  acceptOffers: true,
  images: product.images ?? [],
  auctionDurationSeconds: DEFAULT_AUCTION_SECONDS,
});

/** Published products follow their stock level; unpublished ones stay drafts. */
export const statusForDraft = (draft: ProductDraft, publish: boolean): InventoryProduct['status'] => {
  if (!publish) return 'DRAFT';
  return draft.quantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK';
};
