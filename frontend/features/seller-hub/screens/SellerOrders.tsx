"use client"

import React, { useMemo, useState } from "react"
import { SellerOrder } from "@/features/seller-hub/types"
import { useStore } from "@/store"
import { ApiError } from "@/lib/api"
import { DirectOrder, useMySellerOrders } from "@/hooks/useMySellerOrders"
import { toSellerOrder } from "@/features/seller-hub/lib/toSellerOrder"
import { PageHeader } from "@/features/seller-hub/components/PageHeader"
import { FilterTabs } from "@/features/seller-hub/components/FilterTabs"
import { SellerSearchField } from "@/features/seller-hub/components/SellerSearchField"
import { DataCard } from "@/features/seller-hub/components/DataCard"
import { OrdersTable } from "@/features/seller-hub/components/orders/OrdersTable"
import { OrderDetail } from "@/features/seller-hub/components/orders/OrderDetail"
import { OrderSalesPanel } from "@/features/seller-hub/components/orders/OrderSalesPanel"
import { FULFILLMENT_STATUS_LABELS } from "@/features/seller-hub/components/statusTones"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { settingsOf } from "@/features/seller-hub/sellerSettings"

const TABS = [
  { value: "ALL", label: "Бүгд" },
  { value: "PENDING", label: FULFILLMENT_STATUS_LABELS.PENDING },
  { value: "CONFIRMED", label: FULFILLMENT_STATUS_LABELS.CONFIRMED },
  { value: "SHIPPED", label: FULFILLMENT_STATUS_LABELS.SHIPPED },
  { value: "DELIVERED", label: FULFILLMENT_STATUS_LABELS.DELIVERED },
] as const

export const SellerOrders: React.FC = () => {
  const { addToast } = useStore()
  const {
    orders: realOrders,
    updateStatus: updateRealStatus,
    updateDelivery: updateRealDelivery,
  } = useMySellerOrders()

  const { profile } = useSellerProfile()
  const autoConfirm = settingsOf(profile).orders.autoConfirm

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("ALL")
  const [search, setSearch] = useState("")

  // Бодит захиалгуудыг (BuyModal-ийн "Худалдаж авах") mock UI-ийн хүлээдэг
  // `SellerOrder` хэлбэрт хөрвүүлнэ — жишээ өгөгдөл энд орохоо больсон.
  // `realOrderById` нь товч дүрсэлсэн id-гаар бодит эх Order руу буцаана.
  const { allOrders, realOrderById } = useMemo(() => {
    const realOrderById = new Map<string, DirectOrder>()
    const allOrders = realOrders
      .map((order) => {
        const sellerOrder = toSellerOrder(order)
        realOrderById.set(sellerOrder.id, order)
        return sellerOrder
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return { allOrders, realOrderById }
  }, [realOrders])

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase()
    return allOrders.filter((o) => {
      if (activeTab !== "ALL" && o.fulfillmentStatus !== activeTab) return false
      if (!term) return true
      return (
        o.id.toLowerCase().includes(term) ||
        o.buyerName.toLowerCase().includes(term)
      )
    })
  }, [allOrders, activeTab, search])

  const selectedOrder = allOrders.find((o) => o.id === selectedId)

  const advanceStatus = (id: string, status: SellerOrder["fulfillmentStatus"]) => {
    const real = realOrderById.get(id)
    if (!real) return
    updateRealStatus(real._id, status).catch(() =>
      addToast("Төлөв шинэчлэхэд алдаа гарлаа.")
    )
  }

  // "Захиалгыг шууд баталгаажуулах" тохиргоо асаалттай бол хүлээгдэж буй
  // захиалгыг нээмэгц боловсруулж эхэлсэнд тооцно.
  const openOrder = (id: string) => {
    setSelectedId(id)
    const order = allOrders.find((o) => o.id === id)
    if (autoConfirm && order?.fulfillmentStatus === "PENDING") {
      advanceStatus(id, "CONFIRMED")
      addToast("Захиалгыг автоматаар боловсруулж эхэллээ.")
    }
  }

  const handleAdvance = (status: SellerOrder["fulfillmentStatus"]) => {
    if (!selectedId) return
    advanceStatus(selectedId, status)
    addToast(`Захиалгыг "${FULFILLMENT_STATUS_LABELS[status]}" төлөвт шилжүүллээ.`)
  }

  const handleShip = (driverPhone: string, vehiclePlate: string) => {
    if (!selectedId) return
    if (!driverPhone || !vehiclePlate) {
      addToast("Жолоочийн утас, машины дугаарыг оруулна уу.")
      return
    }

    const real = realOrderById.get(selectedId)
    if (!real) return
    updateRealDelivery(real._id, driverPhone, vehiclePlate).catch((error) =>
      addToast(
        error instanceof ApiError ? error.message : "Хүргэлтийн мэдээлэл хадгалахад алдаа гарлаа."
      )
    )
    addToast("Захиалгыг хүргэлтэд гарсан гэж тэмдэглэлээ.")
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
      {/* Дуудлага худалдааны ялагчид болон шууд захиалгууд — хурдан
          нэг харцаар харах, чат руу шууд орох самбарууд. Доорх хүснэгт
          эдгээрийг явц удирдах горимоор харуулна. */}
      {/* Дуудлага худалдааны ялагчид ДООРХ хүснэгтэд бусад захиалгын хамт
          орно: лот зарагдахдаа Order үүсгэдэг болсон (`lib/auction.ts`).
          Тусад нь самбар үлдээвэл нэг ялагч хоёр газар харагдана. */}
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
