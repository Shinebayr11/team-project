"use client"

/**
 * Хуудсын ард тогтмол зогсох өнгөний давхарга.
 *
 * Яагаад scrollYProgress-ыг шууд өнгө рүү хөрвүүлээгүй вэ: section-ууд ижил
 * өндөртэй байх баталгаа алга (mobile дээр контент нь 100svh-ээс өснө). Тиймээс
 * бодит DOM-ын хэмжилтээс "бутархай section индекс" бодно — дэлгэцийн гол ямар
 * хоёр section-ийн голын хооронд явж байгааг хардаг. Дараа нь тэр индексийг
 * SECTIONS-ийн өнгө рүү interpolate хийнэ.
 *
 * Хоёр section-ийн голын хоорондох замын эхний/сүүлийн 30%-д өнгө хөдөлдөггүй
 * (hold), дунд 40%-д нь smoothstep-ээр шилждэг: ингэснээр section дэлгэцийг
 * эзэлж байхдаа өөрийн жинхэнэ өнгөтэй байж, шилжилт нь зааг дээр л болно.
 */

import { useCallback, useEffect, useRef } from "react"
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

import { SECTIONS, SPRING } from "../motion"
import { useAmplitude } from "../useAmplitude"

/** Hold-той шилжилт: 0..1 → 0..1, эхний/сүүлийн 30% нь тэгш. */
function holdEase(blend: number): number {
  const t = Math.min(1, Math.max(0, (blend - 0.3) / 0.4))
  return t * t * (3 - 2 * t)
}

const LAST = SECTIONS.length - 1

export function BackgroundMorph() {
  const { amp } = useAmplitude()
  const { scrollY } = useScroll()
  const centers = useRef<number[]>([])
  /** Бутархай section индекс: 0 → SECTIONS.length - 1. */
  const index = useMotionValue(0)

  const compute = useCallback(
    (y: number) => {
      const list = centers.current
      if (list.length < 2) return 0
      const viewCenter = y + window.innerHeight / 2
      if (viewCenter <= list[0]) return 0
      for (let i = 0; i < list.length - 1; i += 1) {
        if (viewCenter <= list[i + 1]) {
          const span = Math.max(1, list[i + 1] - list[i])
          return i + holdEase((viewCenter - list[i]) / span)
        }
      }
      return LAST
    },
    []
  )

  useEffect(() => {
    const measure = () => {
      centers.current = SECTIONS.map((section) => {
        const node = document.getElementById(section.id)
        if (!node) return 0
        const rect = node.getBoundingClientRect()
        return rect.top + window.scrollY + rect.height / 2
      })
      index.set(compute(window.scrollY))
    }

    measure()

    // Section-ийн өндөр контентоос хамаарна — resize болон font/зураг ачаалагдах
    // үед дахин хэмжинэ.
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener("resize", measure, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [compute, index])

  useMotionValueEvent(scrollY, "change", (y) => index.set(compute(y)))

  const backgroundColor = useTransform(
    index,
    SECTIONS.map((_, i) => i),
    SECTIONS.map((section) => section.bg)
  )

  // Мөн body дээр давхар тавина. Хоёр шалтгаан: (1) rubber-band scroll хийхэд
  // дэлгэцийн зах хуудсын өнгөтэй нэг байна, (2) fixed давхаргын өнгийг
  // тооцоолж чаддаггүй tool-ууд (axe гэх мэт) хуудсыг зөв уншина.
  useMotionValueEvent(backgroundColor, "change", (color) => {
    document.body.style.backgroundColor = color
  })

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor.get()
    return () => {
      document.body.style.removeProperty("background-color")
    }
  }, [backgroundColor])

  // Hero-гийн gradient-ыг өнгө interpolate хийж чадахгүй тул тусдаа давхарга
  // болгож, hero-оос гарах үед нь уусгана.
  const heroGradient = useTransform(index, [0, 0.85], [1, 0])

  const blobA = useSpring(
    useTransform(index, [0, LAST], [0, -220 * amp]),
    SPRING
  )
  const blobB = useSpring(useTransform(index, [0, LAST], [0, 260 * amp]), SPRING)
  const scaleA = useSpring(
    useTransform(index, [0, LAST], [1, 1 + 0.35 * amp]),
    SPRING
  )
  const scaleB = useSpring(
    useTransform(index, [0, LAST], [1 + 0.2 * amp, 1 - 0.1 * amp]),
    SPRING
  )

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: heroGradient,
          backgroundImage:
            "linear-gradient(158deg, var(--wn-accent) 0%, var(--wn-accent-deep) 100%)",
        }}
      />
      <motion.div
        className="absolute top-[8%] left-[-15%] h-[52vmax] w-[52vmax] rounded-full opacity-50 blur-[120px]"
        style={{
          y: blobA,
          scale: scaleA,
          background:
            "radial-gradient(circle, #7c5cff 0%, rgba(124,92,255,0) 70%)",
        }}
      />
      <motion.div
        className="absolute right-[-18%] bottom-[6%] h-[46vmax] w-[46vmax] rounded-full opacity-50 blur-[120px]"
        style={{
          y: blobB,
          scale: scaleB,
          background:
            "radial-gradient(circle, #c9b8ff 0%, rgba(201,184,255,0) 70%)",
        }}
      />
    </motion.div>
  )
}
