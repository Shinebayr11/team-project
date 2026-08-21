"use client"

import { useEffect, useState } from "react"

const secondsLeft = (endsAt?: string) => {
  if (!endsAt) return 0
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000))
}

const format = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`

/**
 * Аукционы үлдсэн хугацаа. Сервер жинхэнэ дуусах мөчийг эзэмшинэ — энэ нь
 * зөвхөн тэр мөчийг тоолж харуулна.
 */
export function useCountdown(endsAt?: string) {
  // The remaining time is derived from `endsAt` on every render, so the tick
  // only needs to force that render — keeping a copy in state would just have
  // to be re-synced whenever `endsAt` changed.
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!endsAt) return

    const timer = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(timer)
  }, [endsAt])

  const seconds = secondsLeft(endsAt)
  return { seconds, label: format(seconds) }
}
