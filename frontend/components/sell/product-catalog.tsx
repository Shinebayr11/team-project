"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ImagePlus, Package, Plus, X } from "lucide-react"
import { useApiClient } from "@/hooks/useApiClient"
import { AuctionProduct } from "@/hooks/useAuction"
import { isImageUploadReady, uploadImage } from "@/lib/cloudinary"

const fieldClass =
  "mt-1 h-[44px] w-full rounded-xl border border-[var(--wn-line-2)] px-4 text-[15px] text-[var(--wn-ink)] outline-none focus:border-[var(--wn-accent)] transition-colors"
const pillOutline =
  "inline-flex items-center rounded-full border border-[var(--wn-line-2)] px-3.5 py-1.5 text-[13px] font-[700] text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-surface-2)]"

/**
 * Худалдагчийн барааны сан. Шоуны үед аукционд гаргах бараа эндээс сонгогдох
 * тул дамжуулалт эхлэхээс өмнө бүртгэсэн байх ёстой.
 */
export function ProductCatalog({ className = "" }: { className?: string }) {
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
    <div
      className={`relative overflow-hidden rounded-[24px] border border-[var(--wn-line)] bg-[linear-gradient(160deg,#ffffff_0%,#f7f2ff_55%,#fdf2f8_100%)] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
    >
      <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-[var(--wn-accent)]/10 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#7c3aed_0%,#5b3fe0_35%,#d946ef_70%,#fb923c_100%)]" />

      <div className="relative flex items-center justify-between">
        <div>
          <h2 className="font-display text-[18px] font-[800] tracking-tight text-[var(--wn-ink)]">
            Миний бараа
          </h2>
          <p className="mt-1 text-[14px] text-[var(--wn-ink-3)]">
            Шоуны үед эндээс сонгож аукционд гаргана.
          </p>
        </div>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className={pillOutline}>
            <Plus className="mr-1 size-3.5" />
            Нэмэх
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-4 rounded-2xl border border-[var(--wn-line)] bg-[var(--wn-surface-3)] p-4">
          <label className="block text-[13px] font-[700] text-[var(--wn-ink-2)]" htmlFor="product-name">
            Барааны нэр
            <input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Жишээ: Vintage шил ваар"
              className={fieldClass}
              autoComplete="off"
            />
          </label>

          <div className="mt-3 flex gap-3">
            <label className="flex-1 text-[13px] font-[700] text-[var(--wn-ink-2)]" htmlFor="product-price">
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
            <label className="w-28 text-[13px] font-[700] text-[var(--wn-ink-2)]" htmlFor="product-stock">
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
              <span className="text-[13px] font-[700] text-[var(--wn-ink-2)]">Зураг</span>
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
                    className="size-24 rounded-xl border border-[var(--wn-line)] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    aria-label="Зургийг хасах"
                    className="absolute -top-2 -right-2 rounded-full bg-[var(--wn-ink)] p-1 text-white"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="product-image"
                  className="mt-1 flex size-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--wn-line-3)] text-[var(--wn-ink-3)] transition-colors hover:bg-[var(--wn-surface-2)]"
                >
                  <ImagePlus className="size-5" />
                  <span className="mt-1 text-[11px]">
                    {uploading ? "..." : "Сонгох"}
                  </span>
                </label>
              )}
            </div>
          )}

          {error && <p className="mt-2 text-[13px] text-[var(--wn-live)]">{error}</p>}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!name.trim() || busy || uploading}
              className="h-9 rounded-full bg-[var(--wn-accent)] px-4 text-[13px] font-[700] text-white transition-colors hover:bg-[var(--wn-accent-hover)] disabled:opacity-50"
            >
              {busy ? "Хадгалж байна..." : "Хадгалах"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false)
                setError(null)
              }}
              className={pillOutline}
            >
              Болих
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {loading ? (
          <p className="text-[14px] text-[var(--wn-ink-3)]">Уншиж байна...</p>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--wn-line-3)] p-6 text-center">
            <Package className="mx-auto size-6 text-[var(--wn-ink-3)]" />
            <p className="mt-2 text-[14px] text-[var(--wn-ink-3)]">
              Бараа бүртгээгүй байна.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-3 rounded-xl border border-[var(--wn-line)] px-4 py-3"
            >
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="size-10 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--wn-surface-2)]">
                  <Package className="size-4 text-[var(--wn-ink-3)]" />
                </div>
              )}
              <span className="flex-1 truncate text-[14px] font-[600] text-[var(--wn-ink)]">
                {product.name}
              </span>
              <span className="shrink-0 text-[14px] font-[700] text-[var(--wn-ink-3)]">
                ₮{product.price_coins ?? 0}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
