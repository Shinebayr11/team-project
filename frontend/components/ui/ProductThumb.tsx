"use client"

import { Package } from "lucide-react"
import { AuctionProduct } from "@/hooks/useAuction"

/**
 * Барааны зураг, зураггүй бол орлуулах хайрцаг. Худалдагчийн бүх жагсаалт
 * (барааны сан, дамжуулалтын жагсаалт, дуудлага худалдаанд гаргах) ижилхэн
 * харагдана.
 */
export function ProductThumb({
  product,
  size = 40,
}: {
  product?: AuctionProduct
  size?: number
}) {
  const style = { width: size, height: size }

  return product?.images?.[0] ? (
    // Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо шаардахгүйн тулд
    // энгийн img ашиглав.
    <img
      src={product.images[0]}
      alt={product.name}
      style={style}
      className="shrink-0 rounded-lg object-cover"
    />
  ) : (
    <div
      style={style}
      className="flex shrink-0 items-center justify-center rounded-lg bg-[var(--wn-surface-2)]"
    >
      <Package className="size-4 text-[var(--wn-ink-3)]" />
    </div>
  )
}
