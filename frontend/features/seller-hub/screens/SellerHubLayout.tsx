"use client"

import React from "react"
import { useLocation } from "@/lib/router"
import { useStore } from "@/store"
import { SellerSidebar } from "@/features/seller-hub/components/SellerSidebar"
import { SellerTopbar } from "@/features/seller-hub/components/SellerTopbar"

const OPEN_FULFILLMENT = ["PENDING", "PROCESSING", "READY_TO_SHIP"]

// The App Router nests routes through `children` where react-router used <Outlet />.
export const SellerHubLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { pathname } = useLocation()
  const { state } = useStore()

  const pendingOrders = state.sellerOrders.filter((o) =>
    OPEN_FULFILLMENT.includes(o.fulfillmentStatus)
  ).length

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
