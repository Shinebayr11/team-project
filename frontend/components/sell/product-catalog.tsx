"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ImagePlus, Package, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApiClient } from "@/hooks/useApiClient"
import { AuctionProduct } from "@/hooks/useAuction"
import { isImageUploadReady, uploadImage } from "@/lib/cloudinary"

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
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const pickImage = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      setImageUrl(await uploadImage(file))
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Зураг байршуулж чадсангүй"
      )
    } finally {
      setUploading(false)
      // Ижил файлыг дахин сонгоход өөрчлөлт бүртгэгдэхийн тулд цэвэрлэнэ.
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

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
          images: imageUrl ? [imageUrl] : [],
        }),
      })
      setName("")
      setPrice("")
      setStock("1")
      setImageUrl(null)
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

          {isImageUploadReady() && (
            <div className="mt-3">
              <span className="text-sm font-medium">Зураг</span>
              <input
                ref={fileInputRef}
                id="product-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => pickImage(e.target.files?.[0])}
              />

              {imageUrl ? (
                <div className="relative mt-1 w-fit">
                  {/* Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо
                      шаардахгүйн тулд энгийн img ашиглав. */}
                  <img
                    src={imageUrl}
                    alt="Барааны зураг"
                    className="size-24 rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    aria-label="Зургийг хасах"
                    className="absolute -top-2 -right-2 rounded-full bg-foreground p-1 text-background"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="product-image"
                  className="mt-1 flex size-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground transition-colors hover:bg-accent"
                >
                  <ImagePlus className="size-5" />
                  <span className="mt-1 text-[11px]">
                    {uploading ? "..." : "Сонгох"}
                  </span>
                </label>
              )}
            </div>
          )}

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              onClick={save}
              disabled={!name.trim() || busy || uploading}
            >
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
              className="flex items-center gap-3 rounded-lg border px-4 py-3"
            >
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="size-10 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Package className="size-4 text-muted-foreground" />
                </div>
              )}
              <span className="flex-1 truncate text-sm font-medium">
                {product.name}
              </span>
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
