"use client"

import { useCallback, useEffect, useState } from "react"
import { ListOrdered, Package, Plus, X } from "lucide-react"
import { useApiClient } from "@/hooks/useApiClient"
import { AuctionProduct } from "@/hooks/useAuction"
import { productOfEntry, useShowProducts } from "@/hooks/useShowProducts"

const pillOutline =
  "inline-flex items-center rounded-full border border-gray-300 px-3.5 py-1.5 text-[13px] font-[700] text-black transition-colors hover:bg-gray-50"

/** Барааны зураг, эсвэл зураггүй бол орлуулах хайрцаг. */
function ProductThumb({ product }: { product?: AuctionProduct }) {
  return product?.images?.[0] ? (
    <img
      src={product.images[0]}
      alt={product.name}
      className="size-10 shrink-0 rounded-lg object-cover"
    />
  ) : (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--wn-surface-2)]">
      <Package className="size-4 text-[var(--wn-ink-3)]" />
    </div>
  )
}

/**
 * Лайв дээр гарах барааны жагсаалт. Худалдагч бараагаа урьдчилан эмхэлж
 * тавьснаар үзэгчид лайвын туршид бүтэн жагсаалтыг харна — дуудлага худалдаанд гарсан
 * ганц лот биш.
 */
export function ShowLineup({ showId }: { showId: string }) {
  const { callApi } = useApiClient()
  const { entries, loading, add, remove } = useShowProducts(showId)

  const [catalog, setCatalog] = useState<AuctionProduct[]>([])
  const [picking, setPicking] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCatalog = useCallback(async () => {
    try {
      const res = await callApi<{ products: AuctionProduct[] }>("/api/product/mine")
      setCatalog(res.products)
    } catch {
      setError("Бараагаа уншиж чадсангүй")
    }
  }, [callApi])

  useEffect(() => {
    loadCatalog()
  }, [loadCatalog])

  // Жагсаалтад аль хэдийн орсон барааг дахин санал болгохгүй.
  const added = new Set(
    entries.map((entry) => productOfEntry(entry)?._id).filter(Boolean)
  )
  const available = catalog.filter((product) => !added.has(product._id))

  const addProduct = async (productId: string) => {
    setBusyId(productId)
    setError(null)
    const result = await add(productId)
    if (!result.ok) setError(result.message ?? "Нэмж чадсангүй")
    setBusyId(null)
  }

  const removeEntry = async (entryId: string) => {
    setBusyId(entryId)
    setError(null)
    const result = await remove(entryId)
    if (!result.ok) setError(result.message ?? "Хасаж чадсангүй")
    setBusyId(null)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-[800] text-black">Лайвын бараа</h2>
          <p className="mt-1 text-[14px] font-[500] text-gray-500">
            Энэ лайв дээр үзэгчдэд харагдах жагсаалт.
          </p>
        </div>
        {!picking && available.length > 0 && (
          <button type="button" onClick={() => setPicking(true)} className={pillOutline}>
            <Plus className="mr-1 size-3.5" />
            Нэмэх
          </button>
        )}
      </div>

      {picking && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <span className="text-[13px] font-[700] text-[var(--wn-ink-2)]">Бараагаа сонгоно уу</span>
          <div className="mt-3 flex flex-col gap-2">
            {available.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => addProduct(product._id)}
                disabled={busyId === product._id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <ProductThumb product={product} />
                <span className="flex-1 truncate text-[14px] font-[600] text-[var(--wn-ink)]">
                  {product.name}
                </span>
                <span className="shrink-0 text-[14px] font-[700] text-[var(--wn-ink-3)]">
                  ₮{product.price_coins ?? 0}
                </span>
              </button>
            ))}
          </div>

          {error && <p className="mt-2 text-[13px] font-[600] text-[var(--wn-live-deep)]">{error}</p>}

          <button
            type="button"
            onClick={() => {
              setPicking(false)
              setError(null)
            }}
            className={`${pillOutline} mt-4`}
          >
            Болих
          </button>
        </div>
      )}

      {!picking && error && (
        <p className="mt-2 text-[13px] font-[600] text-[var(--wn-live-deep)]">{error}</p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {loading ? (
          <p className="text-[14px] text-[var(--wn-ink-3)]">Уншиж байна...</p>
        ) : entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
            <ListOrdered className="mx-auto size-6 text-[var(--wn-ink-3)]" />
            <p className="mt-2 text-[14px] text-[var(--wn-ink-3)]">
              {catalog.length === 0
                ? "Эхлээд доороос бараагаа бүртгээрэй."
                : "Жагсаалт хоосон байна. Бараагаа нэмээрэй."}
            </p>
          </div>
        ) : (
          entries.map((entry, index) => {
            const product = productOfEntry(entry)
            return (
              <div
                key={entry._id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3"
              >
                <span className="w-4 shrink-0 text-[14px] font-[700] text-[var(--wn-ink-3)]">
                  {index + 1}
                </span>
                <ProductThumb product={product} />
                <span className="flex-1 truncate text-[14px] font-[600] text-[var(--wn-ink)]">
                  {product?.name ?? "Бараа"}
                </span>
                <span className="shrink-0 text-[14px] font-[700] text-[var(--wn-ink-3)]">
                  ₮{product?.price_coins ?? 0}
                </span>
                <button
                  type="button"
                  onClick={() => removeEntry(entry._id)}
                  disabled={busyId === entry._id}
                  aria-label="Жагсаалтаас хасах"
                  className="shrink-0 rounded-full p-1 text-[var(--wn-ink-3)] transition-colors hover:bg-[var(--wn-surface-2)] hover:text-[var(--wn-ink)] disabled:opacity-50"
                >
                  <X className="size-4" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
