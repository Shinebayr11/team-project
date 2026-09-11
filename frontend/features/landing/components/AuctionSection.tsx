"use client"

/**
 * 2 — Дуудлага худалдаа + данс. Хуудсын signature section.
 *
 * Гурван зүйлийг зэрэг хэлнэ: (1) яаж оролцох вэ гэсэн 3 алхам, (2) ажиллаж
 * буй дуудлага худалдаа, (3) ялсан дүн дансанаас автоматаар хасагдахыг.
 *
 * ЗООС БАЙХГҮЙ. Хэрэглэгч дансаа ₮-өөр цэнэглээд шууд санал өгнө — өмнөх
 * хувилбарын "зоос худалдаж авах" алхам бүрмөсөн хасагдсан.
 *
 * Section нь sticky: `STICKY_TRACK` урттай замын дагуу гүйлгэхэд зүүн талын
 * алхам солигдож, баруун талын карт дэлгэц дээр зогсож үлдэнэ. Тиймээс энэ
 * section л ганцаараа `clip={false}` — `overflow: hidden` эцэг нь доторх
 * sticky-г үхүүлдэг.
 *
 * Бүхэл loop нь ГАНЦ `requestAnimationFrame` дээр явна (`setInterval` биш):
 * таймер, санал өгөх мөч, ялагчийн төлөв гурвуулаа нэг timestamp-аас
 * бодогдох тул хоорондоо хэзээ ч салдаггүй. Карт дэлгэцээс гармагц
 * `cancelAnimationFrame` дуудагдаж бүрэн зогсоно.
 */

import { useEffect, useRef, useState } from "react"
import { Wallet } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

import { groupNumber } from "../format"
import { AUCTION, AUCTION_STEPS, EASE, SPRING, STICKY_TRACK } from "../motion"
import { useAmplitude } from "../useAmplitude"
import { MaskText, RevealSub } from "./MaskText"
import { SectionShell } from "./SectionShell"

interface Bid {
  id: number
  name: string
  amount: number
}

/** Нээлтийн үнэ. */
const OPENING = 10_000

/** Скрипт: `at` нь мөчлөгийн эхнээс хойших мс. */
const SCRIPT: ReadonlyArray<{ at: number; amount: number; name: string }> = [
  { at: AUCTION.gap, amount: 14_945, name: "Болдоо" },
  { at: AUCTION.gap * 2, amount: 22_500, name: "Сараа" },
  { at: AUCTION.gap * 3, amount: 31_000, name: "Болдоо" },
]

/** Жагсаалтад хамгийн ихдээ харагдах мөрийн тоо. */
const MAX_ROWS = 4

const OPENING_BID: Bid = { id: 0, name: "Нээлтийн үнэ", amount: OPENING }

const FINAL_PRICE = SCRIPT[SCRIPT.length - 1].amount
const WINNER = SCRIPT[SCRIPT.length - 1].name

/** Дансны эхний үлдэгдэл ба ялсны дараах үлдэгдэл. */
const BALANCE_BEFORE = 120_000
const BALANCE_AFTER = BALANCE_BEFORE - FINAL_PRICE

/**
 * Loop ажиллахгүй үеийн (SSR, reduced-motion, дэлгэцээс гадуур) төлөв:
 * мөчлөгийн ТӨГСГӨЛ. Статикаар харж байгаа хүнд бүтэн түүх — хэн ялсан, данс
 * хэдээр хасагдсан — шууд уншигдана. Энэ нь мөн эхний render-ийн утга тул
 * hydration зөрөхгүй.
 */
const STATIC_BIDS: Bid[] = [
  OPENING_BID,
  ...SCRIPT.map((entry, index) => ({
    id: index + 1,
    name: entry.name,
    amount: entry.amount,
  })),
].slice(-MAX_ROWS)

export function AuctionSection() {
  const track = useRef<HTMLDivElement>(null)
  // Замын progress: sticky карт дэлгэцэд наалдсанаас салах хүртэл 0 → 1.
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })
  const [step, setStep] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(
      AUCTION_STEPS.length - 1,
      Math.max(0, Math.floor(p * AUCTION_STEPS.length))
    )
    setStep((prev) => (prev === next ? prev : next))
  })

  return (
    <SectionShell
      id="auction"
      labelledBy="auction-title"
      tone="light"
      clip={false}
      className="items-start py-0 sm:py-0"
    >
      {/*
        Sticky нь ЗӨВХӨН `lg`-ээс дээш. Нарийн дэлгэц дээр агуулга нь өөрөө
        100svh-ээс өндөр (гарчиг 4 мөр болж тасарна) тул наавал доод тал нь
        буюу алхмууд нь хэзээ ч харагдахгүй хэвээр үлдэнэ. Тэнд section
        энгийнээр гүйнэ, гурван алхам зэрэг харагдана.

        Замын уртыг CSS хувьсагчаар өгч байгаа шалтгаан: Tailwind нь эх кодын
        текстийг уншиж класс үүсгэдэг тул `lg:h-[${TRACK}svh]` гэсэн template
        literal-ыг олж хардаггүй. Ингэснээр тогтмол нь `motion.ts`-д ганцаараа
        үлдэнэ.
      */}
      <div
        ref={track}
        className="relative h-auto lg:h-[var(--wn-track)]"
        style={{ ["--wn-track" as string]: `${STICKY_TRACK}svh` }}
      >
        <div className="flex flex-col gap-10 py-20 lg:sticky lg:top-0 lg:min-h-[100svh] lg:justify-center lg:gap-14 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            <div>
              <MaskText
                id="auction-title"
                text={"10 секунд.\nХамгийн өндөр үнэ хожно."}
                className="text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.03em]"
              />
              <RevealSub className="mt-6 max-w-[34ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-white/70">
                Дансаа цэнэглээд шууд оролц. Зоос авах шаардлагагүй.
              </RevealSub>
            </div>

            <AuctionCard />
          </div>

          <StepFlow step={step} progress={scrollYProgress} />
        </div>
      </div>
    </SectionShell>
  )
}

/* -------------------------------------------------------------------------
   Цэнэглэх → Санал өгөх → Суутгах
   ------------------------------------------------------------------------- */

function StepFlow({
  step,
  progress,
}: {
  step: number
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  const { amp, wide } = useAmplitude()
  // amp = 0 (reduced motion) үед spring-гүй, шууд утга: гүйлгэх нь өөрөө
  // хөдөлгөөн биш тул зураас progress-ыг дагасаар байна.
  const scaleX = useSpring(
    progress,
    amp ? SPRING : { stiffness: 1000, damping: 100 }
  )

  return (
    <div>
      {/* Замын шугам. `scaleX` нь transform тул layout-д хүрэхгүй.
          Sticky байхгүй үед (нарийн дэлгэц) progress нь юуг ч хэмжихгүй тул
          зураас өөрөө утгагүй болно — тэнд харуулахгүй. */}
      <div className="relative hidden h-px w-full bg-white/15 lg:block">
        <motion.div
          className="absolute inset-0 origin-left bg-[var(--wn-lime)]"
          style={{ scaleX }}
        />
      </div>

      {/* Өргөн дэлгэц дээр гүйлгэх явцад алхам солигдоно. Нарийн дээр sticky
          байхгүй тул "идэвхтэй алхам" гэсэн ойлголт утгагүй — гурвуулаа
          жигд харагдана. */}
      <div className="mt-5 grid gap-6 lg:grid-cols-3 lg:gap-8">
        {AUCTION_STEPS.map((entry, index) => (
          <Step
            key={entry.title}
            index={index}
            active={!wide || index === step}
            {...entry}
          />
        ))}
      </div>
    </div>
  )
}

function Step({
  index,
  title,
  body,
  active,
}: {
  index: number
  title: string
  body: string
  active: boolean
}) {
  return (
    <div className={active ? "opacity-100" : "opacity-45"}>
      <div className="flex items-center gap-2.5">
        <span
          className={
            active
              ? "inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-[var(--wn-lime)] text-[12px] font-[800] text-[var(--wn-noir)]"
              : "inline-flex h-6 w-6 items-center justify-center rounded-[4px] border border-white/25 text-[12px] font-[800] text-white/70"
          }
        >
          {index + 1}
        </span>
        <span className="text-[15px] font-[800] tracking-[-0.02em]">
          {title}
        </span>
      </div>
      <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-white/60">
        {body}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------
   Ажиллаж буй карт
   ------------------------------------------------------------------------- */

function AuctionCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const { motionOn } = useAmplitude()
  const live = inView && motionOn

  const [bids, setBids] = useState<Bid[]>(STATIC_BIDS)
  const [won, setWon] = useState(true)

  // Үлдсэн хугацаа нь rAF бүрд өөрчлөгддөг тул React state-д ХЭЗЭЭ Ч
  // хадгалагдахгүй: секундэд 60 удаа render хийхээс сэргийлж motion value.
  const remaining = useMotionValue<number>(0)
  const secondsText = useTransform(remaining, (ms) =>
    String(Math.ceil(ms / 1000))
  )
  const barScale = useTransform(remaining, (ms) => ms / AUCTION.window)

  const price = bids[bids.length - 1]?.amount ?? OPENING
  const balance = won ? BALANCE_AFTER : BALANCE_BEFORE

  useEffect(() => {
    if (!live) {
      remaining.set(0)
      return
    }

    let frame = 0
    let start = 0
    let fired = 0
    let wonAt = 0
    let primed = false

    const reset = (now: number) => {
      start = now
      fired = 0
      wonAt = 0
      remaining.set(AUCTION.window)
      setBids([OPENING_BID])
      setWon(false)
    }

    const tick = (now: number) => {
      // Эхний frame дээр мөчлөгийг тэглэнэ. Effect-ийн бие дотор биш, rAF
      // callback дотор setState хийж байгаа нь санаатай: харагдмагц дахин
      // эхнээсээ эхлэх ба cascading render үүсгэхгүй.
      if (!primed) {
        primed = true
        reset(now)
        frame = requestAnimationFrame(tick)
        return
      }

      const elapsed = now - start

      while (fired < SCRIPT.length && elapsed >= SCRIPT[fired].at) {
        const entry = SCRIPT[fired]
        fired += 1
        setBids((prev) => [...prev, toBid(entry)].slice(-MAX_ROWS))
      }

      // Anti-snipe: таймер мөчлөгийн эхнээс биш, СҮҮЛИЙН САНАЛААС хойш
      // тоологдоно — санал өгөх бүрд бүтэн 10 секунд сэргэнэ гэсэн үг.
      const lastBidAt = fired === 0 ? 0 : SCRIPT[fired - 1].at
      const left = Math.max(0, AUCTION.window - (elapsed - lastBidAt))
      remaining.set(left)

      if (left === 0) {
        if (!wonAt) {
          wonAt = now
          setWon(true)
        } else if (now - wonAt >= AUCTION.win) {
          reset(now)
        }
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [live, remaining])

  return (
    <div ref={ref} className="mx-auto w-full max-w-[400px]">
      <div className="rounded-[8px] border border-white/12 bg-white/6 p-5 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[12px] font-[700] tracking-[0.08em] text-white/50 uppercase">
              Одоогийн үнэ
            </div>
            <Roll
              value={price}
              className="mt-1 h-[34px] text-[34px] leading-none font-[800] tracking-[-0.03em]"
            />
          </div>

          <div className="text-right">
            <div className="text-[12px] font-[700] tracking-[0.08em] text-white/50 uppercase">
              {won ? "Дууссан" : "Үлдсэн"}
            </div>
            <motion.div
              className="mt-1 h-[34px] text-[34px] leading-none font-[800] tabular-nums"
              style={{ color: "var(--wn-live)" }}
            >
              {won ? "0" : <motion.span>{secondsText}</motion.span>}
            </motion.div>
          </div>
        </div>

        <div className="mt-4 h-1 w-full overflow-hidden rounded-[4px] bg-white/12">
          <motion.div
            className="h-full w-full origin-left rounded-[4px] bg-[var(--wn-live)]"
            style={{ scaleX: barScale }}
          />
        </div>

        {/* 4 мөрийн өндрийг урьдчилж захиална: санал орж ирэх бүрд карт
            сунаж, доорх агуулгыг түлхэхээс сэргийлнэ. */}
        <div className="mt-5 flex min-h-[156px] flex-col gap-1.5">
          {bids.map((bid, index) => (
            <motion.div
              key={bid.id}
              // Доороос дээш: шинэ санал жагсаалтын ёроолд ургаж орж ирнэ.
              initial={motionOn ? { y: 16, opacity: 0 } : { opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative flex items-center justify-between overflow-hidden rounded-[6px] bg-white/6 px-3 py-2 text-[13px]"
            >
              {/* Хамгийн сүүлийн мөрийн товч гялбаа. Дэвсгэрийн өнгийг
                  animate хийхгүй — уусах давхарга нь opacity дээр л явна. */}
              {index === bids.length - 1 && (
                <motion.span
                  key={bid.id}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[var(--wn-lime)]/25"
                  initial={{ opacity: motionOn ? 1 : 0 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              )}
              <span className="relative font-[600] text-white/80">
                {bid.name}
              </span>
              <span className="relative font-[800]">
                <span className="tabular-nums">{groupNumber(bid.amount)}</span>₮
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 h-[34px]">
          <AnimatePresence>
            {won && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-[4px] px-3 py-1.5 text-[13px] font-[800] text-white"
                style={{ backgroundColor: "var(--wn-live)" }}
              >
                Ялагч · {WINNER}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Данс. Ялах мөчид үлдэгдэл шууд буурч байгааг харуулах нь энэ
          section-ий гол амлалт: "ялвал автоматаар суутгана". */}
      <div className="mt-3 flex items-center justify-between gap-4 rounded-[8px] border border-white/12 bg-white/6 px-4 py-3.5 backdrop-blur-md">
        <span className="inline-flex items-center gap-2 text-[13px] font-[700] text-white/70">
          <Wallet className="h-4 w-4" />
          Миний данс
        </span>
        <div className="flex items-baseline gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {won && (
              <motion.span
                key="delta"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="text-[13px] font-[800] tabular-nums"
                style={{ color: "var(--wn-live)" }}
              >
                −{groupNumber(FINAL_PRICE)}₮
              </motion.span>
            )}
          </AnimatePresence>
          <Roll
            value={balance}
            className="h-[22px] text-[19px] leading-none font-[800] tracking-[-0.02em]"
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Тоо солигдох бүрд хуучин нь дээш гарч, шинэ нь доороосоо орж ирнэ.
 *
 * Гадна бүрхүүл нь ТОГТМОЛ ӨНДӨРТЭЙ байх ёстой (`className`-д `h-*` өгнө):
 * дотор нь absolute зурагдах тул өндөр нь агуулгаасаа ирэхгүй, өгөхгүй бол
 * мөр нурна.
 */
function Roll({ value, className }: { value: number; className?: string }) {
  const { motionOn } = useAmplitude()

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {/* Урсгалын гадна суух хэмжээ тогтоогч — өргөнийг агуулгаараа барина. */}
      <span className="invisible tabular-nums" aria-hidden>
        {groupNumber(value)}₮
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 flex items-baseline"
          initial={motionOn ? { y: "100%" } : { opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={motionOn ? { y: "-100%" } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <span className="tabular-nums">{groupNumber(value)}</span>₮
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// STATIC_BIDS-ийн id-нуудаас (0..SCRIPT.length) дээгүүр эхэлнэ: тэдэнтэй
// давхацвал эхний мөчлөгийн эхний мөр React-ийн хувьд "хуучин" болж, орж
// ирэх анимацаа алддаг.
let bidId = SCRIPT.length
function toBid(entry: { amount: number; name: string }): Bid {
  bidId += 1
  return { id: bidId, name: entry.name, amount: entry.amount }
}
