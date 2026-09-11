"use client"

/**
 * Хөдөлгөөний далайцыг орчноос хамааруулж тохируулна.
 *
 *  - `prefers-reduced-motion: reduce` → далайц 0 (бүх parallax зогсоно, зөвхөн
 *    opacity fade үлдэнэ)
 *  - Mobile (< 768px) → далайц 50%, 3D налуу (rotateX) бүрэн хасагдана
 */

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

const MOBILE_QUERY = "(max-width: 767px)"
/** Tailwind-ийн `lg`. Sticky/scroll-linked зохион байгуулалт эндээс эхэлнэ. */
const WIDE_QUERY = "(min-width: 1024px)"

export interface Amplitude {
  /** Parallax-ийн үржигдэхүүн: 0 | 0.5 | 1. */
  amp: number
  /** rotateX/rotate зөвшөөрөгдөх эсэх (desktop дээр л). */
  tilt: number
  /** Loop, marquee, float ажиллуулж болох эсэх. */
  motionOn: boolean
  mobile: boolean
  /**
   * `lg`-ээс дээш үү. Sticky, scroll-д уясан алхам зэрэг ЗӨВХӨН өргөн дэлгэц
   * дээр утгатай зүйлс үүнийг шалгана.
   *
   * ЗӨВХӨН ЛОГИКТ. Зохион байгуулалтыг үүгээр битгий сольж болно: серверт
   * `false` тул эхний render дээр narrow хувилбар гарч, дараа нь үсэрнэ.
   * Layout-ийг `lg:` класcаар л сольж байгаа шалтгаан энэ.
   */
  wide: boolean
}

export function useAmplitude(): Amplitude {
  const reduced = useReducedMotion()
  const [mobile, setMobile] = useState(false)
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const narrow = window.matchMedia(MOBILE_QUERY)
    const large = window.matchMedia(WIDE_QUERY)
    const sync = () => {
      setMobile(narrow.matches)
      setWide(large.matches)
    }
    sync()
    narrow.addEventListener("change", sync)
    large.addEventListener("change", sync)
    return () => {
      narrow.removeEventListener("change", sync)
      large.removeEventListener("change", sync)
    }
  }, [])

  const motionOn = !reduced
  return {
    amp: !motionOn ? 0 : mobile ? 0.5 : 1,
    tilt: !motionOn || mobile ? 0 : 1,
    motionOn,
    mobile,
    wide,
  }
}
