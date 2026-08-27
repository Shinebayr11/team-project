"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Шоу эхлэх дэлгэц Seller Hub руу зөөгдсөн (`/seller/shows/start`).
 *
 * Энэ хаяг нь худалдан авагчийн topbar-тай, sidebar-гүй байсан тул худалдагч
 * самбраасаа гарч өөр аппад ирсэн мэт болдог байв. Хадгалсан холбоос,
 * LandingFooter-ийн "Худалдагч болох" зэрэг нь 404 болохгүйн тулд чиглүүлнэ —
 * нэвтрээгүй буюу идэвхгүй хэрэглэгчийг цаашид `proxy.ts` болон
 * `SellerHubLayout` идэвхжүүлэх хуудас руу аваачна.
 */
export default function SellRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/seller/shows/start")
  }, [router])

  return null
}
