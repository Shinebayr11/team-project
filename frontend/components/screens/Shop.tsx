"use client"

import React, { useState } from "react"
import { useSearchParams, useNavigate } from "@/lib/router"
import { SELLERS, REEL_SHOWS } from "@/data"
import { useStore } from "@/store"
import { ProductCard } from "@/components/cards/ProductCard"
import { ReviewSummary } from "@/components/reviews/ReviewSummary"
import { ReviewList } from "@/components/reviews/ReviewList"
import { ShopHeader } from "@/components/shop/ShopHeader"
import { ShopStats } from "@/components/shop/ShopStats"
import { ShopTabs, ShopTab } from "@/components/shop/ShopTabs"

const FALLBACK_SELLER = "amyperrin"

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useStore()

  const slug = searchParams.get("seller") || FALLBACK_SELLER
  const seller = SELLERS[slug] || SELLERS[FALLBACK_SELLER]

  const [tab, setTab] = useState<ShopTab>(
    searchParams.get("tab") === "reviews" ? "reviews" : "products"
  )

  const hasReel = REEL_SHOWS.some((s) => s.slug === seller.slug)

  // SELLERS нь жишээ өгөгдөл тул бодит хэрэглэгчийн id байхгүй. Чат нь
  // id-гаар нээгддэг болсон учир зурвасын жагсаалт руу л аваачна —
  // хуучин ?seller=<нэр> параметр одоо хүчингүй.

  return (
    <div className="mx-auto max-w-[1120px] pb-20">
      <ShopHeader
        seller={seller}
        following={isFollowing(seller.slug)}
        showWatchLive={hasReel && seller.live.type === "live"}
        onToggleFollow={() => toggleFollow(seller.slug)}
        onWatchLive={() => navigate(`/live-show?show=${seller.slug}`)}
        onMessage={() => navigate("/messages")}
      />

      <ShopStats seller={seller} />
      <ShopTabs active={tab} onChange={setTab} />

      <div className="px-8">
        {tab === "products" ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {seller.products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                seller={seller.slug}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-[800px]">
            <ReviewSummary rating={seller.rating} count={seller.reviewCount} />
            <ReviewList reviews={seller.reviews} />
          </div>
        )}
      </div>
    </div>
  )
}
