"use client"

import React, { ReactNode } from "react"
import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton"

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

/**
 * 18 маршрутын нийтлэг Suspense хил. Дэлгэц бүр өөр хэлбэртэй тул энэ нь
 * ЯМАР Ч тодорхой бүтэц зааж болохгүй — гарчиг ба контентын блок гэсэн
 * бүх хуудсанд үнэн байдаг хэсгээр хязгаарлана. Дэлгэц өөрөө ачаалагдмагц
 * өөрийн нарийвчилсан skeleton-оо (жишээ нь `Home`, `Shop`) харуулна.
 */
export const RouteFallback = () => (
  <SkeletonScreen className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-4 py-8 sm:px-6">
    <Skeleton className="h-8 w-56" />
    <Skeleton className="h-4 w-80" />
    <div className="mt-2 flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  </SkeletonScreen>
)
