"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "@/hooks/useApiClient"
import { useStore } from "@/store"
import { InventoryProduct } from "@/features/seller-hub/types"

/** Серверийн `Product` баримт. Seller Hub-ын талбарууд нэмэлтээр орж ирнэ. */
interface ServerProduct {
  _id: string
  name: string
  description?: string
  price_coins?: number
  stock_quantity?: number
  images?: string[]
  sku?: string
  category?: string
  condition?: string
  listing_type?: InventoryProduct["listingType"]
  status?: InventoryProduct["status"]
  reserved_quantity?: number
  sold_quantity?: number
  createdAt?: string
}

/**
 * Шууд дамжуулалтын "Миний бараа" ба Seller Hub хоёр НЭГ цуглуулгыг хардаг тул нэр,
 * үнэ, нөөц нь хоёр талд ижил байна. Store дахь `inventory` нь энэ серверийн
 * өгөгдлийн кэш — шууд дамжуулалт, тойм, аналитик хуучнаараа түүнийг уншина.
 */
export const toInventoryProduct = (product: ServerProduct): InventoryProduct => ({
  id: product._id,
  name: product.name,
  sku: product.sku ?? "",
  category: product.category ?? "",
  description: product.description ?? "",
  price: product.price_coins ?? 0,
  quantity: product.stock_quantity ?? 0,
  reservedQuantity: product.reserved_quantity ?? 0,
  soldQuantity: product.sold_quantity ?? 0,
  status: product.status ?? "ACTIVE",
  listingType: product.listing_type ?? "buy_it_now",
  condition: product.condition ?? "",
  images: product.images ?? [],
  createdAt: product.createdAt ?? new Date().toISOString(),
})

/** Seller Hub-ын талбаруудыг серверийн нэршилд буулгана. */
const toServerBody = (updates: Partial<InventoryProduct>) => {
  const body: Record<string, unknown> = {}
  if (updates.name !== undefined) body.name = updates.name
  if (updates.description !== undefined) body.description = updates.description
  if (updates.price !== undefined) body.price_coins = updates.price
  if (updates.quantity !== undefined) body.stock_quantity = updates.quantity
  if (updates.images !== undefined) body.images = updates.images
  if (updates.sku !== undefined) body.sku = updates.sku
  if (updates.category !== undefined) body.category = updates.category
  if (updates.condition !== undefined) body.condition = updates.condition
  if (updates.listingType !== undefined) body.listing_type = updates.listingType
  if (updates.status !== undefined) body.status = updates.status
  // `reservedQuantity`/`soldQuantity` энд ЯВАХГҮЙ — тэдгээрийг систем л
  // бичдэг тул сервер ч хүлээж авахаа больсон.
  return body
}

/** Серверээс уншаад store-ын кэшийг солино. */
function useRefreshInventory() {
  const { callApi } = useApiClient()
  const { setInventory } = useStore()

  return useCallback(async () => {
    const { products } = await callApi<{ products: ServerProduct[] }>("/api/product/mine")
    setInventory(products.map(toInventoryProduct))
  }, [callApi, setInventory])
}

/**
 * Барааг нэг л удаа — Seller Hub-ын бүрхүүл дээр уншина. Ингэснээр шууд дамжуулалт, тойм,
 * аналитик бүгд бодит бараагаар ажиллана, дэлгэц бүр дахин татахгүй.
 */
export function useInventoryHydration() {
  const { isLoaded, isSignedIn } = useUser()
  const refresh = useRefreshInventory()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    refresh()
      .catch((loadError) => {
        console.error("Бараагаа уншиж чадсангүй:", loadError)
        if (!cancelled) setError("Бараагаа уншиж чадсангүй.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, refresh])

  return { loading, error }
}

/** Сервер рүү бичээд, амжилттай бол кэшээ шинэчилдэг үйлдлүүд. */
export function useInventoryActions() {
  const { callApi } = useApiClient()
  const refresh = useRefreshInventory()

  const create = useCallback(
    async (
      product: Omit<InventoryProduct, "id" | "createdAt" | "reservedQuantity" | "soldQuantity">
    ) => {
      await callApi("/api/product", {
        method: "POST",
        body: JSON.stringify(toServerBody(product)),
      })
      await refresh()
    },
    [callApi, refresh]
  )

  const update = useCallback(
    async (id: string, updates: Partial<InventoryProduct>) => {
      await callApi(`/api/product/${id}`, {
        method: "PATCH",
        body: JSON.stringify(toServerBody(updates)),
      })
      await refresh()
    },
    [callApi, refresh]
  )

  const remove = useCallback(
    async (id: string) => {
      await callApi(`/api/product/${id}`, { method: "DELETE" })
      await refresh()
    },
    [callApi, refresh]
  )

  return { create, update, remove, refresh }
}
