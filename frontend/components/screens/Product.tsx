"use client"

import React, { useState } from "react"
import { useSearchParams } from "@/lib/router"
import { useStore } from "@/store"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useProduct, sellerOf, shopKeyOf } from "@/hooks/useProduct"
import { BackButton } from "@/components/ui/BackButton"
import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductBuyPanel } from "@/components/product/ProductBuyPanel"
import { ProductAuctionPanel } from "@/components/product/ProductAuctionPanel"

/**
 * Барааны хуудас.
 *
 * Өмнө нь `data/sellers.ts` дэх СТАТИК demo өгөгдлөөс уншдаг байсан тул
 * худалдагчийн жинхэнэ нэмсэн бараа энд хэзээ ч гарч ирдэггүй, зураг нь
 * үргэлж хоосон бараан дөрвөлжин, үнэлгээ нь зохиомол байв. Одоо
 * `GET /api/product/:id`-аас уншина — дэлгүүрийн сүлжээ ба шууд эфирийн
 * барааны жагсаалт хоёулаа энэ рүү холбогдоно.
 */
export const Product: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { openModal, addToCart, addToast } = useStore()
  const { requireAuth } = useRequireAuth()

  const id = searchParams.get("id")
  const { product, listing, loading, notFound, refresh } = useProduct(id)
  const [qty, setQty] = useState(1)

  const seller = sellerOf(product)
  const backTo = seller ? `/shop?seller=${encodeURIComponent(shopKeyOf(seller))}` : "/home"

  if (loading) {
    return (
      <SkeletonScreen className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Skeleton className="mb-8 h-5 w-20" />
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <Skeleton className="aspect-square flex-1 rounded-[24px]" />
          <div className="flex w-full flex-col gap-4 lg:w-[420px] lg:shrink-0">
            <Skeleton className="h-10 w-48 rounded-full" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-[52px] w-full rounded-xl" />
            <Skeleton className="h-[52px] w-full rounded-xl" />
          </div>
        </div>
      </SkeletonScreen>
    )
  }

  if (!id || notFound || !product) {
    return (
      <div className="mx-auto max-w-[1120px] px-4 py-24 text-center">
        <BackButton className="mb-6" fallback="/home" />
        <p className="text-[16px] font-[700] text-[var(--wn-ink)]">Бараа олдсонгүй.</p>
        <p className="mt-1 text-[14px] text-[var(--wn-ink-3)]">
          Холбоос хуучирсан эсвэл бараа устсан байж магадгүй.
        </p>
      </div>
    )
  }

  // `BuyModal` нь шууд эфирийн талтай хуваалцдаг тул түүний хүлээдэг хэлбэрт
  // тааруулж дамжуулна — модалыг өөрчилвөл эфирийн урсгал хөндөгдөнө.
  const buyPayload = {
    product: {
      name: product.name,
      price: String(product.price_coins ?? 0),
      tag: "Buy now" as const,
    },
    seller: shopKeyOf(seller),
    qty,
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-20 sm:px-6 lg:px-8 lg:py-8 lg:pb-24">
      <BackButton className="mb-8" fallback={backTo} />

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <ProductGallery images={product.images ?? []} name={product.name} />
        <ProductBuyPanel
          product={product}
          seller={seller}
          qty={qty}
          onQtyChange={setQty}
          onBuy={() => requireAuth(() => openModal("buy", buyPayload))}
          auction={
            listing ? (
              <ProductAuctionPanel listing={listing} onBidPlaced={refresh} />
            ) : undefined
          }
          onAddToCart={() =>
            requireAuth(() => {
              addToCart({
                seller: shopKeyOf(seller),
                name: product.name,
                price: String(product.price_coins ?? 0),
                qty,
              })
              addToast(`Сагсанд ${qty} ширхэг нэмлээ.`)
            })
          }
        />
      </div>
    </div>
  )
}
