import Image from "next/image"
import Link from "next/link"
import { Bookmark, Calendar, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Stream, StreamBadge } from "@/types/stream"

const BADGE_LABELS: Record<StreamBadge, string> = {
  sponsored: "Ивээн тэтгэсэн",
  estate_sales: "Өв хөрөнгө",
}

function TopLeftStatus({ status }: { status: Stream["status"] }) {
  if (status.kind === "live") {
    return (
      <span className="flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
        </span>
        Live
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-1 text-[11px] font-medium tracking-wide text-white uppercase backdrop-blur">
      <Calendar className="size-3" />
      {status.startsAt}
    </span>
  )
}

export function StreamCard({ stream }: { stream: Stream }) {
  const { id, title, description, thumbnailUrl, seller, badge, status } = stream

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20">
      <Link href={`/live/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2">
            <TopLeftStatus status={status} />
            {badge && (
              <span className="rounded-md bg-primary px-2 py-1 text-[11px] font-bold tracking-wide text-primary-foreground uppercase">
                {BADGE_LABELS[badge]}
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8">
            <Avatar className="size-6 border border-white/20">
              <AvatarImage src={seller.avatarUrl} alt={seller.username} />
              <AvatarFallback className="text-[10px]">
                {seller.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="min-w-0 flex-1 truncate text-xs font-medium text-white">
              {seller.username}
            </span>

            <span className="flex shrink-0 items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[11px] text-white backdrop-blur">
              {status.kind === "live" ? (
                <>
                  <Eye className="size-3" />
                  {status.viewers}
                </>
              ) : (
                <>
                  <Bookmark className="size-3" />
                  {status.savedCount ?? 0}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="truncate leading-tight font-semibold">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        </div>
      </Link>
    </article>
  )
}
