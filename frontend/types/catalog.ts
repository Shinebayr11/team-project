export type ProductTag = "Live now" | "Buy now" | "Giveaway" | "Sold";

export interface SellerProduct {
  name: string;
  price: string;
  tag: ProductTag;
  live?: true;
}

export interface SellerReview {
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface SellerRecord {
  slug: string;
  initial: string;
  tint: string;
  cover: [string, string];
  cat1: string;
  cat2: string;
  bio: string;
  rating: string;
  reviewCount: string;
  followers: string;
  sales: string;
  since: string;
  live: { type: "live"; watching: number } | { type: "scheduled"; at: string };
  products: SellerProduct[];
  reviews: SellerReview[];
}

/** A card in the Home / Explore feed. `live` is a viewer count; `at` is a scheduled slot. */
export interface HomeShow {
  seller: string;
  title: string;
  category: string;
  tags: string;
  thumbnail?: string;
  sponsored?: boolean;
  live?: number;
  at?: string;
  saved?: number;
}

