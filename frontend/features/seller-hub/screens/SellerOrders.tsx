"use client"

import React, { useMemo, useState } from "react"
import { SellerOrder } from "@/features/seller-hub/types"
import { useStore } from "@/store"
import { PageHeader } from "@/features/seller-hub/components/PageHeader"
import { FilterTabs } from "@/features/seller-hub/components/FilterTabs"
import { SellerSearchField } from "@/features/seller-hub/components/SellerSearchField"
import { DataCard } from "@/features/seller-hub/components/DataCard"
import { OrdersTable } from "@/features/seller-hub/components/orders/OrdersTable"
import { OrderDetail } from "@/features/seller-hub/components/orders/OrderDetail"

const TABS = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "READY_TO_SHIP",
  "SHIPPED",
  "DELIVERED",
] as const

export const SellerOrders: React.FC = () => {
  const { state, updateSellerOrderStatus, setOrderTracking, addToast } =
    useStore()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("ALL")
  const [search, setSearch] = useState("")

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase()
    return state.sellerOrders.filter((o) => {
      if (activeTab !== "ALL" && o.fulfillmentStatus !== activeTab) return false
      if (!term) return true
      return (
        o.id.toLowerCase().includes(term) ||
        o.buyerName.toLowerCase().includes(term)
      )
    })
  }, [state.sellerOrders, activeTab, search])

  const selectedOrder = state.sellerOrders.find((o) => o.id === selectedId)

  const handleAdvance = (status: SellerOrder["fulfillmentStatus"]) => {
    if (!selectedId) return
    updateSellerOrderStatus(selectedId, status)
    addToast(`Order marked as ${status.replace(/_/g, " ").toLowerCase()}.`)
  }

  const handleShip = (carrier: string, trackingNumber: string) => {
    if (!selectedId) return
    if (!trackingNumber) {
      addToast("Please enter a tracking number.")
      return
    }
    setOrderTracking(selectedId, carrier, trackingNumber)
    addToast("Order marked as shipped.")
  }

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedId(null)}
        onAdvance={handleAdvance}
        onGenerateLabel={() =>
          addToast("Shipping label generated successfully.")
        }
        onShip={handleShip}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Orders & Shipping"
        description="Manage and fulfill your recent sales."
      />
      <FilterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <DataCard
        toolbar={
          <SellerSearchField
            value={search}
            onChange={setSearch}
            placeholder="Search orders..."
          />
        }
      >
        <OrdersTable orders={filteredOrders} onSelect={setSelectedId} />
      </DataCard>
    </>
  )
}
