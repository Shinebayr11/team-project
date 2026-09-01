"use client"

/**
 * 4 — Худалдагчид. Цайвар ягаан (accent-soft) дэвсгэр.
 *
 * Visual нь seller dashboard-ийн хэсэгчилсэн карт: тоонууд нь харагдмагцаа
 * 0-ээс өөрийн утга руу count-up хийнэ (`animate()`, нэг удаа).
 */

import { useEffect, useRef } from "react"
import { TrendingUp } from "lucide-react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion"

import { DUR, EASE } from "../motion"
import { useAmplitude } from "../useAmplitude"
import { GhostCta } from "./CtaButtons"
import { MaskText, RevealCta, RevealSub } from "./MaskText"
import { ParallaxLayer, SectionShell } from "./SectionShell"

const STATS = [
  { label: "Энэ сарын борлуулалт", value: 3_480_000, suffix: "₮" },
  { label: "Зарагдсан бараа", value: 214, suffix: "" },
  { label: "Дундаж үзэгч", value: 1_120, suffix: "" },
]

/** Долоо хоногийн багана (харьцангуй өндөр, 0..1). */
const BARS = [0.35, 0.52, 0.44, 0.7, 0.61, 0.88, 1]

function group(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function SellerSection() {
  return (
    <SectionShell id="sellers" labelledBy="sellers-title" tone="dark">
      <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <ParallaxLayer depth="back">
          <MaskText
            id="sellers-title"
            text={"Зарагдсан үедээ л төлнө"}
            className="max-w-[12ch] text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.03em]"
          />
          <RevealSub className="mt-6 max-w-[34ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[var(--wn-ink-2)]">
            Бүртгэлийн төлбөр байхгүй. Дэлгүүрээ нээгээд яг тэр өдрөө эфирт гар.
          </RevealSub>
          <RevealCta className="mt-8">
            <GhostCta to="/sell" className="text-[var(--wn-noir)]">
              Худалдагч болох
            </GhostCta>
          </RevealCta>
        </ParallaxLayer>

        <ParallaxLayer depth="mid">
          <DashboardCard />
        </ParallaxLayer>
      </div>
    </SectionShell>
  )
}

function DashboardCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4, once: true })

  return (
    <div
      ref={ref}
      className="rounded-[8px] border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-[0_30px_70px_-40px_rgb(14_11_24_/_0.35)]"
    >
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-[800] tracking-[-0.02em] text-[var(--wn-noir)]">
          Дэлгүүрийн тойм
        </div>
        <span className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--wn-accent-soft)] px-2 py-1 text-[12px] font-[700] text-[var(--wn-accent)]">
          <TrendingUp className="h-3.5 w-3.5" />
          +18%
        </span>
      </div>

      {/* Мөнгөн дүн нь бусдаасаа хамаагүй урт тул өөрийн мөрөнд гарна —
          гурвуулаа нэг мөрөнд байвал нарийн дэлгэц дээр мөргөлддөг. */}
      <div className="mt-6">
        <Stat stat={STATS[0]} active={inView} big />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {STATS.slice(1).map((stat) => (
          <Stat key={stat.label} stat={stat} active={inView} />
        ))}
      </div>

      <div className="mt-8 flex h-28 items-end gap-2">
        {BARS.map((height, index) => (
          <motion.div
            key={index}
            className="flex-1 origin-bottom rounded-[4px] bg-[var(--wn-accent)]"
            style={{ height: `${height * 100}%` }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: index * 0.05 }}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between text-[11px] font-[600] text-[var(--wn-ink-3)]">
        <span>Даваа</span>
        <span>Ням</span>
      </div>
    </div>
  )
}

function Stat({
  stat,
  active,
  big = false,
}: {
  stat: (typeof STATS)[number]
  active: boolean
  big?: boolean
}) {
  return (
    <div>
      <CountUp value={stat.value} suffix={stat.suffix} active={active} big={big} />
      <div className="mt-1 text-[12px] leading-tight font-[600] text-[var(--wn-ink-3)]">
        {stat.label}
      </div>
    </div>
  )
}

function CountUp({
  value,
  suffix,
  active,
  big = false,
}: {
  value: number
  suffix: string
  active: boolean
  big?: boolean
}) {
  const { motionOn } = useAmplitude()
  // MotionValue-ийн эхний утга нь 0 — SSR дээр ч "0" гарах тул тусад нь
  // "бэлэн үү" гэсэн state хэрэггүй (hydration зөрөхгүй).
  const count = useMotionValue<number>(0)
  const text = useTransform(count, group)

  useEffect(() => {
    if (!active) return
    if (!motionOn) {
      count.set(value)
      return
    }
    const controls: AnimationPlaybackControls = animate(count, value, {
      duration: DUR.count * 2,
      ease: EASE,
    })
    return () => controls.stop()
  }, [active, motionOn, count, value])

  return (
    <div
      className={
        big
          ? "flex items-baseline gap-1 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none font-[800] tracking-[-0.03em] text-[var(--wn-noir)]"
          : "flex items-baseline gap-1 text-[clamp(1.25rem,2vw,1.75rem)] leading-none font-[800] tracking-[-0.03em] text-[var(--wn-noir)]"
      }
    >
      <motion.span className="tabular-nums">{text}</motion.span>
      {suffix && <span>{suffix}</span>}
    </div>
  )
}
