"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "@/hooks/useApiClient"
import { useStore } from "@/store"
import { SellerOrder } from "@/features/seller-hub/types"

/** Серверийн `Order` баримтын Seller Hub-д хэрэгтэй хэсэг. */
interface ServerOrder {
  _id: string
  buyer_name?: string
  items?: {
    product_id?: string
    name: string
    sku?: string
    price_coins: number
    quantity: number
  }[]
  total_coins?: number
  payment_status?: SellerOrder["paymentStatus"]
  fulfillment_status?: SellerOrder["fulfillmentStatus"]
  shipping_address?: Partial<SellerOrder["shippingAddress"]>
  tracking_number?: string
  carrier?: string
  createdAt?: string
}

const EMPTY_ADDRESS: SellerOrder["shippingAddress"] = {
  fullName: "",
  addressLine1: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Mongolia",
}

export const toSellerOrder = (order: ServerOrder): SellerOrder => ({
  id: order._id,
  buyerName: order.buyer_name || "Хэрэглэгч",
  date: order.createdAt ?? new Date().toISOString(),
  total: order.total_coins ?? 0,
  paymentStatus: order.payment_status ?? "PENDING",
  fulfillmentStatus: order.fulfillment_status ?? "PENDING",
  items: (order.items ?? []).map((item) => ({
    productId: item.product_id ?? "",
    name: item.name,
    sku: item.sku ?? "",
    price: item.price_coins,
    qty: item.quantity,
  })),
  shippingAddress: { ...EMPTY_ADDRESS, ...order.shipping_address },
  trackingNumber: order.tracking_number,
  carrier: order.carrier,
})

/**
 * Худалдагчийн захиалгыг серверээс уншиж store-ын кэшид тавина.
 *
 * "Захиалга" дэлгэц ба БҮХ аналитик (орлого, дундаж чек, топ бараа, sell-through)
 * `state.sellerOrders`-оос бодогддог тул энэ нэг дуудлага тэр бүхнийг тэжээнэ.
 *
 * Хоосон хариу ирвэл `seedOrders.ts` дахь үзүүлэнгийн өгөгдөл ХЭВЭЭР үлдэнэ:
 * эс тэгвэл захиалга хараахан аваагүй бүх худалдагчийн самбар цоо хоосон болж,
 * өнөөг хүртэлх демо зан алдагдана.
 */
export function useSellerOrdersHydration() {
  const { isLoaded, isSignedIn } = useUser()
  const { callApi } = useApiClient()
  const { setSellerOrders } = useStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    callApi<{ orders: ServerOrder[] }>("/api/order/mine")
      .then((res) => {
        if (!cancelled && res.orders.length) {
          setSellerOrders(res.orders.map(toSellerOrder))
        }
      })
      .catch((loadError) => {
        console.error("Захиалгаа уншиж чадсангүй:", loadError)
        if (!cancelled) setError("Захиалгаа уншиж чадсангүй.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, callApi, setSellerOrders])

  return { loading, error }
}
