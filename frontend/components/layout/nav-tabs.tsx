"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const BASE_TABS = [
  { href: "/home", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/following", label: "Following" },
  { href: "/profile", label: "Profile" },
]

export function NavTabs() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()

  const isSeller = isLoaded && user?.publicMetadata?.sellerStatus === "approved"

  const tabs = isSeller
    ? [...BASE_TABS.slice(0, 3), { href: "/sell", label: "Sell" }, BASE_TABS[3]]
    : BASE_TABS

  return (
    <nav className="flex items-center gap-6">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href)

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
