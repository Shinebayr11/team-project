/**
 * Бүртгэлийн тохиргоо (API <-> client).
 *
 * Энэ файл `server/src/types/account.ts`-тэй ЯГ ИЖИЛ байх ёстой. Хоёр package
 * тусдаа build хийгддэг тул монорепо дотор нэгдсэн package байхгүй — аль нэгийг
 * нь өөрчлөх бол нөгөөг нь хамт өөрчил.
 */

export type AccountLanguage = "mn" | "en"

export interface AccountPreferences {
  language: AccountLanguage
  timezone: string
}

export interface AccountNotifications {
  orderUpdates: boolean
  showReminders: boolean
  bidAlerts: boolean
  messages: boolean
  promotions: boolean
}

/** GET /api/users/me — бүртгэлийн тохиргоонд хэрэгтэй талбарууд. */
export interface AccountSettings {
  display_name: string
  bio?: string
  avatar_url?: string
  cover_url?: string
  preferences: AccountPreferences
  notifications: AccountNotifications
}

/**
 * PATCH /api/users/me — хүсэлтийн бие. Панель бүр зөвхөн өөрийн хэсгээ явуулдаг
 * тул талбар бүр сонголттой; ирсэн хэсгийг нь л шинэчилнэ.
 */
export interface AccountUpdateBody {
  display_name?: string
  bio?: string
  /** Cloudinary-гийн хаяг. Хоосон мөр нь "зургаа хас" гэсэн үг. */
  avatar_url?: string
  cover_url?: string
  preferences?: AccountPreferences
  notifications?: AccountNotifications
}

/** PATCH /api/users/me — амжилттай хариу. */
export interface AccountUpdateResponse {
  message: string
  data: AccountSettings
}

/** Талбар тус бүрийн алдааг input-ийн доор харуулахад. */
export interface AccountErrorResponse {
  message: string
  fields?: Partial<Record<keyof AccountUpdateBody, string>>
}

/** Хүргэлтийн хаяг. */
export interface Address {
  _id: string
  fullName: string
  phone: string
  /** Хот / аймаг. */
  city: string
  /** Дүүрэг / сум. */
  district: string
  /** Хороо / баг — заавал биш. */
  khoroo?: string
  /** Гудамж, байр, тоот. */
  detail: string
  isDefault: boolean
}

/** POST/PATCH /api/users/addresses — хүсэлтийн бие. */
export interface AddressBody {
  fullName: string
  phone: string
  city: string
  district: string
  khoroo?: string
  detail: string
  isDefault?: boolean
}

/** GET /api/users/addresses. */
export interface AddressListResponse {
  data: Address[]
}
