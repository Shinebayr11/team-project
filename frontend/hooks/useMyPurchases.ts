"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "./useApiClient"
import { AuctionProduct } from "./useAuction"
import { AuctionWin, winProduct, winSeller, winShow } from "./useMyWins"

/** Явж буй лот дээрх миний санал. `leading`-ийг сервер тооцож өгнө. */
interface ActiveBidListing extends AuctionWin {
  starting_price_coins?: number
  timer_ends_at?: string
  leading?: boolean
}

/** Дэлгэц дээр харагдах хэлбэр — хожсон лот бүр нэг худалдан авалт. */
export interface MyPurchase {
  id: string
  title: string
  seller: string
  /** Худалдагчтай холбогдох — id байхгүй бол товч гарахгүй. */
  sellerId?: string
  price: number
  date?: string
  /** Дэлгэрэнгүйд харуулах — барааны тайлбар, ямар шууд дамжуулалт дээр зарагдсан. */
  description?: string
  showTitle?: string
  product?: AuctionProduct
}

export interface MyActiveBid extends MyPurchase {
  leading: boolean
}

const sellerNameOf = (win: AuctionWin) => {
  const seller = winSeller(win)
  return seller?.shop_name || seller?.display_name || "Худалдагч"
}

const toPurchase = (win: AuctionWin): MyPurchase => ({
  id: win._id,
  title: winProduct(win)?.name ?? "Бараа",
  seller: sellerNameOf(win),
  sellerId: winSeller(win)?._id,
  price: win.current_highest_bid_coins ?? 0,
  date: win.updatedAt,
  description: winProduct(win)?.description,
  showTitle: winShow(win)?.title,
  product: winProduct(win),
})

/**
 * Профайлын "Худалдан авалт" — жинхэнэ өгөгдөл.
 *
 * Энэ апп дээр худалдан авалт гэдэг нь дуудлага худалдаагаар хожсон лот юм
 * (`Order` цуглуулга бодитоор бөглөгддөггүй). Явж буй саналууд тусад нь ирнэ.
 */
export function useMyPurchases() {
  const { callApi } = useApiClient()
  const { isLoaded, isSignedIn } = useUser()
  const [wins, setWins] = useState<AuctionWin[]>([])
  const [bidding, setBidding] = useState<ActiveBidListing[]>([])
  const [settled, setSettled] = useState(false)

  const refresh = useCallback(async () => {
    const [won, active] = await Promise.all([
      callApi<{ data: AuctionWin[] }>("/api/productlisting/wins"),
      callApi<{ data: ActiveBidListing[] }>("/api/productlisting/bidding"),
    ])
    setWins(won.data)
    setBidding(active.data)
  }, [callApi])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    refresh()
      .catch((error) => console.error("Худалдан авалт уншиж чадсангүй:", error))
      .finally(() => {
        if (!cancelled) setSettled(true)
      })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, refresh])

  const purchases = useMemo(() => wins.map(toPurchase), [wins])
  const activeBids = useMemo<MyActiveBid[]>(
    () => bidding.map((row) => ({ ...toPurchase(row), leading: !!row.leading })),
    [bidding]
  )

  return {
    purchases,
    activeBids,
    loading: !isLoaded || (isSignedIn === true && !settled),
    refresh,
  }
}
