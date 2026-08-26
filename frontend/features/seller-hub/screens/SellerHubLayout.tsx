"use client"

import React from "react"
import { useLocation, useNavigate } from "@/lib/router"
import { useStore } from "@/store"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { SELLER_GATE_PARAM, SELLER_GATE_RETURN } from "@/hooks/useSellerGate"
import { Sheet, SheetBody, SheetHeader } from "@/components/ui/sheet"
import {
  SellerNav,
  SellerSidebar,
} from "@/features/seller-hub/components/SellerSidebar"
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
  const [navOpen, setNavOpen] = React.useState(false)

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
    <div className="flex min-h-screen bg-[var(--wn-page)] font-[var(--wn-font)] text-[var(--wn-admin-ink)]">
      <SellerSidebar path={pathname} pendingOrders={pendingOrders} />

      <div className="flex min-w-0 flex-1 flex-col">
        <SellerTopbar onOpenNav={() => setNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>

      {/* 1024px-ээс доош хажуугийн самбар нуугддаг тул цэс нь эндээс гарна.
          `components/ui/sheet.tsx`-ийг дахин ашиглав — фокус баригдана, ESC
          ажиллана, фокус буцаж очно. */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetHeader title="Seller Hub" />
        <SheetBody className="flex flex-col px-0 py-0">
          <SellerNav
            path={pathname}
            pendingOrders={pendingOrders}
            onNavigate={() => setNavOpen(false)}
          />
        </SheetBody>
      </Sheet>
    </div>
  )
}
