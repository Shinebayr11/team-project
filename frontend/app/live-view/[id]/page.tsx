'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { useLiveShowDetail } from '@/hooks/useLiveShowDetail'

/**
 * OBS-ийн үеийн үлдэгдэл зам.
 *
 * Энэ хуудас нүцгэн видео тайз + толгойн мөрөөс бүрдэж байсан бөгөөд
 * `components/live/live-viewer.tsx` доторх бүрэн загварыг (худалдагчийн самбар,
 * барааны жагсаалт, дуудлага худалдаа, чат) орлож чадахгүй байв. Тиймээс
 * үзэгчийг жинхэнэ дэлгэц рүү нь дамжуулна — өмнө тараасан холбоос, bookmark
 * эвдрэхгүй.
 */
export default function LiveViewRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const showId = params.id as string
  const show = useLiveShowDetail(showId)

  useEffect(() => {
    if (!show?.livekit_room_name) return
    const title = encodeURIComponent(show.title ?? '')
    router.replace(
      `/live/${show.livekit_room_name}?host=0&title=${title}&showId=${showId}`
    )
  }, [show, showId, router])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-[15px] font-[500] text-[var(--wn-ink-3)]">
        Дамжуулалт руу шилжиж байна...
      </p>
    </div>
  )
}
