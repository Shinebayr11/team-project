"use client"

import { useCallback, useEffect, useState } from "react"

import { useApiClient } from "./useApiClient"

/** Худалдагч нь бараатай ХАМТ ирдэг (`GET /api/product/:id` populate хийдэг). */
export interface ProductSeller {
  _id: string
  display_name?: string
  shop_name?: string
  avatar_url?: string
  sellerProfile?: {
    storeName?: string
    storeSlug?: string
    category?: string
  }
}

export interface ShopProduct {
  _id: string
  name: string
  description?: string
  price_coins?: number
  stock_quantity?: number
  images?: string[]
  category?: string
  condition?: string
  status?: "ACTIVE" | "DRAFT" | "ARCHIVED" | "OUT_OF_STOCK"
  seller_id?: ProductSeller | string
}

/** Populate хийгдсэн эсэхийг ялгана — id хэвээр ирвэл дэлгүүрийн мэдээлэл байхгүй. */
export const sellerOf = (product: ShopProduct | null): ProductSeller | null =>
  product && typeof product.seller_id === "object" ? product.seller_id : null

export const productShopName = (seller: ProductSeller | null) =>
  seller?.sellerProfile?.storeName ||
  seller?.shop_name ||
  seller?.display_name ||
  "Дэлгүүр"

/** Дэлгүүр рүү очих түлхүүр — хаяг байвал уншигдахуйц, үгүй бол id. */
export const shopKeyOf = (seller: ProductSeller | null) =>
  seller?.sellerProfile?.storeSlug || seller?._id || ""

export function useProduct(id: string | null) {
  const { callApi } = useApiClient()
  const [product, setProduct] = useState<ShopProduct | null>(null)
  const [settled, setSettled] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    const { product: row } = await callApi<{ product: ShopProduct }>(
      `/api/product/${encodeURIComponent(id)}`
    )
    setProduct(row)
  }, [callApi, id])

  useEffect(() => {
    if (!id) {
      setSettled(true)
      return
    }

    let cancelled = false
    setSettled(false)
    setNotFound(false)

    load()
      .catch((error) => {
        console.error("Бараа уншиж чадсангүй:", error)
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setSettled(true)
      })

    return () => {
      cancelled = true
    }
  }, [id, load])

  return { product, loading: !!id && !settled, notFound }
}
