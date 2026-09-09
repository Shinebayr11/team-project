"use client"

import { useCallback, useEffect, useState } from "react"

import { useApiClient } from "./useApiClient"
import { AuctionProduct } from "./useAuction"

export interface ShopSeller {
  _id: string
  display_name?: string
  shop_name?: string
  avatar_url?: string
  cover_url?: string
  storeName?: string
  storeSlug?: string
  category?: string
  isActive?: boolean
  followersCount?: number
  since?: string
}

/** Дэлгүүрийн харагдах нэр — дэлгүүрийн нэр байвал түүнийг эрхэмлэнэ. */
export const shopName = (seller: ShopSeller) =>
  seller.storeName || seller.shop_name || seller.display_name || "Дэлгүүр"

/**
 * Дэлгүүрийн хуудасны өгөгдөл.
 *
 * `key` нь хэрэглэгчийн id, дэлгүүрийн хаяг, дэлгүүрийн нэр эсвэл хэрэглэгчийн
 * нэр байж болно — картуудаас ирдэг хуучин `?seller=<нэр>` холбоосууд ч
 * ажиллана.
 */
export function useSellerShop(key: string | null) {
  const { callApi } = useApiClient()
  const [seller, setSeller] = useState<ShopSeller | null>(null)
  const [products, setProducts] = useState<AuctionProduct[]>([])
  const [settled, setSettled] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    if (!key) return
    const { data } = await callApi<{ data: ShopSeller }>(
      `/api/seller/shop/${encodeURIComponent(key)}`
    )
    setSeller(data)

    // Бараа нь худалдагчийн id-гаар татагдана — нэр давхардаж болно, id үгүй.
    const { products: rows } = await callApi<{ products: AuctionProduct[] }>(
      `/api/product?seller_id=${data._id}`
    )
    setProducts(rows)
  }, [callApi, key])

  useEffect(() => {
    if (!key) return

    let cancelled = false
    load()
      .catch((error) => {
        console.error("Дэлгүүр уншиж чадсангүй:", error)
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setSettled(true)
      })

    return () => {
      cancelled = true
    }
  }, [key, load])

  return { seller, products, loading: !!key && !settled, notFound }
}
