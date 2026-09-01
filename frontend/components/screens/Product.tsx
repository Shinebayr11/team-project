"use client"

import React, { useState } from "react"
import { useSearchParams, useNavigate } from "@/lib/router"
import { ChevronLeft } from "lucide-react"
import { SellerProduct, SellerRecord } from "@/types"
import { SELLERS } from "@/data"
import { useStore } from "@/store"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { ReviewSummary } from "@/components/reviews/ReviewSummary"
import { ReviewList } from "@/components/reviews/ReviewList"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductBuyPanel } from "@/components/product/ProductBuyPanel"

const FALLBACK_SELLER = "amyperrin"

const buildDescription = (seller: SellerRecord, product: SellerProduct) => {
  const intro = `A hand-picked ${seller.cat2.toLowerCase()} piece from ${seller.slug}'s ${seller.cat1} collection. `
  if (product.tag === "Live now")
    return `${intro}Currently live — up for grabs while the show is on air.`
  if (product.tag === "Giveaway")
    return `${intro}One lucky entrant wins this for free — follow the show to enter.`
  if (product.tag === "Sold")
    return `${intro}This exact piece already found a home, but more like it show up in every stream.`
  return `${intro}Ships within 1–2 business days, carefully packed to survive the trip.`
}

export const Product: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { openModal, addToCart, addToast } = useStore()
  const { requireAuth } = useRequireAuth()

  const slug = searchParams.get("seller") || FALLBACK_SELLER
  const productName = searchParams.get("product") || ""

  const seller = SELLERS[slug] || SELLERS[FALLBACK_SELLER]
  const product =
    seller.products.find((p) => p.name === productName) || seller.products[0]

  const [qty, setQty] = useState(1)

  const handleAddToCart = () => {
    addToCart({
      seller: seller.slug,
      name: product.name,
      price: product.price,
      qty,
    })
    addToast(`Added ${qty} to cart`)
  }

  return (
    <div className="mx-auto max-w-[1120px] px-8 py-8 pb-24">
      <button
        onClick={() => navigate(`/shop?seller=${seller.slug}`)}
        className="mb-8 flex items-center gap-1 text-[14px] font-[600] text-[var(--wn-ink-3)] transition-colors hover:text-[var(--wn-ink)]"
      >
        <ChevronLeft className="h-4 w-4" /> Back to {seller.slug}'s shop
      </button>

      <div className="mb-16 flex gap-10">
        <ProductGallery tag={product.tag} />
        <ProductBuyPanel
          seller={seller}
          product={product}
          description={buildDescription(seller, product)}
          qty={qty}
          onQtyChange={setQty}
          onBuy={() =>
            requireAuth(() =>
              openModal("buy", { product, seller: seller.slug, qty })
            )
          }
          onAddToCart={() => requireAuth(handleAddToCart)}
          onWatchLive={() => navigate(`/live-show?show=${seller.slug}`)}
          onEnterGiveaway={() =>
            requireAuth(() => openModal("giveaway", { product }))
          }
        />
      </div>

      <div className="max-w-[800px]">
        <h2 className="mb-2 text-[22px] font-[800] text-[var(--wn-ink)]">
          Reviews for {seller.slug}
        </h2>
        <ReviewSummary rating={seller.rating} count={seller.reviewCount} />
        <ReviewList reviews={seller.reviews} />
      </div>
    </div>
  )
}
