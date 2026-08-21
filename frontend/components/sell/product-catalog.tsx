"use client"

import { useCallback, useEffect, useState } from "react"
import { Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApiClient } from "@/hooks/useApiClient"
import { AuctionProduct } from "@/hooks/useAuction"

const fieldClass =
  "mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"

/**
 * Худалдагчийн барааны сан. Шоуны үед аукционд гаргах бараа эндээс сонгогдох
 * тул дамжуулалт эхлэхээс өмнө бүртгэсэн байх ёстой.
 */
export function ProductCatalog() {
  const { callApi } = useApiClient()
  const [products, setProducts] = useState<AuctionProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("1")

  const load = useCallback(async () => {
    try {
      const res = await callApi<{ products: AuctionProduct[] }>("/api/product/mine")
      setProducts(res.products)
    } catch {
      setError("Бараагаа уншиж чадсангүй")
    } finally {
      setLoading(false)
    }
  }, [callApi])

  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    setBusy(true)
    setError(null)
    try {
      await callApi("/api/product", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          price_coins: Number(price) || 0,
          stock_quantity: Number(stock) || 1,
        }),
      })
      setName("")
      setPrice("")
      setStock("1")
      setAdding(false)
      await load()
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Хадгалж чадсангүй"
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-10 border-t pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Миний бараа</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Шоуны үед эндээс сонгож аукционд гаргана.
          </p>
        </div>
        {!adding && (
          <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
            <Plus className="mr-1 size-4" />
            Нэмэх
          </Button>
        )}
      </div>

      {adding && (
        <div className="mt-4 rounded-xl border bg-card p-4">
          <label className="block text-sm font-medium" htmlFor="product-name">
            Барааны нэр
            <input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Жишээ: Vintage шил ваар"
              className={fieldClass}
            />
          </label>

          <div className="mt-3 flex gap-3">
            <label className="flex-1 text-sm font-medium" htmlFor="product-price">
              Үнэ (₮)
              <input
                id="product-price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="w-28 text-sm font-medium" htmlFor="product-stock">
              Тоо
              <input
                id="product-stock"
                type="number"
                min={1}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={save} disabled={!name.trim() || busy}>
              {busy ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setAdding(false)
                setError(null)
              }}
            >
              Болих
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Уншиж байна...</p>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <Package className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Бараа бүртгээгүй байна.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <span className="truncate text-sm font-medium">{product.name}</span>
              <span className="shrink-0 text-sm font-bold text-muted-foreground">
                ₮{product.price_coins ?? 0}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
