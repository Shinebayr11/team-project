"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { FollowedSeller } from "@/types/user"

export function SellerRow({ seller }: { seller: FollowedSeller }) {
  const [following, setFollowing] = useState(true)

  return (
    <article className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <Link href={`/seller/${seller.username}`} className="relative shrink-0">
        <Avatar className="size-11">
          <AvatarImage src={seller.avatarUrl} alt={seller.username} />
          <AvatarFallback>{seller.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        {seller.isLive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-red-500 px-1.5 text-[10px] leading-4 font-bold text-white">
            LIVE
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/seller/${seller.username}`}
          className="block truncate text-sm font-medium hover:underline"
        >
          {seller.username}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          {seller.tagline}
        </p>
      </div>

      {seller.isLive ? (
        <Link
          href={`/live/${seller.id}`}
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Үзэх
        </Link>
      ) : (
        <Button
          size="sm"
          variant={following ? "secondary" : "default"}
          onClick={() => setFollowing((v) => !v)}
        >
          {following ? "Дагаж байна" : "Дагах"}
        </Button>
      )}
    </article>
  )
}
