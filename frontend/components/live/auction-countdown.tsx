"use client"

import { useEffect, useState } from "react"

const secondsLeft = (endsAt?: string) => {
  if (!endsAt) return 0
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000))
}

const format = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`

/** Сүүлийн ийм секундэд үлдэхэд тоолуур "яаралтай" болж улаан өнгөтэй болно. */
export const URGENT_SECONDS = 10

/**
 * Дуудлага худалдааны үлдсэн хугацаа. Сервер жинхэнэ дуусах мөчийг эзэмшинэ — энэ нь
 * зөвхөн тэр мөчийг тоолж харуулна.
 *
 * `progress` нь 1 → 0 хооронд буурах бөгөөд цагирган индикаторт зориулагдсан.
 * Сервер лотын нийт үргэлжлэх хугацааг буцаадаггүй тул нэг `endsAt`-ийн хувьд
 * ажигласан хамгийн их үлдэгдлийг нийт хугацаа болгон авна.
 */
export function useCountdown(endsAt?: string) {
  // The remaining time is derived from `endsAt` on every render, so the tick
  // only needs to force that render — keeping a copy in state would just have
  // to be re-synced whenever `endsAt` changed.
  const [, setTick] = useState(0)
  const [span, setSpan] = useState<{ endsAt?: string; total: number }>(() => ({
    endsAt,
    total: secondsLeft(endsAt),
  }))

  useEffect(() => {
    if (!endsAt) return

    const timer = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(timer)
  }, [endsAt])

  const seconds = secondsLeft(endsAt)

  // Нэг `endsAt`-ийн хувьд үлдэгдэл зөвхөн буурдаг тул нийт хугацааг эхэлж
  // ажигласан үедээ л тогтооно. Сервер таймерыг сунгавал `endsAt` өөрөө
  // солигдох тул цагираг шинэ хугацаагаараа дүүрнэ. Render дотор төлөв
  // тохируулах нь props-оос гаралтай утгыг шинэчлэх зөвшөөрөгдсөн хэв маяг.
  if (span.endsAt !== endsAt) {
    setSpan({ endsAt, total: seconds })
  }

  const total = span.endsAt === endsAt ? span.total : seconds
  return {
    seconds,
    label: format(seconds),
    progress: total > 0 ? seconds / total : 0,
    urgent: seconds > 0 && seconds <= URGENT_SECONDS,
  }
}

/**
 * Үлдсэн хугацааг тойрог хэлбэрээр харуулна. Цагираг нь цагийн зүүний дагуу
 * хоосорч, сүүлийн секундүүдэд улаан болно.
 */
export function CountdownRing({
  seconds,
  progress,
  urgent,
  size = 46,
}: {
  seconds: number
  progress: number
  urgent: boolean
  size?: number
}) {
  const stroke = 3
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const tone = urgent ? "var(--wn-live)" : "var(--wn-accent)"

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="timer"
      aria-live="off"
      aria-label={`${seconds} секунд үлдлээ`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--wn-line-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - Math.min(1, Math.max(0, progress)))}
          className="transition-[stroke-dashoffset,stroke] duration-1000 ease-linear motion-reduce:transition-none"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-[15px] font-[800] tabular-nums ${
          urgent ? "text-[var(--wn-live-deep)]" : "text-[var(--wn-ink)]"
        }`}
      >
        {seconds}
      </span>
    </div>
  )
}
