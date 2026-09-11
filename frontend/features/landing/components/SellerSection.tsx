"use client"

/**
 * 3 — Худалдагчид. Цайвар ягаан (accent-soft) дэвсгэр, noir текст.
 *
 * Visual нь `/seller/analytics`-ийн жижигрүүлсэн, ГЭХДЭЭ БОДИТ хувилбар:
 * ижил таван KPI, ижил "Борлуулалтын үзүүлэлт" график, ижил Орлого / Захиалга
 * / Бараа гурван таб. Browser chrome зориудаар зураагүй — самбар нь өөрөө
 * бүтээгдэхүүн, зургийн хүрээ хэрэггүй.
 *
 * Гурван хөдөлгөөн:
 *  1. KPI тоонууд харагдмагцаа 0-ээс өөрийн утга руу нэг удаа count-up хийнэ.
 *  2. График нь `pathLength` 0 → 1-ээр зурагдаж гарна, дараа нь цэгүүд
 *     дараалан гарч ирнэ.
 *  3. Таб солигдоход шугам ШИНЭ өгөгдлөөрөө дахин зурагдана.
 *
 * Яагаад recharts биш вэ: аппын `SalesChart` нь recharts дээр (≈100KB) сууна.
 * Landing-д тэр жинг оруулах шалтгаангүй — 7 цэгтэй, харилцан үйлдэлгүй
 * шугамыг SVG-ээр шууд зурахад `pathLength` дээр бүрэн хяналт нэмж олдоно.
 */

import { useEffect, useRef, useState } from "react"
import { TrendingUp } from "lucide-react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion"

import { groupNumber } from "../format"
import { CHART, DUR, EASE } from "../motion"
import { useAmplitude } from "../useAmplitude"
import { GhostCta } from "./CtaButtons"
import { MaskText, RevealCta, RevealSub } from "./MaskText"
import { ParallaxLayer, SectionShell } from "./SectionShell"

const GROSS = 3_480_000
const ORDERS = 214

interface Kpi {
  label: string
  value: number
  prefix: string
  /** Мөнгөн дүн бусдаасаа урт тул өөрийн мөрөнд, томоор гарна. */
  big?: boolean
}

/** `/seller/analytics`-тай яг ижил таван үзүүлэлт, ижил дараалал. */
const KPIS: Kpi[] = [
  { label: "Нийт борлуулалт", value: GROSS, prefix: "₮", big: true },
  { label: "Цэвэр борлуулалт", value: Math.round(GROSS * 0.9), prefix: "₮" },
  { label: "Захиалга", value: ORDERS, prefix: "" },
  { label: "Зарагдсан бараа", value: 268, prefix: "" },
  {
    label: "Дундаж захиалгын дүн",
    value: Math.round(GROSS / ORDERS),
    prefix: "₮",
  },
]

type Metric = "revenue" | "orders" | "items"

const METRICS: { id: Metric; label: string }[] = [
  { id: "revenue", label: "Орлого" },
  { id: "orders", label: "Захиалга" },
  { id: "items", label: "Бараа" },
]

/** Долоо хоногийн өгөгдөл. Гурвуулаа ижил тооны цэгтэй. */
const SERIES: Record<Metric, number[]> = {
  revenue: [312, 448, 386, 604, 522, 748, 860],
  orders: [18, 26, 21, 35, 31, 42, 41],
  items: [24, 30, 28, 46, 38, 55, 52],
}

const DAYS = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"]

/* SVG-ийн координатын систем. Хариу үзүүлэх хэсэг нь `width: 100%` — viewBox
   нь харьцааг барих тул зураасны зузаан хаана ч ижил үлдэнэ. */
const VIEW = { w: 640, h: 200, pad: 16 }

function toPoints(values: number[]): Array<{ x: number; y: number }> {
  const max = Math.max(...values)
  const min = Math.min(...values)
  // Хэмжээст нь өөрийнх нь хүрээгээр татна: гурван цуврал огт өөр далайцтай
  // (₮ зуун мянга vs 40 захиалга) тул нийтлэг тэнхлэг утгагүй.
  const span = Math.max(1, max - min)
  const usable = VIEW.h - VIEW.pad * 2
  return values.map((value, index) => ({
    x: (index / (values.length - 1)) * (VIEW.w - VIEW.pad * 2) + VIEW.pad,
    y: VIEW.h - VIEW.pad - ((value - min) / span) * usable,
  }))
}

function toPath(points: Array<{ x: number; y: number }>): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ")
}

export function SellerSection() {
  return (
    <SectionShell id="sellers" labelledBy="sellers-title" tone="dark">
      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <ParallaxLayer depth="back">
          <MaskText
            id="sellers-title"
            text={"Дэлгүүрийнхээ гүйцэтгэлийг real-time-аар хар"}
            className="max-w-[14ch] text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.03em]"
          />
          <RevealSub className="mt-6 max-w-[34ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[var(--wn-ink-2)]">
            Борлуулалт, захиалга, нөөц — бүгд нэг самбар дээр. Бүртгэлийн төлбөр
            байхгүй, зарагдсан үедээ л төлнө.
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
  const inView = useInView(ref, { amount: 0.35, once: true })
  const { motionOn } = useAmplitude()

  const [metric, setMetric] = useState<Metric>("revenue")
  /** Хулгана таб дээр байхад авто-солилт зогсоно. */
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (!inView || !motionOn || held) return
    const id = window.setInterval(() => {
      setMetric((prev) => {
        const next = METRICS.findIndex((m) => m.id === prev) + 1
        return METRICS[next % METRICS.length].id
      })
    }, CHART.cycle)
    return () => window.clearInterval(id)
  }, [inView, motionOn, held])

  return (
    <div
      ref={ref}
      className="rounded-[8px] border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-[0_24px_60px_-44px_rgb(14_11_24_/_0.4)]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-[15px] font-[800] tracking-[-0.02em] text-[var(--wn-noir)]">
          Аналитик
        </div>
        <span className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--wn-accent-soft)] px-2 py-1 text-[12px] font-[700] text-[var(--wn-accent)]">
          <TrendingUp className="h-3.5 w-3.5" />
          +18%
        </span>
      </div>

      {/* Мөнгөн дүн бусдаасаа хамаагүй урт тул өөрийн мөрөнд гарна — тавуулаа
          нэг эгнээнд байвал нарийн дэлгэц дээр мөргөлддөг. */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-[6px] border border-[var(--wn-line)] px-3 py-3 ${
              kpi.big ? "col-span-2" : ""
            }`}
          >
            <CountUp
              value={kpi.value}
              prefix={kpi.prefix}
              active={inView}
              big={kpi.big}
            />
            <div className="mt-1 text-[11px] leading-tight font-[600] text-[var(--wn-ink-3)]">
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[13px] font-[800] tracking-[-0.02em] text-[var(--wn-noir)]">
          Борлуулалтын үзүүлэлт
        </div>
        <div
          className="flex rounded-[6px] bg-[var(--wn-surface-2)] p-1"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
        >
          {METRICS.map((m) => (
            <button
              key={m.id}
              type="button"
              onMouseEnter={() => setMetric(m.id)}
              onFocus={() => setMetric(m.id)}
              onClick={() => setMetric(m.id)}
              aria-pressed={metric === m.id}
              className="relative rounded-[4px] px-3 py-1.5 text-[12px] font-[700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-accent)]"
            >
              {/* Идэвхтэй табын дэвсгэр нь ГАНЦ элемент бөгөөд табуудын
                  хооронд шилждэг — `layoutId` нь FLIP-ийг өөрөө хийнэ. */}
              {metric === m.id && (
                <motion.span
                  layoutId="wn-metric-pill"
                  className="absolute inset-0 rounded-[4px] bg-white shadow-[0_1px_2px_rgb(14_11_24_/_0.12)]"
                  transition={{ duration: 0.28, ease: EASE }}
                />
              )}
              <span
                className={
                  metric === m.id
                    ? "relative text-[var(--wn-noir)]"
                    : "relative text-[var(--wn-ink-3)]"
                }
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Chart metric={metric} active={inView} />

      <div className="mt-2 flex justify-between text-[11px] font-[600] text-[var(--wn-ink-3)] tabular-nums">
        {DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  )
}

function Chart({ metric, active }: { metric: Metric; active: boolean }) {
  const { motionOn } = useAmplitude()
  const points = toPoints(SERIES[metric])
  const path = toPath(points)

  // `key={metric}` нь таб солигдох бүрд <g>-г дахин mount хийнэ: шугам
  // шинэ өгөгдлөөрөө дахин зурагдаж, цэгүүд дахин дараалан гарна.
  //
  // ЗӨРҮҮ (бриф): `layoutId`-аар өгөгдөл morph хийхийг зөвлөсөн ч layoutId нь
  // элементийн байрлал/хэмжээг л FLIP хийдэг — path-ийн `d`-г хооронд нь
  // interpolate хийдэггүй. Табын товгор дээр layoutId-г зөв (дээр) хэрэглэсэн,
  // шугам дээр нь дахин зурагдах хувилбарыг сонгов.
  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Долоо хоногийн ${METRICS.find((m) => m.id === metric)?.label.toLowerCase()}`}
      >
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={0}
            x2={VIEW.w}
            y1={VIEW.h * ratio}
            y2={VIEW.h * ratio}
            stroke="var(--wn-line)"
            strokeWidth={1}
          />
        ))}

        <g key={metric}>
          <motion.path
            d={path}
            fill="none"
            stroke="var(--wn-accent)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: motionOn ? 0 : 1 }}
            animate={{ pathLength: active ? 1 : 0 }}
            transition={{ duration: CHART.draw, ease: EASE }}
          />
          {points.map((p, index) => (
            <motion.circle
              key={index}
              cx={p.x}
              cy={p.y}
              r={5}
              fill="var(--wn-noir)"
              initial={{ scale: motionOn ? 0 : 1, opacity: motionOn ? 0 : 1 }}
              animate={active ? { scale: 1, opacity: 1 } : { scale: 0 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              transition={{
                duration: 0.3,
                ease: EASE,
                delay: CHART.draw * 0.5 + index * CHART.dotStagger,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

function CountUp({
  value,
  prefix,
  active,
  big = false,
}: {
  value: number
  prefix: string
  active: boolean
  big?: boolean
}) {
  const { motionOn } = useAmplitude()
  // MotionValue-ийн эхний утга нь 0 — SSR дээр ч "0" гарах тул тусад нь
  // "бэлэн үү" гэсэн state хэрэггүй (hydration зөрөхгүй).
  const count = useMotionValue<number>(0)
  const text = useTransform(count, groupNumber)

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
          ? "flex items-baseline gap-0.5 text-[clamp(1.5rem,2.4vw,2rem)] leading-none font-[800] tracking-[-0.03em] text-[var(--wn-noir)] tabular-nums"
          : "flex items-baseline gap-0.5 text-[clamp(1.05rem,1.6vw,1.35rem)] leading-none font-[800] tracking-[-0.03em] text-[var(--wn-noir)] tabular-nums"
      }
    >
      {prefix && <span>{prefix}</span>}
      <motion.span>{text}</motion.span>
    </div>
  )
}
