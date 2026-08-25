"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"

import { useNavigate } from "@/lib/router"
import {
  SELLER_GATE_PARAM,
  SELLER_GATE_RETURN,
  SELLER_HOME,
  useSellerGate,
} from "@/hooks/useSellerGate"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { SellerActivationSheet } from "@/components/seller/SellerActivationSheet"

/**
 * Цэсний товчны ref. Хуудас хаагдахад фокус яг тэр товч руугаа буцаж очно
 * (Base UI Dialog-ийн `finalFocus`). Товч нь Topbar дотор, хуудас нь AppShell
 * дотор амьдардаг тул ref-ийг context-оор дамжуулна.
 */
const SellerGateTriggerContext =
  React.createContext<React.RefObject<HTMLElement | null> | null>(null)

/** Цэсний товч өөрийгөө бүртгүүлнэ. */
export function useSellerGateTrigger<T extends HTMLElement>() {
  return React.useContext(SellerGateTriggerContext) as React.RefObject<T | null> | null
}

const SellerGateMount: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser()
  const { isOpen, close } = useSellerGate()
  const { isActive, isLoading } = useSellerProfile()
  const navigate = useNavigate()
  const triggerRef = React.useContext(SellerGateTriggerContext)

  // `?sellerGate=1`-ийг хуулсан/сэргээсэн боловч аль хэдийн идэвхтэй бол
  // хуудсыг огт үзүүлэхгүй, шууд самбар руу оруулна.
  React.useEffect(() => {
    if (isOpen && !isLoading && isActive) navigate(SELLER_HOME)
  }, [isOpen, isLoading, isActive, navigate])

  // Нэвтрээгүй үед гүн холбоосоор орж ирвэл нэвтрэх рүү явуулж, буцаж ирэхэд
  // хуудас нь өөрөө нээгдэнэ.
  React.useEffect(() => {
    if (!isOpen || !isLoaded || isSignedIn) return
    const returnTo =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : `${SELLER_GATE_RETURN}?${SELLER_GATE_PARAM}=1`
    navigate(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`, {
      replace: true,
    })
  }, [isOpen, isLoaded, isSignedIn, navigate])

  return (
    <SellerActivationSheet
      open={isOpen && Boolean(isSignedIn) && !isActive}
      onClose={close}
      finalFocus={triggerRef ?? undefined}
    />
  )
}

/**
 * Идэвхжүүлэх хуудсыг апп даяар нэг л газар холбоно. `?sellerGate=1` нь
 * төлвийг эзэмшдэг тул хуудас сэргээхэд ч, холбоос хуваалцахад ч ажиллана.
 */
export const SellerGateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const triggerRef = React.useRef<HTMLElement | null>(null)

  return (
    <SellerGateTriggerContext.Provider value={triggerRef}>
      {children}
      {/* useSearchParams-ийг Suspense-ээр хүрээлнэ. */}
      <React.Suspense fallback={null}>
        <SellerGateMount />
      </React.Suspense>
    </SellerGateTriggerContext.Provider>
  )
}
