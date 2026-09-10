"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "./useApiClient"
import { AuctionProduct } from "./useAuction"

export interface SaleWinner {
  _id: string
  display_name?: string
  shop_name?: string
  avatar_url?: string
}

export interface SaleShow {
  _id: string
  title?: string
  started_at?: string
}

export interface AuctionSale {
  _id: string
  product_id?: AuctionProduct | string
  live_show_id?: SaleShow | string
  current_winner_id?: SaleWinner | string | null
  current_highest_bid_coins?: number | null
  updatedAt?: string
}

export const saleProduct = (sale: AuctionSale): AuctionProduct | undefined =>
  sale.product_id && typeof sale.product_id === "object" ? sale.product_id : undefined

export const saleShow = (sale: AuctionSale): SaleShow | undefined =>
  sale.live_show_id && typeof sale.live_show_id === "object" ? sale.live_show_id : undefined

export const saleWinner = (sale: AuctionSale): SaleWinner | undefined =>
  sale.current_winner_id && typeof sale.current_winner_id === "object"
    ? sale.current_winner_id
    : undefined

/** Жагсаалтад харагдах нэр — дэлгүүрийн нэр байвал түүнийг эрхэмлэнэ. */
export const winnerName = (winner?: SaleWinner) =>
  winner?.shop_name || winner?.display_name || "Хэрэглэгч"

const POLL_MS = 20000

/**
 * Худалдагчийн зарагдсан лотууд. Шууд дамжуулалт дээрх "Ялагч" тууз дараагийн лот
 * гармагц алга болдог тул хүргэлт, төлбөрөө тохирох зам эфирээс ГАДНА хэрэгтэй.
 */
export function useMySales() {
  const { callApi } = useApiClient()
  const { isLoaded, isSignedIn } = useUser()
  const [sales, setSales] = useState<AuctionSale[]>([])
  const [settled, setSettled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data } = await callApi<{ data: AuctionSale[] }>("/api/productlisting/sales")
    setSales(data)
  }, [callApi])

  // Лот сервер дээр лазигаар хаагддаг тул push биш, тогтмол татах замаар
  // шинэчилнэ — `useMyWins`-тэй ижил зарчим.
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const tick = async () => {
      if (cancelled) return
      try {
        await refresh()
      } catch (loadError) {
        console.error("Зарагдсан бараа уншиж чадсангүй:", loadError)
        if (!cancelled) setError("Зарагдсан бараа уншиж чадсангүй.")
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

  return {
    sales,
    loading: !isLoaded || (isSignedIn === true && !settled),
    error,
    refresh,
  }
}
