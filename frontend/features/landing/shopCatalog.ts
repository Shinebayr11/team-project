/**
 * Дэлгүүрийн section-ий үзүүлэн каталог.
 *
 * Ангилал бүр 2–4 бараатай — байгаа зурагтаа тааруулсан. Хэдэн бараа байхаас
 * хамаарч ямар байрлал эзлэхийг `ShopSection`-ий `SLOT_PLAN` шийднэ.
 *
 * ЗУРАГ: `public/landing/*.webp` (4:5 харьцаагаар урьдчилж тайрсан). Файл
 * байхгүй бол `MediaSlot` нь токеноор зурсан placeholder руу чимээгүй буцна.
 */

export interface ShopItem {
  name: string
  price: number
  /** `true` бол дуудлага худалдаа — pill нь "Санал өгөх" болно. */
  auction?: boolean
  /** `public/` доторх зам. */
  image: string
}

export interface ShopCategory {
  /** Хайлтын мөрөнд бичигдэх үг. */
  query: string
  items: ShopItem[]
}

export const SHOP_CATEGORIES: readonly ShopCategory[] = [
  {
    query: "Гадуур хувцас",
    items: [
      {
        name: "Carhartt Detroit хүрэм",
        price: 185_000,
        auction: true,
        image: "/landing/carhartt-detroit.webp",
      },
      {
        name: "Ноосон бомбер",
        price: 165_000,
        image: "/landing/wool-bomber.webp",
      },
      {
        name: "Арьсан хүрэм",
        price: 320_000,
        image: "/landing/leather-jacket.webp",
      },
      {
        name: "Carhartt × Akira",
        price: 890_000,
        auction: true,
        image: "/landing/carhartt-akira.webp",
      },
    ],
  },
  {
    query: "Энгийн хувцас",
    items: [
      {
        name: "Шар даашинз",
        price: 68_000,
        image: "/landing/yellow-dress.webp",
      },
      {
        name: "Судалтай цамц",
        price: 95_000,
        image: "/landing/striped-shirt.webp",
      },
      {
        name: "Албаны өмд",
        price: 55_000,
        image: "/landing/trousers.webp",
      },
    ],
  },
  {
    query: "Пүүз ба цүнх",
    items: [
      {
        name: "Air Jordan 1 Chicago",
        price: 1_250_000,
        auction: true,
        image: "/landing/jordan-1.webp",
      },
      {
        name: "Nike Air Force 1",
        price: 320_000,
        image: "/landing/air-force-1.webp",
      },
      {
        name: "Хүрэн арьсан цүнх",
        price: 240_000,
        image: "/landing/leather-bag.webp",
      },
      {
        name: "Бордо арьсан цүнх",
        price: 195_000,
        auction: true,
        image: "/landing/burgundy-bag.webp",
      },
    ],
  },
  {
    query: "Гоо сайхан",
    items: [
      {
        name: "Rhode уруулын тос",
        price: 78_000,
        image: "/landing/rhode-lip-tint.webp",
      },
      {
        name: "Inglot уруулын харандаа",
        price: 34_000,
        image: "/landing/inglot-lip-pencil.webp",
      },
      {
        name: "Будгийн сойзны багц",
        price: 52_000,
        image: "/landing/makeup-brushes.webp",
      },
    ],
  },
  {
    query: "Технологи",
    items: [
      {
        name: "iPhone Pro · 256GB",
        price: 4_200_000,
        auction: true,
        image: "/landing/iphone.webp",
      },
      {
        name: "MacBook Pro 16″",
        price: 4_800_000,
        image: "/landing/macbook.webp",
      },
      {
        name: "Ухаалаг зурагт 55″",
        price: 1_450_000,
        image: "/landing/smart-tv.webp",
      },
      {
        name: "Marshall Major IV",
        price: 380_000,
        image: "/landing/marshall-major.webp",
      },
      {
        name: "Logitech Superlight",
        price: 420_000,
        image: "/landing/logitech-superlight.webp",
      },
    ],
  },
  {
    // Энэ ангилал бүхэлдээ дуудлага худалдаа: "юуг ч дуудлагаар зарж болно"
    // гэдгийг машинаас ном хүртэл нэг эгнээнд харуулна.
    query: "Дуудлага худалдаа",
    items: [
      {
        name: "Seiko LM Special",
        price: 420_000,
        auction: true,
        image: "/landing/seiko-lm.webp",
      },
      {
        name: "Toyota Camry 2021",
        price: 68_000_000,
        auction: true,
        image: "/landing/toyota-camry.webp",
      },
      {
        name: "Atomic Habits",
        price: 38_000,
        auction: true,
        image: "/landing/atomic-habits.webp",
      },
      {
        name: "Нарны шил",
        price: 45_000,
        auction: true,
        image: "/landing/sunglasses.webp",
      },
    ],
  },
] as const

/**
 * Хайлтын adapter.
 *
 * TODO(backend): `/api/search` одоогоор БАЙХГҮЙ (`server/src/route/` дотор
 * `productRoute`, `categoryRoute` л бий). Endpoint нэмэгдмэгц энэ функцийн
 * биеийг `apiFetch("/api/search?q=" + ...)` болгож солиход хангалттай —
 * дуудагч тал нь аль хэдийн debounce-той, abort-той, promise хүлээдэг.
 */
export async function searchShop(query: string): Promise<ShopItem[]> {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  return SHOP_CATEGORIES.flatMap((category) =>
    category.items.filter(
      (item) =>
        item.name.toLowerCase().includes(needle) ||
        category.query.toLowerCase().includes(needle)
    )
  ).slice(0, 5)
}
