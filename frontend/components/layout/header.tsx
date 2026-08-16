"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Search, Coins, Radio } from "lucide-react"
import { NavTabs } from "./nav-tabs"
import { ThemeToggle } from "./theme-toggle"
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  credits?: number
}

export function Header({ credits = 0 }: HeaderProps) {
  const { isSignedIn, isLoaded } = useAuth()
  const [hasActive, setHasActive] = useState(false)

  useEffect(() => {
    setHasActive(!!localStorage.getItem("activeStream"))
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
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
          {hasActive && (
            <Link
              href="/sell"
              className="text-destructive-foreground inline-flex h-8 items-center gap-1.5 rounded-md bg-destructive px-3 text-sm font-medium hover:bg-destructive/90"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
              Миний шууд дамжуулалт
            </Link>
          )}

          <ThemeToggle />

          {!isLoaded ? (
            <div className="size-8" aria-hidden />
          ) : isSignedIn ? (
            <>
              <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                <Coins className="size-4" />
                {credits.toLocaleString()}
              </div>
              <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button size="sm">Нэвтрэх</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
