"use client"

import React, { ReactNode } from "react"

import { StoreProvider } from "@/store"
import { useLocation } from "@/lib/router"
import { Topbar } from "@/components/layout/Topbar"
import { ModalsRenderer } from "@/components/modals/ModalsRenderer"
import { ToastContainer } from "@/components/ui/ToastContainer"
import { SellerProfileProvider } from "@/hooks/useSellerProfile"
import { SellerGateProvider } from "@/components/seller/SellerGateProvider"

/**
 * Chrome shared by every screen. The seller hub brings its own sidebar, so it
 * opts out of the shopper topbar. The live-show page hides the topbar on mobile
 * to maximize the video stage.
 */
const Chrome: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { pathname } = useLocation()
  const isSellerHub = pathname.startsWith("/seller")
  const isLiveShowMobile = pathname === "/live-show"

  return (
    <>
      {!isSellerHub && (
        <Topbar className={isLiveShowMobile ? "hidden lg:flex" : undefined} />
      )}
      {children}
      <ModalsRenderer />
      <ToastContainer />
    </>
  )
}

/**
 * `whynot-root` scopes the design tokens defined in app/globals.css, which are
 * `--wn-` prefixed so they never collide with the shadcn tokens the LiveKit
 * controls still rely on.
 */
export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="whynot-root min-h-svh">
    <StoreProvider>
      <SellerProfileProvider>
        <SellerGateProvider>
          <Chrome>{children}</Chrome>
        </SellerGateProvider>
      </SellerProfileProvider>
    </StoreProvider>
  </div>
)

export const RouteFallback = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <div className="size-6 animate-spin rounded-full border-2 border-[var(--wn-ink-3)] border-t-transparent opacity-50" />
  </div>
)
