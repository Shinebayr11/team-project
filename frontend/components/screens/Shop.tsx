"use client"

import React from "react"
import { Package } from "lucide-react"
import { Link, useSearchParams, useNavigate } from "@/lib/router"
import { useFollow } from "@/hooks/useFollow"
import { useSellerShop, shopName } from "@/hooks/useSellerShop"
import { BackButton } from "@/components/ui/BackButton"
import { Skeleton, SkeletonScreen, SkeletonCardGrid } from "@/components/ui/Skeleton"
import { ShopHeader } from "@/components/shop/ShopHeader"
import { ShopStats } from "@/components/shop/ShopStats"

/**
 * Дэлгүүрийн хуудас — бодит худалдагч, бодит бараа.
 *
 * `?seller=` нь id, дэлгүүрийн хаяг, дэлгүүрийн нэр эсвэл хэрэглэгчийн нэр
 * байж болно (сервер бүгдийг нь хайдаг) тул хуучин холбоосууд ажилласаар байна.
 */
export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const key = searchParams.get("seller")

  const { seller, products, loading, notFound } = useSellerShop(key)
  const { isFollowing, toggleFollow, pendingId } = useFollow()

  if (loading) {
    return (
      <SkeletonScreen className="mx-auto max-w-[1120px] pb-20">
        {/* Ковер, аватар, нэр — `ShopHeader`-ын хэмжээгээр. */}
        <Skeleton className="h-[180px] w-full rounded-none sm:rounded-b-[24px]" />
        <div className="flex items-end gap-4 px-4 sm:px-6 lg:px-8 -mt-10">
          <Skeleton className="size-20 shrink-0 rounded-full border-4 border-white" />
          <div className="flex flex-1 flex-col gap-2 pb-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>

        <div className="mt-8 px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-5 w-20" />
          <SkeletonCardGrid
            className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            count={10}
            ratio="1/1"
            withHeader={false}
          />
        </div>
      </SkeletonScreen>
    )
  }

  if (!seller || notFound) {
    return (
      <div className="mx-auto max-w-[1120px] px-4 py-24 text-center">
        <BackButton className="mb-6" fallback="/home" />
        <p className="text-[16px] font-[700] text-[var(--wn-ink)]">Дэлгүүр олдсонгүй.</p>
        <p className="mt-1 text-[14px] text-[var(--wn-ink-3)]">
          Холбоос хуучирсан эсвэл дэлгүүр устсан байж магадгүй.
        </p>
      </div>
    )
  }

  const name = shopName(seller)

  return (
    <div className="relative mx-auto max-w-[1120px] pb-20">
      {/* Ковер зураг дээр хөвөх тул цагаан дэвсгэртэй — градиент дээр уншигдана. */}
      <BackButton
        label="Буцах"
        fallback="/home"
        className="absolute top-4 left-4 z-20 rounded-full bg-white/90 px-3 py-1.5 text-[var(--wn-ink)] shadow-sm backdrop-blur-md hover:bg-white"
      />

      <ShopHeader
        seller={seller}
        following={isFollowing(seller._id)}
        followPending={pendingId === seller._id}
        onToggleFollow={() =>
          toggleFollow({
            _id: seller._id,
            display_name: seller.display_name,
            shop_name: seller.shop_name,
            avatar_url: seller.avatar_url,
          })
        }
        onMessage={() => navigate(`/messages?user=${seller._id}`)}
      />

      <ShopStats seller={seller} productCount={products.length} />

      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-[18px] font-[800] text-[var(--wn-ink)]">Бараа</h2>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--wn-line-3)] py-16 text-center">
            <Package className="mx-auto size-6 text-[var(--wn-ink-4)]" />
            <p className="mt-2 text-[14px] font-[600] text-[var(--wn-ink-3)]">
              {name} одоогоор бараа байршуулаагүй байна.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product?id=${product._id}`}
                className="group flex flex-col gap-2"
              >
                <div className="aspect-square w-full overflow-hidden rounded-[16px] bg-[var(--wn-shot)]">
                  {product.images?.[0] ? (
                    // Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо шаардахгүй.
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-6 text-[var(--wn-ink-4)]" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-[14.5px] leading-tight font-[600] text-[var(--wn-ink)] transition-colors group-hover:text-[var(--wn-accent)]">
                    {product.name}
                  </h4>
                  <div className="mt-0.5 text-[14px] font-[700] text-[var(--wn-ink-2)]">
                    ₮{(product.price_coins ?? 0).toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
