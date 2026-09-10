"use client"

import React, { useMemo, useState } from "react"
import { SellerOrder } from "@/features/seller-hub/types"
import { useStore } from "@/store"
import { DirectOrder, useMySellerOrders } from "@/hooks/useMySellerOrders"
import { toSellerOrder } from "@/features/seller-hub/lib/toSellerOrder"
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
  const {
    orders: realOrders,
    updateStatus: updateRealStatus,
    updateTracking: updateRealTracking,
  } = useMySellerOrders()

  const { profile } = useSellerProfile()
  const autoConfirm = settingsOf(profile).orders.autoConfirm

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("ALL")
  const [search, setSearch] = useState("")

  // Бодит захиалгуудыг (BuyModal-ийн "Худалдаж авах") mock хэлбэрт
  // хөрвүүлж, хуучин жишээ захиалгуудтай НЭГ жагсаалтад нэгтгэнэ —
  // `realOrderById` нь товч дүрсэлсэн id-гаар бодит эх Order руу буцаана.
  const { allOrders, realOrderById } = useMemo(() => {
    const realOrderById = new Map<string, DirectOrder>()
    const converted = realOrders.map((order) => {
      const sellerOrder = toSellerOrder(order)
      realOrderById.set(sellerOrder.id, order)
      return sellerOrder
    })
    const allOrders = [...converted, ...state.sellerOrders].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return { allOrders, realOrderById }
  }, [realOrders, state.sellerOrders])

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

  // Захиалга бодит бол сервер рүү, mock бол хуучин локал үйлдлээр
  // явна — дэлгэц/товч бүгд адилхан ажиллана.
  const advanceStatus = (id: string, status: SellerOrder["fulfillmentStatus"]) => {
    const real = realOrderById.get(id)
    if (real) {
      updateRealStatus(real._id, status).catch(() =>
        addToast("Төлөв шинэчлэхэд алдаа гарлаа.")
      )
      return
    }
    updateSellerOrderStatus(id, status)
  }

  // "Захиалгыг шууд баталгаажуулах" тохиргоо асаалттай бол хүлээгдэж буй
  // захиалгыг нээмэгц боловсруулж эхэлсэнд тооцно.
  const openOrder = (id: string) => {
    setSelectedId(id)
    const order = allOrders.find((o) => o.id === id)
    if (autoConfirm && order?.fulfillmentStatus === "PENDING") {
      advanceStatus(id, "PROCESSING")
      addToast("Захиалгыг автоматаар боловсруулж эхэллээ.")
    }
  }

  const handleAdvance = (status: SellerOrder["fulfillmentStatus"]) => {
    if (!selectedId) return
    advanceStatus(selectedId, status)
    addToast(`Захиалгыг "${FULFILLMENT_STATUS_LABELS[status]}" төлөвт шилжүүллээ.`)
  }

  const handleShip = (carrier: string, trackingNumber: string) => {
    if (!selectedId) return
    if (!trackingNumber) {
      addToast("Хүргэлтийн код оруулна уу.")
      return
    }

    const real = realOrderById.get(selectedId)
    if (real) {
      updateRealTracking(real._id, carrier, trackingNumber).catch(() =>
        addToast("Хүргэлтийн мэдээлэл хадгалахад алдаа гарлаа.")
      )
    } else {
      setOrderTracking(selectedId, carrier, trackingNumber)
    }
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
      {/* Дуудлага худалдааны ялагчид болон шууд захиалгууд — хурдан
          нэг харцаар харах, чат руу шууд орох самбарууд. Доорх хүснэгт
          эдгээрийг (мөн жишээ захиалгуудыг) явц удирдах горимоор
          нэгтгэж харуулна. */}
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
