"use client"

import { useEffect, useState } from "react"

const CLOCK_MS = 30_000

/** "1ц 24м" — лайв хэдий хугацаанд үргэлжилж байгаа нь. */
export function useElapsed(startedAt?: string) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CLOCK_MS)
    return () => clearInterval(timer)
  }, [])

  if (!startedAt) return null
  const diff = now - new Date(startedAt).getTime()
  if (diff < 0) return null

  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(mins / 60)
  return hours > 0 ? `${hours}ц ${mins % 60}м` : `${mins}м`
}
