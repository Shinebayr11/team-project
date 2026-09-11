/**
 * Мянгатын тусгаарлагч.
 *
 * `toLocaleString()` БИШ: locale нь сервер (Node, ихэвчлэн en-US) болон хөтөч
 * дээр өөр байж болох тул hydration зөрдөг. Энэ нь хаана ч ижил гарна.
 * ₮ тэмдгийг оруулдаггүй — `tabular-nums`-тай тоон блок дээр түүнийг тусад нь
 * байрлуулахгүй бол сүүлийн цифр рүү наалдаж харагддаг.
 */
export function groupNumber(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
