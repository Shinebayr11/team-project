/**
 * Самбарын товчнуудын цорын ганц эх сурвалж.
 *
 * Өмнө нь 17 товч тус бүрдээ ангиа бичдэг байсан бөгөөд үүнээс дараах зөрүү
 * гарч байв:
 *
 *   • «Хар» гэдэг нь дөрвөн өөр утга: `#1A1A1A` (өнгөгүй), `black`,
 *     `bg-gray-800` (#1e2939 — Tailwind v4-ийн хөх ялтастай саарал),
 *     `--wn-admin-ink` (#0e0b18 — ягаан ялтастай). Хоёр товч зэрэгцэхэд
 *     ялгаа нь нүдэнд илэрдэг.
 *   • Hover нь эсрэг чиглэлд: зарим нь `#1A1A1A → black` (бараан болно),
 *     зарим нь `black → gray-800` (цайвар болно).
 *   • Хүрээтэй товчны `border-gray-300` нь цагаан дээр 1.47:1 — WCAG
 *     SC 1.4.11-ийн 3:1-ийг давдаггүй. Товчны хүрээ бол түүний хил хязгаарыг
 *     заадаг цорын ганц тэмдэг тул шалгуур хамаарна.
 *
 * Одоо ӨНГӨ нь `tone`, ХЭЛБЭР нь `size` — хоёр тэнхлэг тусдаа. Хэлбэр олон
 * байх нь зөв (мөрөнд суух товч ба самбарын доод талын өргөн товч өөр байх
 * ёстой); өнгө нь гурав л байна.
 */

const BASE =
  "inline-flex items-center justify-center gap-2 font-[700] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-admin-accent)] disabled:cursor-not-allowed"

const TONE = {
  /** Сонгогдсон/үндсэн үйлдэл. Цагаан бичигтэй 19.45:1. */
  ink: "bg-[var(--wn-admin-ink)] text-white hover:bg-[var(--wn-admin-btn-hover)] disabled:bg-[var(--wn-admin-chip-2)] disabled:text-[var(--wn-admin-muted)]",
  /** Гадаргуу дээрх гол үйлдэл (хадгалах, илгээх). Хар бичигтэй 16.86:1. */
  lime: "bg-[var(--wn-admin-lime)] text-[var(--wn-admin-ink)] hover:bg-[var(--wn-admin-lime-hover)] disabled:bg-[var(--wn-admin-chip-2)] disabled:text-[var(--wn-admin-muted)]",
  /** Хоёрдогч үйлдэл. Хүрээ нь 3.38:1 — SC 1.4.11-ийг давна. */
  outline:
    "border border-[var(--wn-ink-4)] bg-white text-[var(--wn-admin-ink)] hover:bg-[var(--wn-admin-row-rule)]",
} as const

const SIZE = {
  /** Дэлгэцийн толгойд суух үйлдэл. */
  pill: "rounded-full px-5 py-2.5 text-[14px]",
  /** Маягтын хөл дэх баталгаажуулах товч. */
  pillWide: "rounded-full px-6 py-2.5 text-[14px]",
  /** Талбартай эгнэж суух товч — CONTROL-той ижил 40px өндөр. */
  field: "h-10 rounded-lg px-5 text-[14px]",
  /** Хажуугийн самбарын өргөн товч. */
  block: "w-full rounded-xl py-2.5 text-[14px]",
  /** Хэрэгслийн мөр, цонхны хөл дэх нягт товч. */
  compact: "rounded-lg px-4 py-2 text-[13px]",
} as const

export type ButtonTone = keyof typeof TONE
export type ButtonSize = keyof typeof SIZE

export const btn = (tone: ButtonTone, size: ButtonSize) =>
  `${BASE} ${TONE[tone]} ${SIZE[size]}`
