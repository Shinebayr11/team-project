"use client"

import { Star } from "lucide-react"

import { useNavigate } from "@/lib/router"
import { useFollow } from "@/hooks/useFollow"
import { Avatar } from "@/components/ui/Avatar"

/** Барааны табуудын дээрх худалдагчийн карт — ShowInfoPanel-ийн хөнгөн хувилбар. */
export function SellerPanel({
  title,
  seller,
  sellerId,
  category,
}: {
  title: string
  seller: string
  /** Populate хийгдээгүй/mock шууд дамжуулалтын хувьд байхгүй байж болно. */
  sellerId?: string
  category: string
}) {
  const navigate = useNavigate()
  const { isFollowing, toggleFollow, pendingId } = useFollow()
  const following = isFollowing(sellerId)

  return (
    <div className="border-b border-[var(--wn-line)] p-4">
      <div className="mb-1 text-[10px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase">
        {category}
      </div>
      <h1 className="mb-3 text-[20px] leading-tight font-[800] text-[var(--wn-ink)]">
        {title}
      </h1>

      <div
        className="group mb-3 flex cursor-pointer items-center gap-3"
        onClick={() => navigate(`/shop?seller=${seller}`)}
      >
        <Avatar name={seller} size={36} tint="var(--wn-accent-soft)" />
        <div>
          <div className="text-[14px] font-[700] text-[var(--wn-ink)] transition-colors group-hover:text-[var(--wn-accent)]">
            {seller}
          </div>
          <div className="flex items-center gap-1 text-[12px] text-[var(--wn-ink-3)]">
            <Star className="h-3 w-3 fill-[var(--wn-accent)] text-[var(--wn-accent)]" />
            <span>Шинэ худалдагч</span>
          </div>
        </div>
      </div>

      {/* Худалдагчийн id байхгүй бол дагах боломжгүй — сервер зөвхөн id-гаар
          ажилладаг тул товчийг харуулахгүй. */}
      {sellerId && (
        <button
          onClick={() => toggleFollow({ _id: sellerId, display_name: seller })}
          disabled={pendingId === sellerId}
          className={`w-full rounded-xl py-2 text-[13px] font-[700] transition-colors disabled:opacity-60 ${
            following
              ? "bg-[var(--wn-surface-2)] text-[var(--wn-ink)]"
              : "bg-[var(--wn-ink)] text-white hover:bg-[var(--wn-ink-2)]"
          }`}
        >
          {following ? "Дагаж байна" : "Дагах"}
        </button>
      )}
    </div>
  )
}
