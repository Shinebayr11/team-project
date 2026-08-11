"use client"

import { ChevronDown } from "lucide-react"

export type SortOption = "popular" | "newest" | "ending_soon"

const LABELS: Record<SortOption, string> = {
  popular: "Түгээмэл",
  newest: "Шинэ",
  ending_soon: "Удахгүй дуусах",
}

interface CategoryHeaderProps {
  name: string
  sort: SortOption
  onSortChange: (s: SortOption) => void
}

export function CategoryHeader({
  name,
  sort,
  onSortChange,
}: CategoryHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold tracking-tight">{name}</h1>

      <div className="relative">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="h-9 appearance-none rounded-lg border bg-background pr-9 pl-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {(Object.keys(LABELS) as SortOption[]).map((k) => (
            <option key={k} value={k}>
              Эрэмбэ: {LABELS[k]}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  )
}
