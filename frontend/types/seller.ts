/**
 * Худалдагчийн идэвхжүүлэлтийн гэрээ (API <-> client).
 *
 * Энэ файл `server/src/types/seller.ts`-тэй ЯГ ИЖИЛ байх ёстой. Хоёр package
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
