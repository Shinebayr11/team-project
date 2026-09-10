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

/** Дэлгэц дээр харагдах хэлбэр — хожсон лот эсвэл шууд захиалга бүр нэг худалдан авалт. */
export interface MyPurchase {
  id: string
  /** Дуудлага худалдаагаар хожсон эсвэл "Худалдаж авах"-аар шууд авсан эсэх. */
  kind: "auction" | "order"
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

/** Худалдагчийг нь хамт populate хийсэн бараа (`GET /api/order/mine`). */
interface OrderSeller {
  _id: string
  display_name?: string
  shop_name?: string
}
interface OrderProduct extends AuctionProduct {
  seller_id?: OrderSeller | string
}
interface MyOrder {
  _id: string
  product_id?: OrderProduct | string
  quantity: number
  price_coins?: number
  createdAt?: string
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
  kind: "auction",
  title: winProduct(win)?.name ?? "Бараа",
  seller: sellerNameOf(win),
  sellerId: winSeller(win)?._id,
  price: win.current_highest_bid_coins ?? 0,
  date: win.updatedAt,
  description: winProduct(win)?.description,
  showTitle: winShow(win)?.title,
  product: winProduct(win),
})

const orderProduct = (order: MyOrder): OrderProduct | undefined =>
  order.product_id && typeof order.product_id === "object" ? order.product_id : undefined

const orderSeller = (order: MyOrder): OrderSeller | undefined => {
  const seller = orderProduct(order)?.seller_id
  return seller && typeof seller === "object" ? seller : undefined
}

/** "Худалдаж авах" товчоор үүссэн захиалга — хожсон лоттой ижил хэлбэрт оруулна. */
const orderToPurchase = (order: MyOrder): MyPurchase => {
  const product = orderProduct(order)
  const seller = orderSeller(order)
  return {
    id: order._id,
    kind: "order",
    title: product?.name ?? "Бараа",
    seller: seller?.shop_name || seller?.display_name || "Худалдагч",
    sellerId: seller?._id,
    price: order.price_coins ?? 0,
    date: order.createdAt,
    description: product?.description,
    product,
  }
}

/**
 * Профайлын "Худалдан авалт" — жинхэнэ өгөгдөл.
 *
 * Худалдан авалт ХОЁР эх сурвалжтай: дуудлага худалдаагаар хожсон лот, мөн
 * "Худалдаж авах" товчоор үүсгэсэн шууд захиалга (`Order`). Хоёуланг нэг
 * жагсаалтад огноогоор нь эрэмбэлж өгнө. Явж буй саналууд тусад нь ирнэ.
 */
export function useMyPurchases() {
  const { callApi } = useApiClient()
  const { isLoaded, isSignedIn } = useUser()
  const [wins, setWins] = useState<AuctionWin[]>([])
  const [orders, setOrders] = useState<MyOrder[]>([])
  const [bidding, setBidding] = useState<ActiveBidListing[]>([])
  const [settled, setSettled] = useState(false)

  const refresh = useCallback(async () => {
    const [won, active, mine] = await Promise.all([
      callApi<{ data: AuctionWin[] }>("/api/productlisting/wins"),
      callApi<{ data: ActiveBidListing[] }>("/api/productlisting/bidding"),
      callApi<{ data: MyOrder[] }>("/api/order/mine"),
    ])
    setWins(won.data)
    setBidding(active.data)
    setOrders(mine.data)
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

  const purchases = useMemo(
    () =>
      [...wins.map(toPurchase), ...orders.map(orderToPurchase)].sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
      ),
    [wins, orders]
  )
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
