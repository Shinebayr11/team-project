'use client'

import { useCallback, useEffect, useState } from 'react'
import { Heart, Users } from 'lucide-react'

import { useApiClient } from '@/hooks/useApiClient'
import { useRequireAuth } from '@/hooks/useRequireAuth'

interface LiveShowHeaderProps {
  showId: string
}

interface Seller {
  _id?: string
  display_name?: string
  avatar_url?: string
  shop_name?: string
}

interface ShowData {
  _id?: string
  title?: string
  /** Сервер `seller_id`-г populate хийж буцаадаг — тохируулаагүй бол зүгээр id. */
  seller_id?: Seller | string
  viewer_count?: number
  category?: string
}

interface CurrentUser {
  _id?: string
  following?: string[]
}

const sellerOf = (show: ShowData | null): Seller | undefined =>
  show && typeof show.seller_id === 'object' ? show.seller_id : undefined

const sellerIdOf = (show: ShowData | null): string | undefined =>
  !show
    ? undefined
    : typeof show.seller_id === 'string'
      ? show.seller_id
      : show.seller_id?._id

const VIEWER_POLL_MS = 5000

export function LiveShowHeader({ showId }: LiveShowHeaderProps) {
  const { callApi } = useApiClient()
  const { isSignedIn, requireAuth } = useRequireAuth()
  const [show, setShow] = useState<ShowData | null>(null)
  const [viewerCount, setViewerCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [me, setMe] = useState<CurrentUser | null>(null)
  // Товч дарсны дараах локал төлөв. `null` бол серверийн утгыг дагана.
  const [followOverride, setFollowOverride] = useState<boolean | null>(null)
  const [followLoading, setFollowLoading] = useState(false)

  // Шоуны мэдээлэл нэг л удаа — 5 секунд тутам дахин татах шаардлагагүй.
  useEffect(() => {
    let cancelled = false
    callApi<{ data: ShowData }>(`/api/liveshow/${showId}`)
      .then(({ data }) => {
        if (!cancelled) setShow(data)
      })
      .catch((err) => console.error('Шоуны мэдээлэл татаж чадсангүй:', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [showId, callApi])

  // Үзэгчийн тоо л шинэчлэгдэнэ.
  useEffect(() => {
    let cancelled = false
    const poll = () =>
      callApi<{ viewerCount?: number }>(`/api/liveshow/${showId}/participants`)
        .then((res) => {
          if (!cancelled) setViewerCount(res.viewerCount || 0)
        })
        .catch(() => {})

    poll()
    const interval = setInterval(poll, VIEWER_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [showId, callApi])

  // Дагаж буй эсэхийг серверээс уншина — эс тэгвэл товч дахин ачаалах бүрд
  // "дагаагүй" төлөвөөс эхэлж, хэрэглэгчийг андуурна.
  useEffect(() => {
    if (!isSignedIn) return
    let cancelled = false
    callApi<{ data: CurrentUser }>('/api/users/me')
      .then(({ data }) => {
        if (!cancelled) setMe(data)
      })
      .catch((err) => console.error('Хэрэглэгч уншиж чадсангүй:', err))
    return () => {
      cancelled = true
    }
  }, [isSignedIn, callApi])

  const sellerId = sellerIdOf(show)
  const followedOnServer =
    isSignedIn &&
    !!sellerId &&
    !!me?.following?.some((id) => String(id) === String(sellerId))
  const isFollowing = followOverride ?? followedOnServer

  const handleFollow = useCallback(() => {
    requireAuth(async () => {
      if (!sellerId || followLoading) return

      setFollowLoading(true)
      const next = !isFollowing
      try {
        // `callApi` Clerk-ийн токеныг Authorization толгойд нэмнэ — эдгээр
        // маршрут `requireAuth`-тай тул түүнгүйгээр үргэлж 401 буцдаг байв.
        await callApi(next ? '/api/users/follow' : '/api/users/unfollow', {
          method: 'POST',
          body: JSON.stringify({ sellerId }),
        })
        setFollowOverride(next)
      } catch (err) {
        console.error('Дагах үйлдэл амжилтгүй:', err)
      } finally {
        setFollowLoading(false)
      }
    })
  }, [requireAuth, sellerId, followLoading, isFollowing, callApi])

  if (loading) return null

  const seller = sellerOf(show)
  const sellerName = seller?.shop_name || seller?.display_name || 'Худалдагч'
  const sellerAvatar = seller?.avatar_url
  // Өөрийнхөө шоун дээр "дагах" товч утгагүй — сервер ч 400 буцаадаг.
  const isOwnShow = !!me?._id && !!sellerId && String(me._id) === String(sellerId)

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
      <div className="flex items-start justify-between">
        {/* Seller Info */}
        <div className="flex items-center gap-3">
          {sellerAvatar ? (
            <img
              src={sellerAvatar}
              alt={sellerName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {sellerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{sellerName}</p>
            {show?.title && (
              <p className="text-white/80 text-xs truncate">{show.title}</p>
            )}
          </div>
        </div>

        {/* Viewer Count + Follow */}
        <div className="flex items-center gap-3">
          {/* Viewer Count */}
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold">{viewerCount}</span>
          </div>

          {/* Follow Button */}
          {!isOwnShow && sellerId && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              aria-pressed={isFollowing}
              aria-label={isFollowing ? 'Дагахаа болих' : 'Дагах'}
              className={`rounded-full p-2 transition-colors ${
                isFollowing
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-white/20 hover:bg-white/30'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart
                className="w-5 h-5"
                fill={isFollowing ? 'currentColor' : 'none'}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
