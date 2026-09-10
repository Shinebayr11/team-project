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
import { AuctionSalesPanel } from "@/features/seller-hub/components/orders/AuctionSalesPanel"
import { OrderSalesPanel } from "@/features/seller-hub/components/orders/OrderSalesPanel"
import { FULFILLMENT_STATUS_LABELS } from "@/features/seller-hub/components/statusTones"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { settingsOf } from "@/features/seller-hub/sellerSettings"

const TABS = [
  { value: "ALL", label: "Бүгд" },
  { value: "PENDING", label: FULFILLMENT_STATUS_LABELS.PENDING },
  { value: "PROCESSING", label: FULFILLMENT_STATUS_LABELS.PROCESSING },
  { value: "READY_TO_SHIP", label: FULFILLMENT_STATUS_LABELS.READY_TO_SHIP },
  { value: "SHIPPED", label: FULFILLMENT_STATUS_LABELS.SHIPPED },
  { value: "DELIVERED", label: FULFILLMENT_STATUS_LABELS.DELIVERED },
] as const

export const SellerOrders: React.FC = () => {
  const { state, updateSellerOrderStatus, setOrderTracking, addToast } =
    useStore()

  const { profile } = useSellerProfile()
  const autoConfirm = settingsOf(profile).orders.autoConfirm

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

  // "Захиалгыг шууд баталгаажуулах" тохиргоо асаалттай бол хүлээгдэж буй
  // захиалгыг нээмэгц боловсруулж эхэлсэнд тооцно.
  const openOrder = (id: string) => {
    setSelectedId(id)
    const order = state.sellerOrders.find((o) => o.id === id)
    if (autoConfirm && order?.fulfillmentStatus === "PENDING") {
      updateSellerOrderStatus(id, "PROCESSING")
      addToast("Захиалгыг автоматаар боловсруулж эхэллээ.")
    }
  }

  const handleAdvance = (status: SellerOrder["fulfillmentStatus"]) => {
    if (!selectedId) return
    updateSellerOrderStatus(selectedId, status)
    addToast(`Захиалгыг "${FULFILLMENT_STATUS_LABELS[status]}" төлөвт шилжүүллээ.`)
  }

  const handleShip = (carrier: string, trackingNumber: string) => {
    if (!selectedId) return
    if (!trackingNumber) {
      addToast("Хүргэлтийн код оруулна уу.")
      return
    }
    setOrderTracking(selectedId, carrier, trackingNumber)
    addToast("Захиалгыг илгээсэн гэж тэмдэглэлээ.")
  }

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedId(null)}
        onAdvance={handleAdvance}
        onGenerateLabel={() =>
          addToast("Хүргэлтийн наалт амжилттай үүслээ.")
        }
        onShip={handleShip}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Захиалга, хүргэлт"
        description="Сүүлийн үеийн худалдан авалтуудаа удирдаж, биелүүлнэ үү."
      />
      {/* Дуудлага худалдааны ялагчид болон шууд захиалгууд — хоёулаа
          жинхэнэ өгөгдөл. Доорх хүснэгт нь одоогоор жишээ захиалгууд. */}
      <AuctionSalesPanel />
      <OrderSalesPanel />

      <FilterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <DataCard
        toolbar={
          <SellerSearchField
            value={search}
            onChange={setSearch}
            placeholder="Захиалга хайх..."
          />
        }
      >
        <OrdersTable orders={filteredOrders} onSelect={openOrder} />
      </DataCard>
    </>
  )
}
