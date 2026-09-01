"use client"

/**
 * Section бүрийн нийтлэг бүрхүүл.
 *
 *  - `min-height: 100svh`, grid + place-items-center. Scroll snap ЗОРИУДААР
 *    хэрэглээгүй: mobile дээр snap нь дундуур нь гацдаг.
 *  - Өөрийн scrollYProgress-ыг context-ээр доош дамжуулна — `<ParallaxLayer>`
 *    түүнээс уншиж, spring-ээр зөөлрүүлж давхаргын гүнийг үүсгэнэ.
 */

import { createContext, useContext, useRef } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

import { cn } from "@/lib/utils"

import { PARALLAX, SPRING, type SectionTone } from "../motion"
import { useAmplitude } from "../useAmplitude"

const SectionScroll = createContext<MotionValue<number> | null>(null)

/** Тухайн section дотор 0 (доороос орж ирэх) → 1 (дээгүүр гарах). */
export function useSectionScroll(): MotionValue<number> {
  const value = useContext(SectionScroll)
  if (!value) {
    throw new Error("useSectionScroll must be used inside <SectionShell>")
  }
  return value
}

interface SectionShellProps {
  id: string
  /** Гарчгийн id — `aria-labelledby` үүгээр холбогдоно. */
  labelledBy: string
  tone: SectionTone
  className?: string
  children: React.ReactNode
}

export function SectionShell({
  id,
  labelledBy,
  tone,
  className,
  children,
}: SectionShellProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  return (
    <section
      id={id}
      ref={ref}
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={cn(
        "relative grid min-h-[100svh] w-full place-items-center overflow-hidden px-5 py-20 sm:px-8 sm:py-28",
        tone === "light" ? "text-white" : "text-[var(--wn-noir)]",
        className
      )}
    >
      <SectionScroll.Provider value={scrollYProgress}>
        <div className="mx-auto w-full max-w-[1120px]">{children}</div>
      </SectionScroll.Provider>
    </section>
  )
}

type Depth = "back" | "mid" | "front"

interface ParallaxLayerProps {
  depth: Depth
  className?: string
  children: React.ReactNode
}

/**
 * Гурван гүний нэг дээр контентоо тавина. Түүхий scrollYProgress-ыг ХЭЗЭЭ Ч
 * шууд холбохгүй — бүгд spring-ээр дамжина, эс тэгвээс trackpad дээр чичирдэг.
 */
export function ParallaxLayer({
  depth,
  className,
  children,
}: ParallaxLayerProps) {
  const progress = useSectionScroll()
  const { amp, tilt } = useAmplitude()

  const range: Record<Depth, [number, number]> = {
    back: [-PARALLAX.back, PARALLAX.back],
    mid: [PARALLAX.mid, -PARALLAX.mid],
    front: [PARALLAX.front, -PARALLAX.front],
  }
  const [from, to] = range[depth]

  const y = useSpring(
    useTransform(progress, [0, 1], [from * amp, to * amp]),
    SPRING
  )
  const scale = useSpring(
    useTransform(
      progress,
      [0, 0.5, 1],
      depth === "mid"
        ? [1 - (1 - PARALLAX.midScale) * amp, 1, 1 - (1 - PARALLAX.midScale) * amp]
        : [1, 1, 1]
    ),
    SPRING
  )
  const rotate = useSpring(
    useTransform(
      progress,
      [0, 1],
      depth === "front"
        ? [-PARALLAX.rotate * amp * tilt, PARALLAX.rotate * amp * tilt]
        : [0, 0]
    ),
    SPRING
  )

  return (
    <motion.div className={className} style={{ y, scale, rotate }}>
      {children}
    </motion.div>
  )
}
