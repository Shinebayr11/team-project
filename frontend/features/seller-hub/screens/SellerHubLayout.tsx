"use client"

import React from "react"
import { useLocation, useNavigate } from "@/lib/router"
import { useStore } from "@/store"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { SELLER_GATE_PARAM, SELLER_GATE_RETURN } from "@/hooks/useSellerGate"
import { SellerSidebar } from "@/features/seller-hub/components/SellerSidebar"
import { SellerTopbar } from "@/features/seller-hub/components/SellerTopbar"

const OPEN_FULFILLMENT = ["PENDING", "PROCESSING", "READY_TO_SHIP"]

// The App Router nests routes through `children` where react-router used <Outlet />.
export const SellerHubLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { pathname } = useLocation()
  const { state } = useStore()
  const { isActive, isLoading } = useSellerProfile()
  const navigate = useNavigate()

  // Идэвхгүй худалдагчийг нүүр рүү буцааж, идэвхжүүлэх хуудсыг нээнэ.
  // Нэвтрээгүй тохиолдлыг proxy.ts аль хэдийн барьсан байна.
  React.useEffect(() => {
    if (isLoading || isActive) return
    navigate(`${SELLER_GATE_RETURN}?${SELLER_GATE_PARAM}=1`, { replace: true })
  }, [isLoading, isActive, navigate])

  const pendingOrders = state.sellerOrders.filter((o) =>
    OPEN_FULFILLMENT.includes(o.fulfillmentStatus)
  ).length

  // Шалгаж дуустал самбарыг харуулахгүй — эс тэгвээс идэвхгүй хэрэглэгчид
  // хормын зуур самбар харагдчихна.
  if (isLoading || !isActive) return null

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-[var(--wn-font)] text-[var(--wn-admin-ink)]">
      <SellerSidebar path={pathname} pendingOrders={pendingOrders} />

      <div className="flex min-w-0 flex-1 flex-col">
        <SellerTopbar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
