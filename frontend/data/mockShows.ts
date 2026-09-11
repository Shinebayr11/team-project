import { HomeShow } from "../types"

/**
 * Нүүрний тэжээлийг дүүргэх ҮЗҮҮЛЭН эфирүүд.
 *
 * Яагаад хэрэгтэй вэ: `/api/liveshow` нь одоогоор туршилтын 2-3 бичлэг л
 * буцаадаг тул нүүр хуудас ангилал тутамдаа ганц картаар харагддаг байв.
 * Эдгээр нь ЖИНХЭНЭ өгөгдлийн ДАРАА залгагдана (`hooks/useLiveShows.ts`) —
 * бодит эфир үргэлж түрүүлж, том картын байрыг ч алддаггүй (`roomId`
 * байхгүй тул `useHomeFeed`-ийн spotlight эдгээрийг сонгохгүй).
 *
 * Устгах бол: энэ файл + `public/mock/` + `useLiveShows`-ийн `concat` гурав.
 *
 * Зураг: `public/mock/*.webp` (3:4, ShowCard-ийн хайрцагтай ижил).
 * Ангиллын нэрс `data/exploreCategories.ts`-ийн жагсаалтаас ирнэ.
 */

const img = (name: string) => `/mock/${name}.webp`

const SHOWS: Omit<HomeShow, "demo">[] = [
  /* ---------------------------------------------------------------- Хувцас */
  {
    seller: "Ариунаа Shop",
    title: "Өвлийн шинэ ирц — бүгд 29,900₮",
    category: "Хувцас",
    tags: "Эмэгтэй хувцас",
    thumbnail: img("store-sale"),
    live: 342,
    saved: 128,
  },
  {
    seller: "Ариунаа Shop",
    title: "Дэлгүүрээр аялъя — шинэ бараа",
    category: "Хувцас",
    tags: "Эмэгтэй хувцас",
    thumbnail: img("store-browse"),
    live: 187,
  },
  {
    seller: "Номин Style",
    title: "Хүрэн хослол — оффисын өдөр",
    category: "Хувцас",
    tags: "Хослол",
    thumbnail: img("brown-set"),
    live: 96,
    saved: 41,
  },
  {
    seller: "Номин Style",
    title: "Топ 20,000₮ · Өмд 35,000₮",
    category: "Хувцас",
    tags: "Өмд, топ",
    thumbnail: img("top-cargo"),
    at: "Өнөөдөр 20:00",
  },
  {
    seller: "Webd Орлоо",
    title: "Саарал өмд S · M · L",
    category: "Хувцас",
    tags: "Өмд",
    thumbnail: img("grey-trousers"),
    live: 214,
    saved: 73,
  },
  {
    seller: "Webd Орлоо",
    title: "Өндөр охидод зориулсан өмд",
    category: "Хувцас",
    tags: "Өмд",
    thumbnail: img("tall-trousers"),
    at: "Маргааш 19:00",
  },
  {
    seller: "Winter Closet",
    title: "2,026,000₮ азтан шалгаруулна",
    category: "Хувцас",
    tags: "Сугалаа",
    thumbnail: img("giveaway"),
    live: 1284,
    saved: 512,
    sponsored: true,
  },
  {
    seller: "Winter Closet",
    title: "Ягаан кардиган — хязгаарлагдмал",
    category: "Хувцас",
    tags: "Цамц",
    thumbnail: img("pink-cardigan"),
    live: 64,
  },
  {
    seller: "Vintage Ulaanbaatar",
    title: "Арьсан хүрэм — 90-ээд оны",
    category: "Хувцас",
    tags: "Винтаж",
    thumbnail: img("leather-jacket"),
    live: 431,
    saved: 209,
  },
  {
    seller: "Bag Corner",
    title: "Ажлын цүнх — 16,500₮-с",
    category: "Хувцас",
    tags: "Цүнх",
    thumbnail: img("bags-rack"),
    at: "Бямба 14:00",
  },
  {
    seller: "Bag Corner",
    title: "Цүнхний бүтэн ханын шоу",
    category: "Хувцас",
    tags: "Цүнх",
    thumbnail: img("bag-wall"),
    live: 158,
    saved: 66,
  },

  /* ------------------------------------------------------------ Гоо сайхан */
  {
    seller: "Glow Mongolia",
    title: "Люкс брэндийн багц — Dior, Chanel, YSL",
    category: "Гоо сайхан",
    tags: "Люкс",
    thumbnail: img("luxury-set"),
    live: 892,
    saved: 344,
  },
  {
    seller: "Glow Mongolia",
    title: "Dior Backstage бэлгийн багц",
    category: "Гоо сайхан",
    tags: "Бэлэг",
    thumbnail: img("dior-backstage"),
    live: 276,
  },
  {
    seller: "Sarnai Beauty",
    title: "YSL · NYX суурь бүтээгдэхүүн",
    category: "Гоо сайхан",
    tags: "Суурь",
    thumbnail: img("ysl-base"),
    live: 145,
    saved: 58,
  },
  {
    seller: "Sarnai Beauty",
    title: "Уруулын өнгө сонгоцгооё",
    category: "Гоо сайхан",
    tags: "Уруул",
    thumbnail: img("lip-swatch"),
    at: "Өнөөдөр 21:30",
  },
  {
    seller: "K-Beauty UB",
    title: "Hello, I'm K-beauty — lilybyred",
    category: "Гоо сайхан",
    tags: "Солонгос",
    thumbnail: img("k-beauty"),
    live: 523,
    saved: 187,
  },
  {
    seller: "K-Beauty UB",
    title: "Уруулын гялбааны бүтэн тавиур",
    category: "Гоо сайхан",
    tags: "Уруул",
    thumbnail: img("lipgloss-tray"),
    live: 311,
  },
  {
    seller: "Shein Care",
    title: "Арьс арчилгааны багц задлав",
    category: "Гоо сайхан",
    tags: "Арьс арчилгаа",
    thumbnail: img("skincare-set"),
    at: "Ням 12:00",
  },
  {
    seller: "Shein Care",
    title: "Үсний бүч, тор — шинэ ирц",
    category: "Гоо сайхан",
    tags: "Дагалдах",
    thumbnail: img("hair-accessories"),
    live: 88,
    saved: 31,
  },

  /* ------------------------------------------------------------------ Пүүз */
  {
    seller: "Urgoo Sneaker",
    title: "New Balance 530 — бүх размер",
    category: "Пүүз",
    tags: "New Balance",
    thumbnail: img("nb-530"),
    live: 467,
    saved: 233,
  },
  {
    seller: "Urgoo Sneaker",
    title: "NB өдөр тутмын хослол",
    category: "Пүүз",
    tags: "New Balance",
    thumbnail: img("nb-lifestyle"),
    live: 152,
  },
  {
    seller: "Sole Club",
    title: "Air Force 1 — гар дээрх үзлэг",
    category: "Пүүз",
    tags: "Nike",
    thumbnail: img("af1-hand"),
    live: 738,
    saved: 402,
  },
  {
    seller: "Sole Club",
    title: "AF1 LV8 — зөвхөн 12 хос",
    category: "Пүүз",
    tags: "Nike",
    thumbnail: img("af1-orange"),
    at: "Маргааш 21:00",
  },

  /* ------------------------------------------------------------- Электроник */
  {
    seller: "Tech Mall",
    title: "iPhone — задлан үзүүлэг",
    category: "Электроник",
    tags: "Утас",
    thumbnail: img("iphone"),
    live: 1043,
    saved: 618,
  },
  {
    seller: "Tech Mall",
    title: "Ухаалаг дэлгэц — гарын авлага",
    category: "Электроник",
    tags: "Дэлгэц",
    thumbnail: img("smart-display"),
    at: "Лхагва 18:00",
  },
  {
    seller: "Home Screen",
    title: "Ханын зурагт — суурилуулалттай",
    category: "Электроник",
    tags: "Зурагт",
    thumbnail: img("tv-wall"),
    live: 219,
    saved: 97,
  },
  {
    seller: "Home Screen",
    title: "Зочны өрөөний зурагтын багц",
    category: "Электроник",
    tags: "Зурагт",
    thumbnail: img("tv-living"),
    live: 76,
  },
]

/**
 * `demo: true`-г энд НЭГ ДОР тавина: дээрх жагсаалтад шинэ мөр нэмэхэд
 * мартах боломжгүй.
 */
export const MOCK_SHOWS: HomeShow[] = SHOWS.map((show) => ({
  ...show,
  demo: true,
}))
