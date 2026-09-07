/**
 * Худалдагчийн идэвхжүүлэлтийн гэрээ (API <-> client).
 *
 * Энэ файл `frontend/types/seller.ts`-тэй ЯГ ИЖИЛ байх ёстой. Хоёр package
 * тусдаа build хийгддэг тул монорепо дотор нэгдсэн package байхгүй — аль нэгийг
 * нь өөрчлөх бол нөгөөг нь хамт өөрчил.
 */

/** Худалдагч зөвхөн идэвхтэй байна. Хүлээх/хянах төлөв ОГТ БАЙХГҮЙ. */
export type SellerStatus = "active"

export type SellerType = "individual" | "business"

export interface SellerProfile {
  status: SellerStatus
  storeName: string
  storeSlug: string
  sellerType: SellerType
  category: string
  /** Оршин суух хаяг. */
  address: string
  /** Холбогдох дугаар. */
  phone: string
  /** Гэрээнд зурсан гарын үсэг — хэрэглэгчийн бичсэн бүтэн нэр. */
  signature: string
  termsVersion: string
  agreedAt: string
  activatedAt: string
  /** Идэвхжсэний дараа нэмэгдсэн тул хуучин худалдагчдад байхгүй байж болно. */
  settings?: SellerSettings
}

/** POST /api/seller/activate — хүсэлтийн бие. */
export interface SellerActivateBody {
  storeName: string
  storeSlug: string
  sellerType: SellerType
  category: string
  address: string
  phone: string
  signature: string
  termsVersion: string
}

/** POST /api/seller/activate — амжилттай хариу (шинэ бол 201, аль хэдийн идэвхтэй бол 200). */
export interface SellerActivateResponse {
  message: string
  data: SellerProfile
}

/**
 * PATCH /api/seller/profile — хүсэлтийн бие. Идэвхжсэний дараа өөрчлөгддөг
 * талбарууд; гарын үсэг, гэрээний хувилбар нэг удаагийн зөвшөөрөл тул
 * дахин ирэхгүй.
 */
export interface SellerUpdateBody {
  storeName: string
  storeSlug: string
  sellerType: SellerType
  category: string
  address: string
  phone: string
}

/** PATCH /api/seller/profile — амжилттай хариу. */
export interface SellerUpdateResponse {
  message: string
  data: SellerProfile
}

export type ListingType = "buy_it_now" | "auction"

/** Шинэ бараа үүсгэхэд урьдчилан сонгогдох утгууд. */
export interface SellerSellingSettings {
  defaultListingType: ListingType
  acceptOffers: boolean
}

export interface SellerListingSettings {
  defaultCategory: string
  defaultCondition: string
  defaultQuantity: number
}

export interface SellerShippingSettings {
  defaultCarrier: string
  /** Захиалгыг илгээхэд шаардагдах ажлын өдөр. */
  processingDays: number
}

export interface SellerOrderSettings {
  /** Шинэ захиалгыг гараар биш, шууд "Боловсруулж буй" төлөвт оруулна. */
  autoConfirm: boolean
  /** Хүргэлтийн хуудсанд хэвлэгдэх тэмдэглэл. */
  packingSlipNote: string
}

/**
 * Худалдагчийн үйл ажиллагааны тохиргоо. Идэвхжсэний дараа нэмэгдсэн тул
 * хуучин худалдагчдад БАЙХГҮЙ байж болно — уншсан тал default-оор нөхнө.
 */
export interface SellerSettings {
  selling: SellerSellingSettings
  listing: SellerListingSettings
  shipping: SellerShippingSettings
  orders: SellerOrderSettings
}

/** PATCH /api/seller/settings — панель бүр зөвхөн өөрийн бүлгээ явуулна. */
export type SellerSettingsBody = Partial<SellerSettings>

/** PATCH /api/seller/settings — амжилттай хариу. */
export interface SellerSettingsResponse {
  message: string
  data: SellerProfile
}

/** GET /api/seller/slug-available?slug= */
export interface SlugAvailableResponse {
  available: boolean
}

/** GET /api/seller/me — идэвхжээгүй бол data: null. */
export interface SellerMeResponse {
  data: SellerProfile | null
}

/**
 * Алдааны хариу. `field` нь тухайн талбарын доор helper text болж харагдана
 * (жишээ нь slug давхардвал 409 + field: "storeSlug").
 */
export interface SellerErrorResponse {
  message: string
  field?: keyof SellerActivateBody
  fields?: Partial<Record<keyof SellerActivateBody, string>>
}
