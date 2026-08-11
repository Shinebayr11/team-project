"use client"

import { cn } from "@/lib/utils"

export type ProfileTab = "following" | "purchases" | "saved" | "settings"

interface ProfileTabsProps {
  active: ProfileTab
  counts: Record<Exclude<ProfileTab, "settings">, number>
  onChange: (tab: ProfileTab) => void
}

export function ProfileTabs({ active, counts, onChange }: ProfileTabsProps) {
  const tabs: { id: ProfileTab; label: string; count?: number }[] = [
    { id: "following", label: "Дагаж буй", count: counts.following },
    { id: "purchases", label: "Худалдан авалт", count: counts.purchases },
    { id: "saved", label: "Хадгалсан шоу", count: counts.saved },
    { id: "settings", label: "Тохиргоо" },
  ]

  return (
    <div className="border-b" role="tablist">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-1.5 py-3 text-sm transition-colors",
              active === tab.id
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-muted-foreground">{tab.count}</span>
            )}
            {active === tab.id && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
