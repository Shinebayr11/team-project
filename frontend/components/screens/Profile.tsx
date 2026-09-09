"use client"

import React, { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useSearchParams } from "@/lib/router"
import { useStore } from "@/store"
import { useAccount } from "@/hooks/useAccount"
import { useFollow } from "@/hooks/useFollow"
import { useMyPurchases } from "@/hooks/useMyPurchases"
import { useLiveShows } from "@/hooks/useLiveShows"
import {
  ProfileSidebar,
  ProfileTab,
} from "@/components/profile/ProfileSidebar"
import { OverviewTab } from "@/components/profile/OverviewTab"
import { PurchasesTab } from "@/components/profile/PurchasesTab"
import { FollowingTab } from "@/components/profile/FollowingTab"
import { SavedTab } from "@/components/profile/SavedTab"
import { SettingsTab } from "@/components/profile/SettingsTab"
import { AddressesTab } from "@/components/profile/AddressesTab"

export const Profile: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToast } = useStore()
  // Дагаж буй тоо, худалдан авалт бүгд серверээс — mock өгөгдөл биш.
  const { followingCount } = useFollow()
  const { purchases, activeBids, loading: buyingLoading } = useMyPurchases()
  const { shows } = useLiveShows()
  const savedShows = shows.filter((show) => show.saved)
  const { user, isLoaded } = useUser()
  // Хажуугийн самбар, тохиргооны таб хоёулаа бүртгэлийн зургийг хардаг —
  // энд НЭГ удаа уншаад доош дамжуулна, эс тэгвээс нэг хуудас /api/users/me
  // рүү хоёр хүсэлт явуулна.
  const { account, save: saveAccount } = useAccount()
  const router = useRouter()
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isLoaded && !user) router.replace("/sign-in")
  }, [isLoaded, user, router])

  if (!isLoaded || !user) return null

  const tab = (searchParams.get("tab") || "overview") as ProfileTab

  const goToTab = (next: ProfileTab) => setSearchParams({ tab: next })

  const handleEditProfile = () => {
    goToTab("settings")
    // The settings form only mounts after the tab switch, so focus on the next frame.
    requestAnimationFrame(() => nameInputRef.current?.focus())
  }

  const renderTab = () => {
    switch (tab) {
      case "purchases":
        return (
          <PurchasesTab
            purchases={purchases}
            bids={activeBids}
            loading={buyingLoading}
          />
        )
      case "following":
        return <FollowingTab />
      case "saved":
        return <SavedTab shows={savedShows} />
      case "settings":
        return (
          <SettingsTab
            nameInputRef={nameInputRef}
            account={account}
            saveAccount={saveAccount}
            onSave={() => addToast("Хадгалагдлаа.")}
          />
        )
      case "addresses":
        return <AddressesTab />
      default:
        return (
          <OverviewTab
            purchases={purchases}
            savedShows={savedShows}
            followingCount={followingCount}
            loading={buyingLoading}
            onNavigate={goToTab}
          />
        )
    }
  }

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-12 lg:px-6 lg:py-10">
      <ProfileSidebar
        activeTab={tab}
        avatarUrl={account?.avatar_url}
        onSelect={goToTab}
        onEditProfile={handleEditProfile}
      />
      <main className="min-w-0 flex-1">{renderTab()}</main>
    </div>
  )
}
