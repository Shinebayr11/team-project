"use client"

/**
 * Landing-ийн scroll суурь.
 *
 * Хоёр зүйлийг хариуцна:
 *  1. Lenis — хуудсын smooth scroll. `prefers-reduced-motion` үед бүрэн
 *     унтарч, browser-ийн native scroll хэвээр үлдэнэ.
 *  2. Идэвхтэй section — дэлгэцийн голыг огтолж буй section-ийг
 *     IntersectionObserver-ээр хөөнө. Header-ийн текстийн өнгө болон доод nav
 *     хоёулаа үүнээс уншина, тиймээс хоёул үргэлж ижил section дээр байна.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import Lenis from "lenis"
import { useReducedMotion } from "framer-motion"

import { LENIS, SECTIONS, type SectionSpec } from "../motion"

interface ScrollContextValue {
  /** SECTIONS доторх идэвхтэй section-ийн индекс. */
  activeIndex: number
  /** Идэвхтэй section-ийн тодорхойлолт. */
  active: SectionSpec
  /** Section руу гөлгөр гүйлгэнэ (reduced-motion үед шууд үсэрнэ). */
  scrollToSection: (id: string) => void
  /** Хөдөлгөөн зөвшөөрөгдсөн эсэх — parallax, loop, float бүгд үүнийг шалгана. */
  motionOn: boolean
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useLandingScroll(): ScrollContextValue {
  const value = useContext(ScrollContext)
  if (!value) {
    throw new Error("useLandingScroll must be used inside <ScrollProvider>")
  }
  return value
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  const motionOn = !reduced
  const lenisRef = useRef<Lenis | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!motionOn) return

    const lenis = new Lenis({ lerp: LENIS.lerp, duration: LENIS.duration })
    lenisRef.current = lenis

    // Lenis-ийг хуудсын rAF дээр л эргүүлнэ — өөрийн гэсэн listener нэмэхгүй.
    let frame = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    })

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [motionOn])

  useEffect(() => {
    // rootMargin -50%/-50% нь root-ыг дэлгэцийн голын шугам болгож хумина:
    // яг нэг section л зэрэг огтолно.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = SECTIONS.findIndex((s) => s.id === entry.target.id)
          if (index >= 0) setActiveIndex(index)
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    )

    for (const section of SECTIONS) {
      const node = document.getElementById(section.id)
      if (node) observer.observe(node)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(`#${id}`)
      return
    }
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "auto", block: "start" })
  }, [])

  const value = useMemo<ScrollContextValue>(
    () => ({
      activeIndex,
      active: SECTIONS[activeIndex] ?? SECTIONS[0],
      scrollToSection,
      motionOn,
    }),
    [activeIndex, scrollToSection, motionOn]
  )

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  )
}
