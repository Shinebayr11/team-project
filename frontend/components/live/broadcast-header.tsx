"use client"

import { Tag, Clock, Users } from "lucide-react"

import { BackButton } from "@/components/ui/BackButton"
import { LiveDot } from "@/components/ui/LiveDot"

/** Гарчгийн доорх контекстийн мөр. */
function ShowMeta({
  icon: Icon,
  children,
}: {
  icon: typeof Tag
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-4 text-gray-500" />
      {children}
    </span>
  )
}

/** Худалдагчийн дамжуулах самбарын дээд хэсэг: буцах товч, гарчиг, мета. */
export function BroadcastHeader({
  title,
  category,
  elapsed,
  viewers,
}: {
  title: string
  category?: string
  elapsed?: string | null
  viewers?: number
}) {
  return (
    <>
      {/* Өмнөх хуудас руу буцна. Худалдагч самбараасаа орж ирдэг тул түүх
          байхгүй үед л дүрд тохирсон нөөц зам руу очно. */}
      <BackButton
        label="Sellerhub"
        fallback="/seller/shows"
        className="mb-3 text-[13px] font-[700] text-gray-500 hover:text-black"
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[24px] font-[800] tracking-tight text-black">
            {title}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-4 text-[14px] font-[500] text-gray-500">
            <span className="flex items-center gap-1.5 font-[700] text-[var(--wn-live-deep)]">
              <LiveDot />
              Шууд
            </span>
            {category && <ShowMeta icon={Tag}>{category}</ShowMeta>}
            {elapsed && <ShowMeta icon={Clock}>{elapsed}</ShowMeta>}
            {viewers != null && <ShowMeta icon={Users}>{viewers} үзэгч</ShowMeta>}
          </div>
        </div>
      </div>
    </>
  )
}
