"use client"

import Link from "next/link"
import {
  Sparkles,
  Users,
  Shirt,
  Home,
  Armchair,
  Baby,
  Watch,
  Palette,
  Gem,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/stream"

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  users: Users,
  shirt: Shirt,
  home: Home,
  armchair: Armchair,
  baby: Baby,
  watch: Watch,
  palette: Palette,
  gem: Gem,
}

interface CategorySidebarProps {
  categories: Category[]
  activeSlug?: string
  onFilterClick?: () => void
}

export function CategorySidebar({
  categories,
  activeSlug,
  onFilterClick,
}: CategorySidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r px-3 py-6">
      <h2 className="mb-3 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Ангилал
      </h2>

      <nav className="flex-1">
        <ul className="space-y-0.5">
          {categories.map((c) => {
            const Icon = ICONS[c.icon] ?? Sparkles
            const active = c.slug === activeSlug

            return (
              <li key={c.slug}>
                <Link
                  href={`/browse/${c.slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="leading-tight">{c.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-6 border-t pt-4">
        <Button className="w-full" onClick={onFilterClick}>
          <SlidersHorizontal className="mr-2 size-4" />
          Шоу шүүх
        </Button>
      </div>
    </aside>
  )
}
