"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useApiClient } from "./useApiClient"
import { AuctionProduct } from "./useAuction"

export interface WinSeller {
  _id: string
  display_name?: string
  shop_name?: string
  avatar_url?: string
}

export interface WinShow {
  _id: string
  title?: string
  seller_id?: WinSeller | string
}

export interface AuctionWin {
  _id: string
  product_id?: AuctionProduct | string
  live_show_id?: WinShow | string
  current_highest_bid_coins?: number | null
  updatedAt?: string
}

export const winProduct = (win: AuctionWin): AuctionProduct | undefined =>
  win.product_id && typeof win.product_id === "object" ? win.product_id : undefined

export const winShow = (win: AuctionWin): WinShow | undefined =>
  win.live_show_id && typeof win.live_show_id === "object"
    ? win.live_show_id
    : undefined

export const winSeller = (win: AuctionWin): WinSeller | undefined => {
  const seller = winShow(win)?.seller_id
  return seller && typeof seller === "object" ? seller : undefined
}

// Уншсан мэдэгдлийг хэрэглэгч тус бүрээр нь тусад нь хадгална — нэг
// browser-ээс хэд хэдэн хүн нэвтэрч болно.
const seenKey = (userId?: string) => `auctionWinsSeen:${userId ?? "anon"}`

const readSeen = (userId?: string): string[] => {
  try {
    const raw = localStorage.getItem(seenKey(userId))
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

const POLL_MS = 20000

/**
 * Хэрэглэгчийн хожсон аукционууд — мэдэгдлийн жагсаалт. Аукцион дуусахад
 * сервер лазигаар хаадаг тул push биш, тогтмол татах замаар шинэчилнэ.
 */
export function useMyWins() {
  const { callApi } = useApiClient()
  const { user, isSignedIn } = useUser()
  const [wins, setWins] = useState<AuctionWin[]>([])
  const [seen, setSeen] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSeen(readSeen(user?.id))
  }, [user?.id])

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setWins([])
      setLoading(false)
      return
    }
    try {
      const { data } = await callApi<{ data: AuctionWin[] }>(
        "/api/productlisting/wins"
      )
      setWins(data)
    } catch (error) {
      console.error("Хожсон аукцион уншиж чадсангүй:", error)
    } finally {
      setLoading(false)
    }
  }, [callApi, isSignedIn])

  useEffect(() => {
    if (!isSignedIn) {
      setWins([])
      setLoading(false)
      return
    }
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const tick = async () => {
      if (cancelled) return
      await refresh()
      if (cancelled) return
      timer = setTimeout(tick, POLL_MS)
    }
    tick()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [isSignedIn, refresh])

  const unseenCount = useMemo(
    () => wins.filter((win) => !seen.includes(win._id)).length,
    [wins, seen]
  )

  /** Мэдэгдлийн жагсаалтыг нээхэд бүгдийг уншсанд тооцно. */
  const markAllSeen = useCallback(() => {
    const ids = wins.map((win) => win._id)
    setSeen(ids)
    try {
      localStorage.setItem(seenKey(user?.id), JSON.stringify(ids))
    } catch {
      // Хувийн горим гэх мэт хадгалах боломжгүй үед мэдэгдэл дахин
      // тоологдох нь болно — гэхдээ програм ажиллахад саад болохгүй.
    }
  }, [wins, user?.id])

  const isUnseen = useCallback(
    (id: string) => !seen.includes(id),
    [seen]
  )

  return { wins, loading, unseenCount, markAllSeen, isUnseen, refresh }
}
