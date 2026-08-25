"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { SELLER_GATE_PARAM, SELLER_GATE_RETURN } from "@/hooks/useSellerGate"

/**
 * Хуучин "хүсэлт илгээгээд хүлээх" урсгал байсан хуудас.
 *
 * Одоо хянах дараалал байхгүй — гарын үсэг зурмагц дэлгүүр шууд идэвхжинэ.
 * Хадгалсан холбоос 404 болохгүйн тулд идэвхжүүлэх хуудас руу чиглүүлнэ.
 */
export default function SellerOnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(`${SELLER_GATE_RETURN}?${SELLER_GATE_PARAM}=1`)
  }, [router])

  return null
}
