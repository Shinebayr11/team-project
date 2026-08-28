"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Plus, Radio } from "lucide-react"
import { Link, useNavigate } from "@/lib/router"
import { SellerShow } from "@/features/seller-hub/types"
import { useStore } from "@/store"
import { useActiveStream } from "@/hooks/useActiveStream"
import { PageHeader } from "@/features/seller-hub/components/PageHeader"
import { FilterTabs } from "@/features/seller-hub/components/FilterTabs"
import { SellerSearchField } from "@/features/seller-hub/components/SellerSearchField"
import { DataCard } from "@/features/seller-hub/components/DataCard"
import { ShowsTable } from "@/features/seller-hub/components/shows/ShowsTable"
import { ShowForm, ShowDraft } from "@/features/seller-hub/components/shows/ShowForm"
import { ShowDetail } from "@/features/seller-hub/components/shows/ShowDetail"

const TABS = ["ALL", "DRAFT", "SCHEDULED", "LIVE", "COMPLETED"] as const

/** Шоу эхлэх ганц зам. Гарчиг, ангилал нь бэлдсэн байдлаар нээгдэнэ. */
const startShowHref = (show?: SellerShow) => {
  if (!show) return "/seller/shows/start"
  const params = new URLSearchParams({
    showId: show.id,
    title: show.title,
    category: show.category,
  })
  return `/seller/shows/start?${params.toString()}`
}

export const SellerShows: React.FC = () => {
  const {
    state,
    createSellerShow,
    addShowProduct,
    removeShowProduct,
    updateShowStatus,
    addToast,
  } = useStore()

  const navigate = useNavigate()
  const active = useActiveStream()

  const [mode, setMode] = useState<"list" | "create">("list")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("ALL")
  const [search, setSearch] = useState("")

  // `SellerShow.status` нь mock өгөгдөл. LIVE-ыг store-оос уншихын оронд
  // жинхэнэ LiveKit дамжуулалтаас гаргаж авна — камер асаагүй шоу LIVE
  // харагдах, дамжуулалт зогссон ч LIVE гацаж үлдэх аль аль нь боломжгүй.
  const withLiveStatus = useCallback(
    (show: SellerShow): SellerShow =>
      active?.sellerShowId === show.id ? { ...show, status: "LIVE" } : show,
    [active]
  )

  const filteredShows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return state.sellerShows.map(withLiveStatus).filter((s) => {
      if (activeTab !== "ALL" && s.status !== activeTab) return false
      return !term || s.title.toLowerCase().includes(term)
    })
  }, [state.sellerShows, activeTab, search, withLiveStatus])

  const selectedShow = state.sellerShows
    .filter((s) => s.id === selectedId)
    .map(withLiveStatus)[0]

  const handleCreate = (draft: ShowDraft) => {
    if (!draft.title.trim() || !draft.scheduledAt) {
      addToast("Please fill in all required fields.")
      return
    }
    createSellerShow({
      title: draft.title.trim(),
      category: draft.category,
      description: draft.description,
      type: draft.type,
      scheduledAt: new Date(draft.scheduledAt).toISOString(),
      status: "DRAFT",
    })
    addToast("Show created as draft.")
    setMode("list")
  }

  const handleStatusChange = (status: SellerShow["status"]) => {
    if (!selectedId) return
    // LIVE нь дамжуулалтаас гаргаж авдаг утга тул энд бичигдэхгүй.
    if (status === "LIVE") return
    updateShowStatus(selectedId, status)
    addToast(`Show status updated to ${status}.`)
  }

  if (mode === "create") {
    return <ShowForm onCancel={() => setMode("list")} onCreate={handleCreate} />
  }

  if (selectedShow) {
    const available = state.inventory.filter(
      (p) =>
        p.status === "ACTIVE" &&
        !selectedShow.products.some((sp) => sp.inventoryId === p.id)
    )

    return (
      <ShowDetail
        show={selectedShow}
        availableInventory={available}
        onBack={() => setSelectedId(null)}
        onChangeStatus={handleStatusChange}
        onGoLive={() => navigate(startShowHref(selectedShow))}
        onAddProduct={(id) => {
          addShowProduct(selectedShow.id, id)
          addToast("Product added to show.")
        }}
        onRemoveProduct={(id) => removeShowProduct(selectedShow.id, id)}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Шууд"
        description="Schedule and manage your live events."
      >
        {/* Жинхэнэ LiveKit дамжуулалт — Seller Hub-ын chrome дотор. */}
        <Link
          to={startShowHref()}
          className="flex items-center gap-2 rounded-full bg-[var(--wn-live-deep)] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-live)]"
        >
          <Radio className="h-4 w-4" /> Go Live
        </Link>

        <button
          onClick={() => setMode("create")}
          className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-black"
        >
          <Plus className="h-4 w-4" /> Create Show
        </button>
      </PageHeader>

      <FilterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <DataCard
        toolbar={
          <SellerSearchField
            value={search}
            onChange={setSearch}
            placeholder="Search shows..."
          />
        }
      >
        <ShowsTable shows={filteredShows} onSelect={setSelectedId} />
      </DataCard>
    </>
  )
}
