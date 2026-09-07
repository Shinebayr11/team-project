"use client"

import { useCallback, useEffect, useState } from "react"

import { useApiClient } from "./useApiClient"
import { useRequireAuth } from "./useRequireAuth"

export interface FollowedSeller {
  _id: string
  display_name?: string
  shop_name?: string
  avatar_url?: string
}

/** Жагсаалтад харагдах нэр — дэлгүүрийн нэр байвал түүнийг эрхэмлэнэ. */
export const followedSellerName = (seller: FollowedSeller) =>
  seller.shop_name || seller.display_name || "Худалдагч"

/**
 * Дагах/дагахаа болих — серверийн `User.following` дээр тулгуурлана.
 *
 * Өмнө нь энэ нь `store/slices/socialSlice.ts` дотор localStorage-д, худалдагчийн
 * НЭРЭЭР түлхүүрлэгдэн хадгалагддаг байсан: өөр төхөөрөмж дээр алга болдог,
 * худалдагчид хэн дагасныг нь хэзээ ч мэдэхгүй, мөн mock өгөгдлийн нэрнээс өөр
 * юутай ч холбогдохгүй байв. Сервер тал нь ObjectId-гаар түлхүүрлэдэг тул энэ
 * hook мөн адил `sellerId`-гаар ажиллана.
 */
export function useFollow() {
  const { callApi } = useApiClient()
  const { isSignedIn, requireAuth } = useRequireAuth()
  const [sellers, setSellers] = useState<FollowedSeller[]>([])
  const [loading, setLoading] = useState(true)
  /** Яг одоо сервер рүү явж буй худалдагчийн id — товчийг түгжихэд. */
  const [pendingId, setPendingId] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setSellers([])
      setLoading(false)
      return
    }
    try {
      const { data } = await callApi<{ data: FollowedSeller[] }>(
        "/api/users/following"
      )
      setSellers(data)
    } catch (error) {
      console.error("Дагаж буй жагсаалт уншиж чадсангүй:", error)
    } finally {
      setLoading(false)
    }
  }, [callApi, isSignedIn])

  useEffect(() => {
    refresh()
  }, [refresh])

  const isFollowing = useCallback(
    (sellerId?: string) =>
      !!sellerId && sellers.some((s) => String(s._id) === String(sellerId)),
    [sellers]
  )

  /**
   * Товч дарахад шууд харагдацыг сольж, дараа нь серверт баталгаажуулна.
   * Амжилтгүй болвол хуучин байдалд нь буцаана — эс тэгвэл хэрэглэгч дагасан
   * гэж бодоод үлдэнэ.
   */
  const toggleFollow = useCallback(
    (seller: FollowedSeller) => {
      requireAuth(async () => {
        const id = String(seller._id)
        if (!id || pendingId) return

        const wasFollowing = sellers.some((s) => String(s._id) === id)
        const previous = sellers

        setPendingId(id)
        setSellers((current) =>
          wasFollowing
            ? current.filter((s) => String(s._id) !== id)
            : [...current, seller]
        )

        try {
          await callApi(wasFollowing ? "/api/users/unfollow" : "/api/users/follow", {
            method: "POST",
            body: JSON.stringify({ sellerId: id }),
          })
        } catch (error) {
          console.error("Дагах үйлдэл амжилтгүй:", error)
          setSellers(previous)
        } finally {
          setPendingId(null)
        }
      })
    },
    [requireAuth, sellers, pendingId, callApi]
  )

  return {
    sellers,
    loading,
    isFollowing,
    toggleFollow,
    pendingId,
    followingCount: sellers.length,
    refresh,
  }
}
