"use client"

import { useEffect, useRef } from "react"

/**
 * Тогтмол давтан ажиллах хүсэлт — таб нуугдсан үед ЗОГСОНО.
 *
 * Өмнө нь poll бүр өөрийн `setInterval`-тай байсан ба хэрэглэгч өөр таб руу
 * шилжсэн ч ажиллаж, нээлттэй үлдсэн таб бүр сервер рүү хүсэлт цутгасаар
 * байв. Таб руу буцаж ирэхэд шууд нэг удаа ажиллаад цааш үргэлжилнэ —
 * хэрэглэгч хуучирсан өгөгдөл хардаггүй.
 *
 * `callback` нь ref дотор хадгалагдана: дуудагч талд `useCallback` хийгээгүй
 * ч интервал дахин эхлэхгүй.
 */
export function usePoll(
  callback: () => void,
  intervalMs: number,
  enabled = true
) {
  const saved = useRef(callback)

  useEffect(() => {
    saved.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) return

    let timer: ReturnType<typeof setInterval> | null = null

    const stop = () => {
      if (timer) clearInterval(timer)
      timer = null
    }

    const start = () => {
      if (timer) return
      saved.current()
      timer = setInterval(() => saved.current(), intervalMs)
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    if (!document.hidden) start()
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      stop()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [intervalMs, enabled])
}
