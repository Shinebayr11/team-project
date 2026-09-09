"use client"

import { useCallback, useRef, useState } from "react"
import { SkeletonRows, SkeletonScreen } from "@/components/ui/Skeleton"
import { ImagePlus, Package, Plus, X } from "lucide-react"
import { useApiClient } from "@/hooks/useApiClient"
import { AuctionProduct } from "@/hooks/useAuction"
import { isImageUploadReady, uploadImage } from "@/lib/cloudinary"
import { lineupEntryOf, ShowLineupState } from "@/hooks/useShowProducts"
import { ProductThumb } from "@/components/ui/ProductThumb"
import { useLoad } from "@/hooks/useLoad"

// Хүрээ нь `--wn-ink-4`: `--wn-line-2` цагаан дээр 1.49:1 буюу SC 1.4.11-ийн
// 3:1-ийг давдаггүй (`components/ui/input.tsx`-тэй ижил шалтгаан).
const fieldClass =
  "mt-1 h-[44px] w-full rounded-xl border border-[var(--wn-ink-4)] px-4 text-[15px] text-[var(--wn-ink)] outline-none transition-colors focus:border-[var(--wn-accent)] focus:ring-2 focus:ring-[var(--wn-accent)]/25"
const pillOutline =
  "inline-flex items-center rounded-full border border-gray-300 px-3.5 py-1.5 text-[13px] font-[700] text-black transition-colors hover:bg-gray-50"

/**
 * Худалдагчийн барааны сан. Шууд дамжуулалтын үед дуудлага худалдаанд гаргах бараа эндээс сонгогдох
 * тул шууд дамжуулалт эхлэхээс өмнө бүртгэсэн байх ёстой.
 */
export function ProductCatalog({
  className = "",
  lineup,
}: {
  className?: string
  /** Шууд дамжуулалт явж байвал бараан дээр дарж шууд гаргана. */
  lineup?: ShowLineupState
}) {
  const { callApi } = useApiClient()
  const [addingToShow, setAddingToShow] = useState<string | null>(null)
  const [showError, setShowError] = useState<string | null>(null)

  const putOnShow = async (productId: string) => {
    if (!lineup) return
    setAddingToShow(productId)
    setShowError(null)
    const result = await lineup.add(productId)
    if (!result.ok) setShowError(result.message ?? "Гаргаж чадсангүй")
    setAddingToShow(null)
  }

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

  useLoad(load)

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
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-[800] text-black">Миний бараа</h2>
          <p className="mt-1 text-[14px] font-[500] text-gray-500">
            {lineup
              ? "Бараан дээрээ дарж шууд дамжуулалт дээр гаргана."
              : "Шууд дамжуулалт эхлүүлсний дараа эндээс дарж гаргана."}
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
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <label className="block text-[13px] font-[700] text-[var(--wn-ink-2)]" htmlFor="product-name">
            Барааны нэр
            <input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Жишээ: Винтаж шил ваар"
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
                  className="mt-1 flex size-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--wn-line-3)] text-[var(--wn-ink-3)] transition-colors hover:bg-[var(--wn-accent-wash)]"
                >
                  <ImagePlus className="size-5" />
                  <span className="mt-1 text-[11px]">
                    {uploading ? "..." : "Сонгох"}
                  </span>
                </label>
              )}
            </div>
          )}

          {error && <p className="mt-2 text-[13px] font-[600] text-[var(--wn-live-deep)]">{error}</p>}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!name.trim() || busy || uploading}
              className="h-9 rounded-full bg-[#1A1A1A] px-4 text-[13px] font-[700] text-white transition-colors hover:bg-black disabled:opacity-50"
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
          <SkeletonScreen label="Барааг уншиж байна">
            <SkeletonRows rows={3} />
          </SkeletonScreen>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--wn-line-3)] p-6 text-center">
            <Package className="mx-auto size-6 text-[var(--wn-ink-3)]" />
            <p className="mt-2 text-[14px] text-[var(--wn-ink-3)]">
              Бараа бүртгээгүй байна.
            </p>
          </div>
        ) : (
          products.map((product) => {
            const onShow = lineup && lineupEntryOf(lineup.entries, product._id)
            const busy = addingToShow === product._id

            const row = (
              <>
                <ProductThumb product={product} />
                <span className="flex-1 truncate text-left text-[14px] font-[600] text-[var(--wn-ink)]">
                  {product.name}
                </span>
                {onShow ? (
                  <span className="shrink-0 rounded-full bg-[var(--wn-live-soft)] px-2.5 py-1 text-[12px] font-[700] text-[var(--wn-live-deep)]">
                    Гарсан
                  </span>
                ) : busy ? (
                  <span className="shrink-0 text-[13px] font-[600] text-[var(--wn-ink-3)]">
                    Гаргаж байна…
                  </span>
                ) : null}
                <span className="shrink-0 text-[14px] font-[700] text-[var(--wn-ink-3)]">
                  ₮{product.price_coins ?? 0}
                </span>
              </>
            )

            // Шууд дамжуулалт явж байгаа үед мөр нь товч болно — дарахад бараа
            // шууд дамжуулалтын жагсаалтад орж, үзэгчид шууд харна.
            return lineup ? (
              <button
                key={product._id}
                type="button"
                onClick={() => putOnShow(product._id)}
                disabled={!!onShow || busy}
                title={onShow ? 'Шууд дамжуулалт дээр гарсан' : 'Шууд дамжуулалт дээр гаргах'}
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50 disabled:cursor-default disabled:hover:bg-transparent"
              >
                {row}
              </button>
            ) : (
              <div
                key={product._id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3"
              >
                {row}
              </div>
            )
          })
        )}

        {showError && (
          <p className="text-[13px] font-[600] text-[var(--wn-live-deep)]">{showError}</p>
        )}
      </div>
    </div>
  )
}
