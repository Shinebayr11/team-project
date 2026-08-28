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

export interface Amplitude {
  /** Parallax-ийн үржигдэхүүн: 0 | 0.5 | 1. */
  amp: number
  /** rotateX/rotate зөвшөөрөгдөх эсэх (desktop дээр л). */
  tilt: number
  /** Loop, marquee, float ажиллуулж болох эсэх. */
  motionOn: boolean
  mobile: boolean
}

export function useAmplitude(): Amplitude {
  const reduced = useReducedMotion()
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const sync = () => setMobile(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  const motionOn = !reduced
  return {
    amp: !motionOn ? 0 : mobile ? 0.5 : 1,
    tilt: !motionOn || mobile ? 0 : 1,
    motionOn,
    mobile,
  }
}
