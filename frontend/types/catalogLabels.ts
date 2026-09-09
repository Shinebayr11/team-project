import type { ProductTag } from "./catalog"

/**
 * Барааны шошгыг харагдац руу буулгана.
 *
 * `ProductTag`-ийн УТГА нь өгөгдөл (`tagClass`, `product.tag === '...'` зэрэг
 * харьцуулалтын түлхүүр) тул орчуулагдахгүй — зөвхөн харагдах нэр нь энд байна.
 *
 * Энэ нь өмнө нь `components/liveshow/ShowProductList.tsx` дотор ганцаараа
 * сууж байсан бөгөөд барааны хуудас нь шошгоо ОРЧУУЛАЛГҮЙ англиар нь
 * («Buy now») шууд хэвлэдэг байв. Хоёулаа эндээс уншина.
 */
export const PRODUCT_TAG_LABELS: Record<ProductTag | string, string> = {
  "Live now": "Шууд явж байна",
  "Buy now": "Шууд авах",
  Giveaway: "Бэлэг",
  Sold: "Зарагдсан",
  "Follow to enter": "Дагаад оролц",
}

export const productTagLabel = (tag: string) => PRODUCT_TAG_LABELS[tag] ?? tag
