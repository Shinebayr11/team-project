import { InventoryProduct } from '@/features/seller-hub/types';

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
}

export const PRODUCT_CATEGORIES = ['Sneakers', 'Vintage Decor', 'Trading Cards', 'Electronics', 'Other'];

export const emptyProductDraft = (): ProductDraft => ({
  name: '',
  sku: '',
  category: PRODUCT_CATEGORIES[0],
  description: '',
  price: 0,
  quantity: 1,
  condition: 'New',
  listingType: 'buy_it_now',
  acceptOffers: true,
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
});

/** Published products follow their stock level; unpublished ones stay drafts. */
export const statusForDraft = (draft: ProductDraft, publish: boolean): InventoryProduct['status'] => {
  if (!publish) return 'DRAFT';
  return draft.quantity > 0 ? 'ACTIVE' : 'OUT_OF_STOCK';
};
