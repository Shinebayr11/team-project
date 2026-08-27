"use client"

import { useSyncExternalStore } from "react"

export type ActiveStream = {
  roomName: string
  title: string
  /** Backend дээрх шоуны id (`/api/liveshow`). */
  showId: string
  /**
   * Seller Hub-ын жагсаалт дахь шоуны id, хэрэв дамжуулалт тэндээс эхэлсэн бол.
   *
   * Самбарын `SellerShow.status` нь mock өгөгдөл тул түүнийг LIVE болгож
   * бичихийн оронд энэ холбоосоор ЖИНХЭНЭ дамжуулалтаас ГАРГАЖ АВНА — тэгснээр
   * камер асаагүй атлаа шоу LIVE харагдах, эсвэл дамжуулалт зогссон ч LIVE
   * гацаж үлдэх аль аль нь боломжгүй болно.
   */
  sellerShowId?: string
}

const STORAGE_KEY = "activeStream"
// "storage" only fires in *other* tabs, so writes from this one announce
// themselves.
const CHANGE_EVENT = "activestream:change"

// getSnapshot runs on every render and React bails out on Object.is only, so a
// fresh JSON.parse each time would re-render forever. Re-parse only when the
// stored string actually changes.
let cachedRaw: string | null = null
let cachedValue: ActiveStream | null = null

function getSnapshot(): ActiveStream | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedValue = raw ? (JSON.parse(raw) as ActiveStream) : null
  }
  return cachedValue
}

// Nothing is live on the server or during hydration; React re-reads the real
// value once mounted.
function getServerSnapshot(): ActiveStream | null {
  return null
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener(CHANGE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener(CHANGE_EVENT, onStoreChange)
  }
}

export function writeActiveStream(next: ActiveStream | null) {
  if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  else localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

// localStorage is an external store: reading it through useSyncExternalStore
// keeps SSR and hydration in step without a setState round trip in an effect.
export function useActiveStream(): ActiveStream | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
