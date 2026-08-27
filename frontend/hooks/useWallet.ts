"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useApiClient } from "./useApiClient"

export interface WalletBalance {
  coin_balance?: number
  held_coins?: number
}

/**
 * Нэвтэрсэн хэрэглэгчийн зоосны үлдэгдэл. Аукционд амласан (`held_coins`) зоос
 * нь өөр лот дээр барьцаанд байгаа тул зарцуулж болох дүнгээс хасагдана.
 */
export function useWallet() {
  const { isSignedIn } = useUser()
  const { callApi } = useApiClient()
  const [wallet, setWallet] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(true)
  // Уншилт бүтэлгүйтвэл үлдэгдэл нь 0 биш, "мэдэгдэхгүй". Энэ хоёрыг ялгахгүй
  // бол сүлжээний алдаа хэрэглэгчид "үлдэгдэл хүрэлцэхгүй" мэт харагдана.
  const [failed, setFailed] = useState(false)

  // Санал өгөх бүрд дахин уншдаг тул хэд хэдэн хүсэлт зэрэг явж болно.
  // Хоцорч ирсэн хариу шинийг дарж бичвэл хуучин үлдэгдэл харагдана.
  const latest = useRef(0)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setWallet(null)
      setLoading(false)
      return
    }
    const ticket = ++latest.current
    try {
      const { data } = await callApi<{ data: WalletBalance | null }>("/api/wallet")
      if (!alive.current || ticket !== latest.current) return
      setWallet(data)
      setFailed(false)
    } catch (error) {
      console.error("Хэтэвч уншиж чадсангүй:", error)
      if (!alive.current || ticket !== latest.current) return
      setFailed(true)
    } finally {
      if (alive.current && ticket === latest.current) setLoading(false)
    }
  }, [callApi, isSignedIn])

  useEffect(() => {
    refresh()
  }, [refresh])

  const balance = wallet?.coin_balance ?? 0
  const held = wallet?.held_coins ?? 0

  return {
    balance,
    held,
    available: Math.max(0, balance - held),
    loading,
    failed,
    refresh,
  }
}
