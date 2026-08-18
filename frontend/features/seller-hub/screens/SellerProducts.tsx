"use client"

import React, { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { InventoryProduct } from "@/features/seller-hub/types"
import { useStore } from "@/store"
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
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "ARCHIVED", label: "Archived" },
]

type Editing = { draft: ProductDraft; id: string | null } | null

export const SellerProducts: React.FC = () => {
  const {
    state,
    addInventoryProduct,
    updateInventoryProduct,
    adjustStock,
    bulkAction,
    addToast,
  } = useStore()

  const [editing, setEditing] = useState<Editing>(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [stockTargetId, setStockTargetId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return state.inventory.filter((p) => {
      if (filterStatus !== "ALL" && p.status !== filterStatus) return false
      if (!term) return true
      return (
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      )
    })
  }, [state.inventory, search, filterStatus])

  const countByStatus = (status: InventoryProduct["status"]) =>
    state.inventory.filter((p) => p.status === status).length

  const handleSave = (draft: ProductDraft, publish: boolean) => {
    if (!draft.name.trim() || !draft.sku.trim()) {
      addToast("Please fill in all required fields.")
      return
    }

    const status = statusForDraft(draft, publish)
    const { acceptOffers, ...fields } = draft

    if (editing?.id) {
      updateInventoryProduct(editing.id, { ...fields, status })
      addToast("Product updated.")
    } else {
      addInventoryProduct({ ...fields, status })
      addToast(`Product ${publish ? "published" : "saved as draft"}.`)
    }
    setEditing(null)
  }

  const handleBulk = (action: BulkAction) => {
    if (selectedIds.length === 0) return
    bulkAction(selectedIds, action)
    addToast(`Bulk action applied to ${selectedIds.length} items.`)
    setSelectedIds([])
  }

  const handleStockSave = (type: StockAdjustType, amount: number) => {
    if (!stockTargetId) return
    adjustStock(stockTargetId, type, amount)
    addToast("Stock updated successfully.")
  }

  if (editing) {
    return (
      <ProductForm
        title={editing.id ? "Edit Product" : "Create Product"}
        initialDraft={editing.draft}
        onCancel={() => setEditing(null)}
        onSave={handleSave}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Manage your products and catalog."
      >
        <button
          onClick={() => setEditing({ draft: emptyProductDraft(), id: null })}
          className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-black"
        >
          <Plus className="h-4 w-4" /> Create Product
        </button>
      </PageHeader>

      <div className="mb-8 grid grid-cols-4 gap-6">
        <KpiCard
          title="Total Items"
          value={state.inventory.length}
          tone="blue"
        />
        <KpiCard title="Active" value={countByStatus("ACTIVE")} tone="teal" />
        <KpiCard title="Drafts" value={countByStatus("DRAFT")} tone="amber" />
        <KpiCard
          title="Out of Stock"
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
                placeholder="Search by name or SKU"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter by status"
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
