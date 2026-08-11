"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/following", label: "Following" },
  { href: "/profile", label: "Profile" },
]

export function NavTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-6">
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative py-4 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
