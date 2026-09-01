"use client"

/**
 * 2 — Дуудлага худалдаа. Хуудсын signature элемент: жинхэнэ ажиллаж буй
 * auction карт.
 *
 * Бүхэл loop нь ГАНЦ `requestAnimationFrame` дээр явна (`setInterval` биш):
 * таймер, bid-ийн цаг, "Ялагч" badge гурвуулаа нэг timestamp-аас бодогдох тул
 * хоорондоо хэзээ ч салдаггүй. Карт дэлгэцээс гармагц `cancelAnimationFrame`
 * дуудагдаж бүрэн зогсоно — цаана нь юу ч эргэлддэггүй.
 */

import { useEffect, useRef, useState } from "react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion"

import { AUCTION, DUR, EASE } from "../motion"
import { useAmplitude } from "../useAmplitude"
import { MaskText, RevealSub } from "./MaskText"
import { ParallaxLayer, SectionShell } from "./SectionShell"

interface Bid {
  id: number
  name: string
  amount: number
}

/** Нээлтийн үнэ. */
const OPENING = 10_000

/** Скрипт: `at` нь мөчлөгийн эхнээс хойших мс. */
const SCRIPT: ReadonlyArray<{ at: number; amount: number; name: string }> = [
  { at: AUCTION.gap, amount: 12_000, name: "Болдоо" },
  { at: AUCTION.gap * 2, amount: 15_000, name: "Сараа" },
  { at: AUCTION.gap * 3, amount: 18_000, name: "Тэмүүлэн" },
]

/** Жагсаалтад хамгийн ихдээ харагдах bid мөрийн тоо. */
const MAX_ROWS = 4

const OPENING_BID: Bid = { id: 0, name: "Нээлтийн үнэ", amount: OPENING }

/**
 * Loop ажиллахгүй үеийн (SSR, reduced-motion, дэлгэцээс гадуур) төлөв:
 * мөчлөгийн төгсгөл. Энэ нь мөн эхний render-ийн утга тул hydration зөрөхгүй.
 */
const STATIC_BIDS: Bid[] = [
  OPENING_BID,
  ...SCRIPT.map((entry, index) => ({
    id: index + 1,
    name: entry.name,
    amount: entry.amount,
  })),
].slice(-MAX_ROWS)

const FINAL_PRICE = SCRIPT[SCRIPT.length - 1].amount

/**
 * Локалаас хамааралгүй мянгатын тусгаарлагч — SSR/CSR ижил гарна.
 * ₮ тэмдгийг оруулдаггүй: tabular-nums-тай тоон блок дээр түүнийг тусад нь
 * (жижиг зайтай) байрлуулахгүй бол сүүлийн цифр рүү наалдаж харагддаг.
 */
function formatPrice(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function AuctionSection() {
  return (
    <SectionShell id="auction" labelledBy="auction-title" tone="light">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
        <ParallaxLayer depth="back">
          <MaskText
            id="auction-title"
            text={"10 секунд.\nХамгийн өндөр үнэ хожно."}
            className="text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.03em]"
          />
          <RevealSub className="mt-6 max-w-[34ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-white/70">
            Bid тавих бүрт таймер шинэчлэгдэнэ. Дуусмагц ялагчийн wallet-аас
            шууд суутгана.
          </RevealSub>
        </ParallaxLayer>

        <ParallaxLayer depth="mid">
          <AuctionCard />
        </ParallaxLayer>
      </div>
    </SectionShell>
  )
}

function AuctionCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const { motionOn } = useAmplitude()
  const live = inView && motionOn

  const [bids, setBids] = useState<Bid[]>(STATIC_BIDS)
  const [won, setWon] = useState(false)

  const price = useMotionValue<number>(FINAL_PRICE)
  const remaining = useMotionValue<number>(AUCTION.window)
  const priceText = useTransform(price, formatPrice)
  const secondsText = useTransform(remaining, (ms) =>
    String(Math.ceil(ms / 1000))
  )
  const barScale = useTransform(remaining, (ms) => ms / AUCTION.window)

  useEffect(() => {
    if (!live) {
      // Reduced-motion болон дэлгэцээс гадуур: мөчлөгийн төгсгөлийн статик төлөв.
      // Мөрүүд нь аль хэдийн тэр төлөвтэй (STATIC_BIDS) тул React state-д
      // хүрэхгүй — зөвхөн motion value-г байрлуулна.
      price.set(FINAL_PRICE)
      remaining.set(AUCTION.window)
      return
    }

    let frame = 0
    let countUp: AnimationPlaybackControls | null = null
    let start = 0
    let fired = 0
    let wonAt = 0
    let primed = false

    const reset = (now: number) => {
      start = now
      fired = 0
      wonAt = 0
      countUp?.stop()
      countUp = null
      price.set(OPENING)
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
        const bid = SCRIPT[fired]
        fired += 1
        countUp?.stop()
        countUp = animate(price, bid.amount, {
          duration: DUR.count,
          ease: EASE,
        })
        setBids((prev) => [...prev, toBid(bid)].slice(-MAX_ROWS))
      }

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

    return () => {
      cancelAnimationFrame(frame)
      countUp?.stop()
    }
  }, [live, price, remaining])

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-[400px] rounded-[8px] border border-white/12 bg-white/6 p-5 backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[12px] font-[700] tracking-[0.08em] text-white/50 uppercase">
            Одоогийн үнэ
          </div>
          <div className="mt-1 flex items-baseline gap-1 text-[34px] leading-none font-[800] tracking-[-0.03em]">
            <motion.span className="tabular-nums">{priceText}</motion.span>
            <span>₮</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[12px] font-[700] tracking-[0.08em] text-white/50 uppercase">
            Үлдсэн
          </div>
          <motion.div
            className="mt-1 text-[34px] leading-none font-[800] tabular-nums"
            style={{ color: "var(--wn-live)" }}
          >
            {secondsText}
          </motion.div>
        </div>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-[4px] bg-white/12">
        <motion.div
          className="h-full w-full origin-left rounded-[4px] bg-[var(--wn-live)]"
          style={{ scaleX: barScale }}
        />
      </div>

      {/* 4 мөрийн өндрийг урьдчилж захиална: bid орж ирэх бүрт карт нь
          сунаж, доорх агуулгыг түлхэхээс сэргийлнэ. */}
      <div className="mt-5 flex min-h-[156px] flex-col gap-1.5">
        {bids.map((bid) => (
          <motion.div
            key={bid.id}
            initial={motionOn ? { y: -20, opacity: 0 } : { opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex items-center justify-between rounded-[6px] bg-white/6 px-3 py-2 text-[13px]"
          >
            <span className="font-[600] text-white/80">{bid.name}</span>
            <span className="font-[800]">
              <span className="tabular-nums">{formatPrice(bid.amount)}</span>₮
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 h-[34px]">
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-[4px] px-3 py-1.5 text-[13px] font-[800] text-white"
            style={{ backgroundColor: "var(--wn-live)" }}
          >
            Ялагч · {bids[bids.length - 1]?.name}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// STATIC_BIDS-ийн id-нуудаас (0..SCRIPT.length) дээгүүр эхэлнэ: тэдэнтэй
// давхацвал эхний мөчлөгийн эхний bid мөр React-ийн хувьд "хуучин" болж,
// орж ирэх анимацаа алддаг.
let bidId = SCRIPT.length
function toBid(entry: { amount: number; name: string }): Bid {
  bidId += 1
  return { id: bidId, name: entry.name, amount: entry.amount }
}
