/**
 * Дэлгүүрийн нэрээс `whynot.mn/@slug` үүсгэнэ.
 *
 * Дэлгүүрийн нэр ихэвчлэн кирилл байдаг тул латинаар галиглана — "Винтаж
 * Дэлгүүр" -> "vintaj-delguur". Клиент нь урьдчилан харуулахдаа, сервер нь
 * хадгалахын өмнө дахин тооцоход хоёулаа ижил үр дүн гаргах ёстой тул энэ
 * файл `server/src/lib/slug.ts`-тэй ЯГ ИЖИЛ байна.
 */

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j",
  з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o",
  ө: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ү: "u", ф: "f",
  х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
}

export const SLUG_MIN = 3
export const SLUG_MAX = 30

/** Зөвхөн жижиг латин үсэг, тоо, дундуур нь нэг зураас. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .split("")
    .map((ch) => CYRILLIC[ch] ?? ch)
    .join("")
    .normalize("NFD")
    // латин үсгийн диакритик (é -> e) — галиглалтын дараа үлдсэнийг цэвэрлэнэ
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, "")
