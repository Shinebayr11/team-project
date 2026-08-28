/**
 * Landing-ийн motion тогтмолууд.
 *
 * Компонент дотор easing/duration-ыг шууд тоогоор бичихгүй — бүгд эндээс ирнэ,
 * ингэснээр хуудсын хэмнэл нэг газраас удирдагдана.
 */

import type { Transition, Variants } from "framer-motion"

/** Хуудсын үндсэн easing (expo-out). */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const DUR = {
  /** Гарчгийн үг тус бүрийн mask reveal. */
  word: 0.7,
  /** Дэд текст. */
  sub: 0.6,
  /** CTA. */
  cta: 0.55,
  /** Header-ийн өнгө урвах хугацаа (CSS transition). */
  tone: 0.35,
  /** Bid орж ирэх үеийн үнийн count-up. */
  count: 0.6,
} as const

export const DELAY = {
  sub: 0.15,
  cta: 0.3,
} as const

/** Гарчгийн үг хоорондын завсар. */
export const WORD_STAGGER = 0.045

/** Түүхий scrollYProgress-ыг зөөлрүүлэх spring — parallax бүр үүгээр дамжина. */
export const SPRING = { stiffness: 90, damping: 25, mass: 0.4 } as const

/** Parallax давхаргын далайц (px, desktop дээрх бүтэн хэмжээ). */
export const PARALLAX = {
  back: 60,
  mid: 40,
  front: 80,
  /** front давхаргын эргэлт (deg). */
  rotate: 4,
  /** mid давхаргын scale-ийн доод утга. */
  midScale: 0.94,
} as const

/** Hero-оос гарах үеийн phone mockup-ийн төлөв. */
export const HERO_EXIT = {
  scale: 0.82,
  y: -120,
  opacity: 0.25,
  rotateX: 12,
  perspective: 1200,
} as const

export const LENIS = { lerp: 0.09, duration: 1.1 } as const

/** Section reveal-ийн нийтлэг trigger. */
export const VIEWPORT = { once: true, amount: 0.4 } as const

/** Auction картын loop (мс). */
export const AUCTION = {
  /** Дуудлага худалдааны таймер. */
  window: 10_000,
  /** Bid хоорондын завсар. */
  gap: 3_000,
  /** "Ялагч" badge харагдах хугацаа. */
  win: 1_500,
} as const

/* -------------------------------------------------------------------------
   Section-ууд

   `bg` нь app/globals.css дахь токенуудын толь (--wn-accent, --wn-noir,
   --wn-paper, --wn-accent-soft). Энд hex хэлбэрээр давхардаж байгаа шалтгаан:
   framer-motion-ы useTransform өнгө хооронд interpolate хийхийн тулд бодит
   утга шаарддаг, `var(--wn-accent)` string-ийг холихыг мэдэхгүй.
   ------------------------------------------------------------------------- */

export type SectionTone = "light" | "dark"

export interface SectionSpec {
  /** DOM id — nav pill, IntersectionObserver, lenis.scrollTo бүгд үүгээр заана. */
  id: string
  /** Доод nav дээр харагдах нэр. */
  label: string
  /** Тухайн section төвдөө байхад хуудсын background ямар өнгөтэй байх вэ. */
  bg: string
  /** Текстийн өнгө: light = цагаан, dark = noir. */
  tone: SectionTone
}

export const SECTIONS: readonly SectionSpec[] = [
  { id: "hero", label: "Нүүр", bg: "#5b3fe0", tone: "light" },
  { id: "auction", label: "Дуудлага худалдаа", bg: "#0e0b18", tone: "light" },
  { id: "wallet", label: "Coin хэтэвч", bg: "#fbfaff", tone: "dark" },
  { id: "sellers", label: "Худалдагчид", bg: "#f1edfe", tone: "dark" },
  { id: "categories", label: "Ангилал", bg: "#0e0b18", tone: "light" },
  { id: "cta", label: "Эхлэх", bg: "#5b3fe0", tone: "light" },
] as const

/* -------------------------------------------------------------------------
   Variants
   ------------------------------------------------------------------------- */

/** Гарчгийн үг: доороосоо mask-аас ургаж гарна. */
export const wordVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 0 } : { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: DUR.word, ease: EASE },
  },
})

/** Гарчгийн бүрхүүл — үг тус бүрийг stagger-ээр асаана. */
export const headingVariants = (delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: WORD_STAGGER, delayChildren: delay },
  },
})

export const subVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.sub, ease: EASE, delay: DELAY.sub },
  },
})

export const ctaVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.cta, ease: EASE, delay: DELAY.cta },
  },
})

/** Дараалан ирэх картуудын бүрхүүл (wallet, categories). */
export const listVariants = (delay = DELAY.cta): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
})

export const itemVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.sub, ease: EASE } },
})

/** Hero дээр хөвж буй картуудын сул хөдөлгөөн. */
export const floatTransition = (duration: number, delay: number): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
})
