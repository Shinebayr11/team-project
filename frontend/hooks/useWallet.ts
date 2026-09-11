"use client"

import { useCallback, useSyncExternalStore } from "react"
import { useUser } from "@clerk/nextjs"
import { useApiClient } from "./useApiClient"
import { useLoad } from "./useLoad"

export interface WalletBalance {
  coin_balance?: number
  held_coins?: number
}

/**
 * Үлдэгдэл нь МОДУЛИЙН хэмжээнд ганц удаа амьдарна. Өмнө нь `useWallet`
 * дуудсан component бүр өөрийн `useState`-тэй байсан тул нэг нь (жишээ нь
 * "Дансаа цэнэглэх" хуудас) шинэчлэхэд бусад нь — ялангуяа навбар дээрх дүн —
 * хуучин утгаа барьсаар байж, хуудсаа refresh хийж байж л шинэчлэгддэг байв.
 *
 * `useSyncExternalStore` нь захиалагч бүрийг нэг агшны зурагтай синк байлгана:
 * хаанаас ч `refresh()` дуудахад БҮХ хэрэглэгч нэг дор шинэчлэгдэнэ.
 */
type Snapshot = {
  wallet: WalletBalance | null
  loading: boolean
  failed: boolean
}

let snapshot: Snapshot = { wallet: null, loading: true, failed: false }
const listeners = new Set<() => void>()

// Шинэ объект үүсгэж байж л `useSyncExternalStore` өөрчлөлтийг анзаарна.
const setSnapshot = (next: Partial<Snapshot>) => {
  snapshot = { ...snapshot, ...next }
  listeners.forEach((notify) => notify())
}

const subscribe = (notify: () => void) => {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

const getSnapshot = () => snapshot

// Хэд хэдэн component зэрэг уншиж болно (санал өгөх бүрд дахин уншдаг).
// Хоцорч ирсэн хариу шинийг дарж бичвэл хуучин үлдэгдэл харагдана.
let latest = 0

/**
 * Нэвтэрсэн хэрэглэгчийн үлдэгдэл. Аукционд амласан (`held_coins`) хэсэг нь
 * өөр лот дээр барьцаанд байгаа тул зарцуулж болох дүнгээс хасагдана.
 */
export function useWallet() {
  const { isSignedIn } = useUser()
  const { callApi } = useApiClient()
  const { wallet, loading, failed } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  )

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setSnapshot({ wallet: null, loading: false, failed: false })
      return
    }
    const ticket = ++latest
    try {
      const { data } = await callApi<{ data: WalletBalance | null }>("/api/wallet")
      if (ticket !== latest) return
      setSnapshot({ wallet: data, loading: false, failed: false })
    } catch (error) {
      console.error("Хэтэвч уншиж чадсангүй:", error)
      // Уншилт бүтэлгүйтвэл үлдэгдэл нь 0 биш, "мэдэгдэхгүй". Энэ хоёрыг
      // ялгахгүй бол сүлжээний алдаа "үлдэгдэл хүрэлцэхгүй" мэт харагдана.
      if (ticket !== latest) return
      setSnapshot({ loading: false, failed: true })
    }
  }, [callApi, isSignedIn])

  useLoad(refresh)

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
