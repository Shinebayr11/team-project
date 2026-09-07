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
}

export const PRODUCT_CATEGORIES = ['Sneakers', 'Vintage Decor', 'Trading Cards', 'Electronics', 'Other'];

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
});

/** Published products follow their stock level; unpublished ones stay drafts. */
export const statusForDraft = (draft: ProductDraft, publish: boolean): InventoryProduct['status'] => {
  if (!publish) return 'DRAFT';
  return draft.quantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK';
};
