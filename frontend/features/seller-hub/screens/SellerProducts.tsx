"use client"

import React, { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { InventoryProduct } from "@/features/seller-hub/types"
import { useStore } from "@/store"
import { useInventoryActions } from "@/features/seller-hub/hooks/useSellerInventory"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { settingsOf } from "@/features/seller-hub/sellerSettings"
import { PageHeader } from "@/features/seller-hub/components/PageHeader"
import { KpiCard } from "@/features/seller-hub/components/KpiCard"
import { DataCard } from "@/features/seller-hub/components/DataCard"
import { SellerSearchField } from "@/features/seller-hub/components/SellerSearchField"
import { InventoryTable } from "@/features/seller-hub/components/products/InventoryTable"
import {
  BulkActionBar,
  BulkAction,
} from "@/features/seller-hub/components/products/BulkActionBar"
import {
  StockModal,
  StockAdjustType,
} from "@/features/seller-hub/components/products/StockModal"
import { ProductForm } from "@/features/seller-hub/components/products/ProductForm"
import {
  ProductDraft,
  emptyProductDraft,
  draftFromProduct,
  statusForDraft,
} from "@/features/seller-hub/components/products/productDraft"

const STATUS_OPTIONS = [
  { value: "ALL", label: "Бүх төлөв" },
  { value: "ACTIVE", label: "Идэвхтэй" },
  { value: "DRAFT", label: "Ноорог" },
  { value: "OUT_OF_STOCK", label: "Дууссан" },
  { value: "ARCHIVED", label: "Архивласан" },
]

type Editing = { draft: ProductDraft; id: string | null } | null

export const SellerProducts: React.FC = () => {
  const { state, addToast } = useStore()
  const inventory = state.inventory

  // Бараа сервер дээр амьдарна — дамжуулалтын "Миний бараа" ЯГ ижил
  // цуглуулгыг уншдаг тул энд нэмсэн бараа тэнд шууд харагдана.
  const { create, update, remove } = useInventoryActions()

  // Шинэ барааны маягтын урьдчилсан утгууд худалдагчийн тохиргооноос ирнэ.
  const { profile } = useSellerProfile()
  const sellerSettings = settingsOf(profile)

  const [editing, setEditing] = useState<Editing>(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [stockTargetId, setStockTargetId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return inventory.filter((p) => {
      if (filterStatus !== "ALL" && p.status !== filterStatus) return false
      if (!term) return true
      return (
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      )
    })
  }, [inventory, search, filterStatus])

  const countByStatus = (status: InventoryProduct["status"]) =>
    inventory.filter((p) => p.status === status).length

  const handleSave = async (draft: ProductDraft, publish: boolean) => {
    if (!draft.name.trim() || !draft.sku.trim()) {
      addToast("Шаардлагатай бүх талбарыг бөглөнө үү.")
      return
    }

    const status = statusForDraft(draft, publish)
    const { acceptOffers, ...fields } = draft

    try {
      if (editing?.id) {
        await update(editing.id, { ...fields, status })
        addToast("Бараа шинэчлэгдлээ.")
      } else {
        await create({ ...fields, status })
        addToast(`Бараа ${publish ? "нийтлэгдлээ" : "ноорог хэлбэрээр хадгалагдлаа"}.`)
      }
      setEditing(null)
    } catch {
      addToast("Хадгалж чадсангүй. Дахин оролдоно уу.")
    }
  }

  const handleBulk = async (action: BulkAction) => {
    if (selectedIds.length === 0) return

    try {
      if (action === "delete") {
        await Promise.all(selectedIds.map((id) => remove(id)))
      } else {
        const status = action === "activate" ? "ACTIVE" : action === "draft" ? "DRAFT" : "ARCHIVED"
        await Promise.all(selectedIds.map((id) => update(id, { status })))
      }
      addToast(`${selectedIds.length} бараанд бөөнөөр үйлдэл хийгдлээ.`)
      setSelectedIds([])
    } catch {
      addToast("Үйлдэл гүйцэтгэж чадсангүй.")
    }
  }

  const handleStockSave = async (type: StockAdjustType, amount: number) => {
    const target = inventory.find((p) => p.id === stockTargetId)
    if (!target) return

    // Нөөц 0 болбол зарагдсан гэж тэмдэглэнэ, дахин нэмэгдвэл идэвхжүүлнэ —
    // энэ дүрэм өмнө нь store дотор байсан.
    const quantity =
      type === "add"
        ? target.quantity + amount
        : type === "remove"
          ? Math.max(0, target.quantity - amount)
          : Math.max(0, amount)
    const status =
      quantity === 0 && target.status === "ACTIVE"
        ? "OUT_OF_STOCK"
        : quantity > 0 && target.status === "OUT_OF_STOCK"
          ? "ACTIVE"
          : target.status

    try {
      await update(target.id, { quantity, status })
      addToast("Нөөц амжилттай шинэчлэгдлээ.")
    } catch {
      addToast("Нөөц шинэчилж чадсангүй.")
    }
  }

  if (editing) {
    return (
      <ProductForm
        title={editing.id ? "Бараа засах" : "Бараа нэмэх"}
        initialDraft={editing.draft}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Бараа"
        description="Бараа, каталогоо удирдана уу."
      >
        <button
          onClick={() => setEditing({ draft: emptyProductDraft(sellerSettings), id: null })}
          className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-black"
        >
          <Plus className="h-4 w-4" /> Бараа нэмэх
        </button>
      </PageHeader>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        <KpiCard
          title="Нийт бараа"
          value={inventory.length}
          tone="blue"
        />
        <KpiCard title="Идэвхтэй" value={countByStatus("ACTIVE")} tone="teal" />
        <KpiCard title="Ноорог" value={countByStatus("DRAFT")} tone="amber" />
        <KpiCard
          title="Дууссан"
          value={countByStatus("OUT_OF_STOCK")}
          tone="coral"
        />
      </div>

      <DataCard
        toolbar={
          <>
            <div className="flex items-center gap-4">
              <SellerSearchField
                value={search}
                onChange={setSearch}
                placeholder="Нэр эсвэл SKU-гаар хайх"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Төлвөөр шүүх"
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-[14px] font-[600] text-gray-700 outline-none"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedIds.length > 0 && (
              <BulkActionBar count={selectedIds.length} onAction={handleBulk} />
            )}
          </>
        }
      >
        <InventoryTable
          products={filtered}
          selectedIds={selectedIds}
          onToggleSelect={(id) =>
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
            )
          }
          onToggleSelectAll={() =>
            setSelectedIds((prev) =>
              prev.length === filtered.length ? [] : filtered.map((p) => p.id)
            )
          }
          onEdit={(product) =>
            setEditing({ draft: draftFromProduct(product), id: product.id })
          }
          onAdjustStock={setStockTargetId}
        />
      </DataCard>

      {stockTargetId && (
        <StockModal
          onClose={() => setStockTargetId(null)}
          onSave={handleStockSave}
        />
      )}
    </>
  )
}
