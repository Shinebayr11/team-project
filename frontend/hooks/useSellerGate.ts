"use client"

import { useCallback } from "react"
import { useUser } from "@clerk/nextjs"

import { useNavigate, useSearchParams, useLocation } from "@/lib/router"
import { useSellerProfile } from "@/hooks/useSellerProfile"

/** Идэвхжүүлэх хуудсыг гүн холбоос болгодог query param. */
export const SELLER_GATE_PARAM = "sellerGate"

/** Худалдагчийн самбарын үндсэн зам. */
export const SELLER_HOME = "/seller"

/**
 * Хаалтаас буцаахад хэрэглэх "нүүр".
 *
 * "/" нь marketing layout бөгөөд AppShell-ийг ЗОРИУДААР алгасдаг тул
 * идэвхжүүлэх хуудас тэнд mount хийгддэггүй. Дэлгүүрийн нүүр `/home` нь
 * AppShell дотор байдаг бөгөөд Clerk-ийн нэвтэрсэн дараах хаяг ч мөн энэ.
 */
export const SELLER_GATE_RETURN = "/home"

export interface SellerGateApi {
  /** `?sellerGate=1` байгаа эсэх. */
  isOpen: boolean
  /**
   * Цэс дээр дарахад дуудна. Идэвхтэй бол шууд самбар руу, нэвтрээгүй бол
   * нэвтрэх рүү (буцаж ирээд хуудас нь өөрөө нээгдэнэ), бусад тохиолдолд
   * идэвхжүүлэх хуудсыг нээнэ.
   */
  open: () => void
  /** Хуудсыг хааж, query param-ыг арилгана. Юу ч хадгалахгүй. */
  close: () => void
}

export function useSellerGate(): SellerGateApi {
  const { isSignedIn } = useUser()
  const { isActive } = useSellerProfile()
  const [params, setSearchParams] = useSearchParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isOpen = params.get(SELLER_GATE_PARAM) === "1"

  const open = useCallback(() => {
    if (isActive) {
      navigate(SELLER_HOME)
      return
    }

    if (!isSignedIn) {
      // Хүсэл санааг хадгална: нэвтэрч дуусаад яг энэ хуудсанд `?sellerGate=1`
      // -тэйгээ буцаж ирэх тул идэвхжүүлэх хуудас өөрөө дахин нээгдэнэ.
      const intent = new URLSearchParams(params.toString())
      intent.set(SELLER_GATE_PARAM, "1")
      const returnTo = `${pathname}?${intent.toString()}`
      navigate(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`)
      return
    }

    // Замыг өөрчлөхгүй — зөвхөн query param нэмнэ.
    const next = new URLSearchParams(params.toString())
    next.set(SELLER_GATE_PARAM, "1")
    setSearchParams(next)
  }, [isActive, isSignedIn, navigate, params, pathname, setSearchParams])

  const close = useCallback(() => {
    const next = new URLSearchParams(params.toString())
    next.delete(SELLER_GATE_PARAM)
    setSearchParams(next, { replace: true })
  }, [params, setSearchParams])

  return { isOpen, open, close }
}
