/**
 * Seller Hub — the seller-facing dashboard, served at /admin/*.
 *
 * This barrel is the feature's public surface: the route-level screens and
 * nothing else. Everything under components/, hooks/ and data/ is internal.
 *
 * The global store wires to this feature through leaf paths rather than this
 * file, so a type-only import can never pull a "use client" screen into the
 * server module graph:
 *   - records      -> @/features/seller-hub/types
 *   - store slices -> @/features/seller-hub/store/*
 *   - seed data    -> @/features/seller-hub/data/*
 *
 * See ./README.md for the layering rules.
 */

export { SellerHubLayout } from "./screens/SellerHubLayout"
export { SellerOverview } from "./screens/SellerOverview"
export { SellerOrders } from "./screens/SellerOrders"
export { SellerShows } from "./screens/SellerShows"
export { SellerProducts } from "./screens/SellerProducts"
export { SellerAnalytics } from "./screens/SellerAnalytics"
export { SellerSettings } from "./screens/SellerSettings"
