import type { SellerProfile, SellerSettings } from "@/types/seller"

/**
 * Тохиргоо нэмэгдэхээс өмнө идэвхжсэн худалдагчдад `settings` БАЙХГҮЙ. Эдгээр
 * default-ууд нь маягтуудын өмнөх хатуу утгуудтай яг ижил тул тохиргоогоо
 * хөндөөгүй худалдагчийн ажиллагаа хэвээр үлдэнэ.
 */
export const DEFAULT_SELLER_SETTINGS: SellerSettings = {
  selling: { defaultListingType: "buy_it_now", acceptOffers: true },
  // `listing` нь тохиргооны дэлгэцээс хасагдсан — эдгээр нь одоо шинэ барааны
  // маягтын тогтмол урьдчилсан утга (`productDraft.ts`) болж үлдэв.
  listing: { defaultCategory: "Sneakers", defaultCondition: "New", defaultQuantity: 1 },
  shipping: { processingDays: 2 },
  orders: { autoConfirm: false, packingSlipNote: "" },
}

/** Профайл байхгүй/хуучин байсан ч бүрэн тохиргоо буцаана. */
export const settingsOf = (profile: SellerProfile | null | undefined): SellerSettings => ({
  selling: { ...DEFAULT_SELLER_SETTINGS.selling, ...profile?.settings?.selling },
  listing: { ...DEFAULT_SELLER_SETTINGS.listing, ...profile?.settings?.listing },
  shipping: { ...DEFAULT_SELLER_SETTINGS.shipping, ...profile?.settings?.shipping },
  orders: { ...DEFAULT_SELLER_SETTINGS.orders, ...profile?.settings?.orders },
})

/** Барааны байдлын сонголтууд — маягт, тохиргоо хоёрт ижил жагсаалт. */
export const PRODUCT_CONDITIONS = ["New", "Like New", "Good", "Fair"]

/** Барааны байдлын монгол нэр. Хадгалагдах утга нь англиараа хэвээр. */
export const PRODUCT_CONDITION_LABELS: Record<string, string> = {
  "New": "Шинэ",
  "Like New": "Шинэтэй адил",
  "Good": "Сайн",
  "Fair": "Хэвийн",
}
