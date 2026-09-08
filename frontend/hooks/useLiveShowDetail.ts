"use client"

import { useCallback, useState } from "react"

import { LiveShowDoc } from "@/lib/liveShows"
import { apiFetch } from "@/lib/api"
import { usePoll } from "./usePoll"

/**
 * Үзэгчийн тоо зэрэг өөрчлөгддөг талбарыг шинэлэг байлгахад л хангалттай
 * давтамж. Өмнө нь 2 секунд байсан — үзэгч бүр минутанд 30 хүсэлт явуулж,
 * 100 үзэгчтэй дамжуулалт дээр зөвхөн энэ hook нь 50 req/s болдог байв.
 */
const POLL_MS = 10_000

/**
 * Нэг дамжуулалтын мэдээлэл. `apiFetch`-ийг token-гүй дуудна — GET нь нээлттэй тул
 * landing-аас орж ирсэн зочин ч үзнэ.
 */
export function useLiveShowDetail(showId?: string) {
  const [show, setShow] = useState<LiveShowDoc | null>(null)

  const fetchShow = useCallback(() => {
    if (!showId) return
    apiFetch<{ data: LiveShowDoc | null }>(`/api/liveshow/${showId}`)
      .then((body) => setShow(body.data ?? null))
      .catch(() => {
        // Олдоогүй дамжуулалт гэдэг нь хажуугийн самбар URL-ийн параметрээ
        // ашиглана гэсэн үг — дэлгэц унахгүй.
      })
  }, [showId])

  usePoll(fetchShow, POLL_MS, !!showId)

  return show
}
