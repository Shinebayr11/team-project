"use client"

import React, { useState } from "react"
import { useSearchParams, useNavigate } from "@/lib/router"
import { SellerProduct, SellerRecord } from "@/types"
import { SELLERS } from "@/data"
import { useStore } from "@/store"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { BackButton } from "@/components/ui/BackButton"
import { ReviewSummary } from "@/components/reviews/ReviewSummary"
import { ReviewList } from "@/components/reviews/ReviewList"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductBuyPanel } from "@/components/product/ProductBuyPanel"

const FALLBACK_SELLER = "amyperrin"

// Ангиллын нэрс (`cat1`, `cat2`) нь үрийн өгөгдлийн чөлөөт бичвэр тул хэвээр
// үлдэнэ — жинхэнэ дэлгүүр нь эдгээрийг API-аас авдаг.
const buildDescription = (seller: SellerRecord, product: SellerProduct) => {
  const intro = `${seller.slug} дэлгүүрийн ${seller.cat1} цуглуулгаас сонгосон ${seller.cat2} эдлэл. `
  if (product.tag === "Live now")
    return `${intro}Яг одоо шууд эфирт байна — дамжуулалт үргэлжилж байхад авах боломжтой.`
  if (product.tag === "Giveaway")
    return `${intro}Азтай нэг оролцогч үнэгүй хожино — оролцохын тулд дамжуулалтыг дагаарай.`
  if (product.tag === "Sold")
    return `${intro}Энэ эдлэл эзэнтэй болсон ч дамжуулалт бүрт иймэрхүү эд зүйл гарсаар байна.`
  return `${intro}1–2 ажлын өдөрт нямбай баглаж илгээнэ.`
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
    addToast(`Сагсанд ${qty} ширхэг нэмлээ.`)
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-20 sm:px-6 lg:px-8 lg:py-8 lg:pb-24">
      <BackButton className="mb-8" fallback={`/shop?seller=${seller.slug}`} />

      <div className="mb-12 lg:mb-16 flex flex-col gap-8 lg:flex-row lg:gap-10">
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
