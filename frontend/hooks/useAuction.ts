"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useApiClient } from "./useApiClient"

export interface AuctionProduct {
  _id: string
  name: string
  description?: string
  price_coins?: number
  images?: string[]
}

export interface AuctionWinner {
  _id: string
  display_name?: string
  avatar_url?: string
}

export interface Listing {
  _id: string
  product_id?: AuctionProduct | string
  live_show_id?: string
  starting_price_coins?: number
  current_highest_bid_coins?: number | null
  current_winner_id?: AuctionWinner | string | null
  timer_ends_at?: string
  status?: string
}

export interface AuctionBid {
  _id: string
  amount_coins: number
  createdAt: string
  buyer_id?: AuctionWinner | string
}

/** Дараагийн санал хамгийн багадаа хэд байх ёстой — серверийн дүрэмтэй ижил. */
export const minimumBid = (listing: Listing) =>
  listing.current_highest_bid_coins != null
    ? listing.current_highest_bid_coins + 1
    : (listing.starting_price_coins ?? 0)

export const isActive = (listing?: Listing | null) =>
  !!listing && listing.status === "active"

// Дуудлага худалдаа явж байх үед хурдан, бусад үед удаан шалгана. Vercel serverless дээр
// байнга ажилладаг процесс байхгүй тул push биш, татах замаар шинэчилнэ.
const POLL_ACTIVE_MS = 2000
const POLL_IDLE_MS = 10000

/**
 * Нэг лайвын дуудлага худалдааны төлөв: одоо явж буй лот, түүний саналууд.
 * Host болон үзэгч хоёулаа ижил эх сурвалжаас уншина.
 */
export function useAuction(liveShowId?: string) {
  const { callApi } = useApiClient()
  const [listing, setListing] = useState<Listing | null>(null)
  const [bids, setBids] = useState<AuctionBid[]>([])
  const [loading, setLoading] = useState(true)

  // Дараагийн татах хүртэлх хугацааг сонгоход хэрэгтэй. Render үед бус,
  // өгөгдөл ирэх бүрд шинэчилнэ.
  const listingRef = useRef<Listing | null>(null)

  const refresh = useCallback(async () => {
    if (!liveShowId) return
    try {
      const { data } = await callApi<{ data: Listing[] }>(
        `/api/productlisting?live_show_id=${liveShowId}`
      )
      const current = data.find((l) => l.status === "active") ?? data[0] ?? null
      listingRef.current = current
      setListing(current)

      if (current) {
        const { data: bidData } = await callApi<{ data: AuctionBid[] }>(
          `/api/bids?listing_id=${current._id}`
        )
        setBids(bidData)
      } else {
        setBids([])
      }
    } catch (error) {
      console.error("Дуудлага худалдаа уншиж чадсангүй:", error)
    } finally {
      setLoading(false)
    }
  }, [callApi, liveShowId])

  useEffect(() => {
    if (!liveShowId) {
      setLoading(false)
      return
    }
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const tick = async () => {
      if (cancelled) return
      await refresh()
      if (cancelled) return
      timer = setTimeout(
        tick,
        isActive(listingRef.current) ? POLL_ACTIVE_MS : POLL_IDLE_MS
      )
    }
    tick()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [liveShowId, refresh])

  const placeBid = useCallback(
    async (amount: number) => {
      if (!listing) return { ok: false, message: "Дуудлага худалдаа алга" }
      try {
        await callApi(`/api/bids`, {
          method: "POST",
          body: JSON.stringify({ listing_id: listing._id, amount_coins: amount }),
        })
        await refresh()
        return { ok: true }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Санал өгч чадсангүй"
        await refresh()
        return { ok: false, message }
      }
    },
    [callApi, listing, refresh]
  )

  const startAuction = useCallback(
    async (input: {
      product_id: string
      starting_price_coins: number
      duration_seconds: number
    }) => {
      if (!liveShowId) return { ok: false, message: "Лайв тодорхойгүй" }
      try {
        await callApi(`/api/productlisting`, {
          method: "POST",
          body: JSON.stringify({ ...input, live_show_id: liveShowId }),
        })
        await refresh()
        return { ok: true }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Дуудлага худалдаа эхлүүлж чадсангүй"
        return { ok: false, message }
      }
    },
    [callApi, liveShowId, refresh]
  )

  const closeAuction = useCallback(async () => {
    if (!listing) return
    try {
      await callApi(`/api/productlisting/${listing._id}/close`, { method: "POST" })
    } catch (error) {
      console.error("Дуудлага худалдаа хааж чадсангүй:", error)
    }
    await refresh()
  }, [callApi, listing, refresh])

  return { listing, bids, loading, refresh, placeBid, startAuction, closeAuction }
}
