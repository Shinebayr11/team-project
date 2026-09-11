"use client"

/**
 * 4 — Дэлгүүр / хайлт. Бараан (noir) дэвсгэр, цагаан текст.
 *
 * Хайлтын мөрөнд ангиллын нэр өөрөө бичигдэж солигдох ба ҮГ СОЛИГДОХ БҮРД
 * ард талын бүтээгдэхүүнүүд БҮХЭЛДЭЭ солигдоно. Ингэснээр "энд юу ч бий"
 * гэдгийг жагсаалт уншуулахгүйгээр харуулна.
 *
 * Хоёр зүйлийг зориуд ялгав:
 *  - Бичигдэж буй үг нь `placeholder` — `value` БИШ. Тиймээс хэрэглэгч
 *    бичиж эхлэхэд юу ч дарагдахгүй, дэлгэц уншигч ч секунд тутам үг
 *    давтахгүй.
 *  - Хэрэглэгч бичихэд typewriter зогсоод, бодит debounce-той хайлт эхэлнэ.
 */

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { groupNumber } from "../format"
import { SHOP_CATEGORIES, searchShop, type ShopItem } from "../shopCatalog"
import { EASE, SPRING, VIEWPORT } from "../motion"
import { useAmplitude } from "../useAmplitude"
import { MaskText } from "./MaskText"
import { MediaSlot } from "./MediaSlot"
import { SectionShell } from "./SectionShell"

/** Typewriter-ийн хэмнэл (мс). */
const TYPE = { char: 70, erase: 35, hold: 1_600 } as const

/** Хайлтын хүсэлтийн debounce (мс). */
const DEBOUNCE = 250

/**
 * Картуудын байрлал. `depth` нь хулганы parallax-ийн үржигдэхүүн (px):
 * их байх тусам "ойрхон" мэт хүчтэй хөдөлнө.
 */
const SLOTS = [
  { className: "left-[1%] top-[8%]", rotate: -9, depth: 38, mobile: true },
  { className: "right-[2%] top-[3%]", rotate: 7, depth: 22, mobile: false },
  { className: "left-[7%] bottom-[6%]", rotate: 6, depth: 50, mobile: false },
  { className: "right-[5%] bottom-[12%]", rotate: -7, depth: 30, mobile: true },
  // 5 дахь нь доод ирмэгээс хагас гарч тайрагдана — гүн нэмнэ. Хайлтын мөр
  // (голд, max-w-440px) нь дээр нь суудаг тул мөргөлдөхгүй.
  { className: "left-[32%] bottom-[-8%]", rotate: 4, depth: 44, mobile: false },
] as const

/**
 * Ангилалд хэдэн бараа байхаас хамаарч аль байрлалыг эзлэхийг сонгоно.
 *
 * Хоёрхон бараатай үед 0 ба 3 (эсрэг булан) — хоёулаа `mobile: true` тул
 * нарийн дэлгэц дээр ч хоёул харагдана. Дараалан 0, 1 гэж эзэлбэл mobile
 * дээр ганц карт үлдэж, тайз хоосорно.
 */
const SLOT_PLAN: Record<number, readonly number[]> = {
  1: [0],
  2: [0, 3],
  3: [0, 1, 3],
  4: [0, 1, 2, 3],
  5: [0, 1, 2, 3, 4],
}

export function ShopSection() {
  const { motionOn, mobile } = useAmplitude()
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, { amount: 0.3 })

  const [typed, setTyped] = useState<string>(SHOP_CATEGORIES[0].query)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">(
    "holding"
  )

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ShopItem[]>([])

  // Хэрэглэгч бичиж эхэлмэгц үзүүлэн зогсоно — түүний бичсэн үсэг рүү өөр юм
  // бичигдэх нь бухимдал төрүүлнэ.
  const auto = motionOn && inView && query === ""

  useEffect(() => {
    if (!auto) return
    const word = SHOP_CATEGORIES[index].query

    if (phase === "typing") {
      if (typed.length < word.length) {
        const id = window.setTimeout(
          () => setTyped(word.slice(0, typed.length + 1)),
          TYPE.char
        )
        return () => window.clearTimeout(id)
      }
      const id = window.setTimeout(() => setPhase("holding"), TYPE.hold)
      return () => window.clearTimeout(id)
    }

    if (phase === "holding") {
      const id = window.setTimeout(() => setPhase("erasing"), TYPE.hold)
      return () => window.clearTimeout(id)
    }

    if (typed.length === 0) return

    const id = window.setTimeout(() => {
      const next = typed.slice(0, -1)
      setTyped(next)
      // Үг бүрэн арилсан мөчид ангилал солигдоно — картууд ч мөн адил.
      // Энэ шилжилтийг effect-ийн биед биш, ЭНД хийж байгаа нь санаатай:
      // биед нь setState хийвэл нэмэлт render дуудагдана.
      if (next.length === 0) {
        setIndex((prev) => (prev + 1) % SHOP_CATEGORIES.length)
        setPhase("typing")
      }
    }, TYPE.erase)
    return () => window.clearTimeout(id)
  }, [auto, phase, typed, index])

  useEffect(() => {
    // Хоосон хайлтад юу ч цэвэрлэхгүй: хуучин үр дүн нь render дээр
    // (`query.trim() && ...`) шүүгдэнэ. Энд `setResults([])` бичих нь
    // effect-ийн биед setState дуудаж, илүүц render үүсгэнэ.
    if (!query.trim()) return
    let alive = true
    const id = window.setTimeout(() => {
      searchShop(query).then((found) => {
        if (alive) setResults(found)
      })
    }, DEBOUNCE)
    return () => {
      alive = false
      window.clearTimeout(id)
    }
  }, [query])

  // Хулганы байрлал: контейнерийн голоос -0.5 … 0.5.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, SPRING)
  const sy = useSpring(py, SPRING)

  const category = SHOP_CATEGORIES[index]

  return (
    <SectionShell id="shop" labelledBy="shop-title" tone="light">
      <div
        ref={stage}
        className="relative min-h-[70svh] [perspective:1200px]"
        onPointerMove={(event) => {
          if (!motionOn || mobile) return
          const rect = event.currentTarget.getBoundingClientRect()
          px.set((event.clientX - rect.left) / rect.width - 0.5)
          py.set((event.clientY - rect.top) / rect.height - 0.5)
        }}
        onPointerLeave={() => {
          px.set(0)
          py.set(0)
        }}
      >
        {/* Ард талын бүтээгдэхүүн. `mode="wait"` — хуучин багц бүрэн
            уусаад дуусмагц шинэ нь орж ирнэ, хоёул зэрэг харагдахгүй. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={category.query}
              className="absolute inset-0"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: { transition: { staggerChildren: 0.06 } },
                hidden: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {category.items.map((item, index) => {
                const plan = SLOT_PLAN[category.items.length] ?? [0, 1, 2, 3, 4]
                const spec = SLOTS[plan[index]]
                if (!spec) return null
                if (mobile && !spec.mobile) return null
                return (
                  <FloatCard
                    key={item.name}
                    item={item}
                    spec={spec}
                    sx={sx}
                    sy={sy}
                  />
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex min-h-[70svh] flex-col items-center justify-center text-center">
          <MaskText
            id="shop-title"
            text={"Хайж байгаа бүхэн чинь энд байна"}
            className="mx-auto max-w-[18ch] text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.03em]"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative mt-10 w-full max-w-[440px]"
          >
            <div className="flex items-center gap-3 rounded-[6px] border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-md focus-within:border-white/35">
              <Search className="h-4 w-4 shrink-0 text-white/50" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={typed}
                aria-label="Бараа хайх"
                className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/45"
              />
            </div>

            <AnimatePresence>
              {query.trim() !== "" && results.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-[6px] border border-white/12 bg-[var(--wn-noir)]/95 text-left backdrop-blur-md"
                >
                  {results.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between gap-4 px-4 py-2.5 text-[14px]"
                    >
                      <span className="text-white/85">{item.name}</span>
                      <span className="font-[800] whitespace-nowrap tabular-nums">
                        {groupNumber(item.price)}₮
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  )
}

function FloatCard({
  item,
  spec,
  sx,
  sy,
}: {
  item: ShopItem
  spec: (typeof SLOTS)[number]
  sx: MotionValue<number>
  sy: MotionValue<number>
}) {
  const { motionOn } = useAmplitude()
  const x = useTransform(sx, (v) => v * spec.depth)
  const y = useTransform(sy, (v) => v * spec.depth)

  return (
    <motion.div
      className={`absolute w-[150px] sm:w-[184px] ${spec.className}`}
      style={{ x, y, rotate: spec.rotate }}
      variants={{
        // blur нь transform/opacity биш — гэхдээ энэ бол 4 элемент дээрх
        // GPU-composited filter бөгөөд багц солигдох 0.4 секундэд л
        // ажиллана. Тогтмол давтагддаг loop-д хэзээ ч хэрэглэхгүй.
        hidden: motionOn
          ? { opacity: 0, scale: 0.92, filter: "blur(10px)" }
          : { opacity: 0 },
        show: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.45, ease: EASE },
        },
      }}
    >
      <div className="overflow-hidden rounded-[8px] border border-white/12 bg-white/8 p-2.5 backdrop-blur-md">
        <MediaSlot
          src={item.image}
          alt={item.name}
          ratio="4 / 5"
          sizes="184px"
          className="w-full rounded-[6px]"
        />
        <div className="mt-2 truncate text-[12px] font-[600] text-white/80">
          {item.name}
        </div>
        {/* `flex-wrap`: "68,000,000₮" шиг урт дүн pill-тэй нэг мөрөнд
            багтахгүй. Картууд absolute тул өндөр нь өсөхөд layout хөдлөхгүй. */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="text-[13px] font-[800] whitespace-nowrap tabular-nums">
            {groupNumber(item.price)}₮
          </span>
          <span
            className={
              item.auction
                ? "rounded-[4px] bg-[var(--wn-live)] px-2 py-0.5 text-[10px] font-[800] whitespace-nowrap text-white"
                : "rounded-[4px] bg-white px-2 py-0.5 text-[10px] font-[800] whitespace-nowrap text-[var(--wn-noir)]"
            }
          >
            {item.auction ? "Санал өгөх" : "Шууд авах"}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
