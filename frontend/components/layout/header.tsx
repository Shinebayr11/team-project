import Link from "next/link"
import { Search, Coins } from "lucide-react"
import { NavTabs } from "./nav-tabs"
import { ThemeToggle } from "./theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  credits?: number
  user?: { username: string; avatarUrl?: string }
}

export function Header({ credits = 0, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center gap-6 px-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          Reelshop
        </Link>

        <NavTabs />

        <div className="relative mx-auto w-full max-w-lg">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Шоу, худалдагч, бараа хайх"
            className="h-9 w-full rounded-full border bg-muted/40 pr-4 pl-9 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
            <Coins className="size-4" />
            {credits.toLocaleString()}
          </div>

          <Avatar className="size-8">
            <AvatarImage src={user?.avatarUrl} alt={user?.username} />
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
