"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "./useApiClient"
import { AuctionProduct } from "./useAuction"
import type { SellerOrder } from "@/features/seller-hub/types"

export interface OrderBuyer {
  _id: string
  display_name?: string
  shop_name?: string
  avatar_url?: string
}

export interface OrderShippingAddress {
  fullName: string
  phone: string
  city: string
  district: string
  khoroo?: string
  detail: string
}

export interface DirectOrder {
  /** Нэрийн хуулбар — бүртгэл устсан ч захиалга уншигдана. */
  buyer_name?: string
  _id: string
  product_id?: AuctionProduct | string
  buyer_id?: OrderBuyer | string
  quantity: number
  price_coins?: number
  status?: string
  fulfillment_status?: SellerOrder["fulfillmentStatus"]
  carrier?: string
  tracking_number?: string
  shipping_address?: OrderShippingAddress
  createdAt?: string
  updatedAt?: string
}

export const orderProduct = (order: DirectOrder): AuctionProduct | undefined =>
  order.product_id && typeof order.product_id === "object" ? order.product_id : undefined

export const orderBuyer = (order: DirectOrder): OrderBuyer | undefined =>
  order.buyer_id && typeof order.buyer_id === "object" ? order.buyer_id : undefined

export const orderBuyerName = (buyer?: OrderBuyer) =>
  buyer?.shop_name || buyer?.display_name || "Хэрэглэгч"

const POLL_MS = 20000

/**
 * Худалдагчийн барааг шууд ("Худалдаж авах") худалдаж авсан захиалгууд.
 * `useMySales.ts`-тэй яг ижил polling зарчим — эсрэг тал нь дуудлага
 * худалдаа биш шууд захиалга.
 */
export function useMySellerOrders() {
  const { callApi } = useApiClient()
  const { isLoaded, isSignedIn } = useUser()
  const [orders, setOrders] = useState<DirectOrder[]>([])
  const [settled, setSettled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data } = await callApi<{ data: DirectOrder[] }>("/api/order/seller")
    setOrders(data)
  }, [callApi])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const tick = async () => {
      if (cancelled) return
      try {
        await refresh()
      } catch (loadError) {
        console.error("Захиалга уншиж чадсангүй:", loadError)
        if (!cancelled) setError("Захиалга уншиж чадсангүй.")
      }
      if (cancelled) return
      setSettled(true)
      timer = setTimeout(tick, POLL_MS)
    }
    tick()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [isLoaded, isSignedIn, refresh])

  const updateStatus = useCallback(
    async (id: string, status: SellerOrder["fulfillmentStatus"]) => {
      await callApi(`/api/order/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ fulfillment_status: status }),
      })
      await refresh()
    },
    [callApi, refresh]
  )

  const updateTracking = useCallback(
    async (id: string, carrier: string, trackingNumber: string) => {
      await callApi(`/api/order/${id}/tracking`, {
        method: "PATCH",
        body: JSON.stringify({ carrier, tracking_number: trackingNumber }),
      })
      await refresh()
    },
    [callApi, refresh]
  )

  return {
    orders,
    loading: !isLoaded || (isSignedIn === true && !settled),
    error,
    refresh,
    updateStatus,
    updateTracking,
  }
}
