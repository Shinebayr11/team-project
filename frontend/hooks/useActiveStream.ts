"use client"

import { useSyncExternalStore } from "react"
import { useAuth } from "@clerk/nextjs"

export type ActiveStream = {
  /**
   * Дамжуулалтыг эхлүүлсэн Clerk хэрэглэгчийн id.
   *
   * Энэ мөр нь хөтчийн `localStorage` дээр ГАНЦ түлхүүрээр хадгалагддаг ба
   * гарахад цэвэрлэгддэггүй. Эзэмшигчийг нь бичихгүй бол нэг хөтчөөр дараа
   * нэвтэрсэн ӨӨР хэрэглэгч (жишээ нь шинээр бүртгүүлсэн дэлгүүр) хуучин
   * хүний дамжуулалтыг өөрийнх мэт өвлөж авдаг байв: "Эхлэх" маягтын оронд
   * "Үргэлжлүүлэх" гарч ирээд, дарахад нь сервер эзэн нь биш гэж таньж
   * "Энэ шууд дамжуулалтыг явуулах эрх танд алга байна" гэж хардаг байлаа.
   */
  ownerId: string
  roomName: string
  title: string
  /** Backend дээрх шууд дамжуулалтын id (`/api/liveshow`). */
  showId: string
  /**
   * Seller Hub-ын жагсаалт дахь шууд дамжуулалтын id, хэрэв шууд дамжуулалт тэндээс эхэлсэн бол.
   *
   * Самбарын `SellerShow.status` нь mock өгөгдөл тул түүнийг LIVE болгож
   * бичихийн оронд энэ холбоосоор ЖИНХЭНЭ шууд дамжуулалтаас ГАРГАЖ АВНА — тэгснээр
   * камер асаагүй атлаа шууд дамжуулалт LIVE харагдах, эсвэл шууд дамжуулалт зогссон ч LIVE
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
  const { userId, isLoaded } = useAuth()
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Зөвхөн ӨӨРИЙНХӨӨ дамжуулалтыг үргэлжлүүлнэ. Clerk уншигдаж дуустал юу ч
  // харуулахгүй — эс тэгвээс өөр хүний мөр хормын зуур гялсхийнэ.
  // `ownerId`-гүй мөр нь энэ талбар нэмэгдэхээс өмнөх үлдэгдэл: эзэн нь
  // тодорхойгүй тул хэнд ч харуулахгүй, дараагийн бичилтэд дарагдана.
  if (!isLoaded || !userId) return null
  return stored?.ownerId === userId ? stored : null
}
