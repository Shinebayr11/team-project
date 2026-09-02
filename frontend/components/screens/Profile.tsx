"use client"

import React, { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useSearchParams } from "@/lib/router"
import { useStore } from "@/store"
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
import { PaymentTab } from "@/components/profile/PaymentTab"
import { AddressesTab } from "@/components/profile/AddressesTab"

export const Profile: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { state, followingCount, addToast } = useStore()
  const { shows } = useLiveShows()
  const savedShows = shows.filter((show) => show.saved)
  const { user, isLoaded } = useUser()
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
        return <PurchasesTab purchases={state.purchases} bids={state.bids} />
      case "following":
        return <FollowingTab />
      case "saved":
        return <SavedTab shows={savedShows} />
      case "settings":
        return (
          <SettingsTab
            nameInputRef={nameInputRef}
            onSave={() => addToast("Saved.")}
          />
        )
      case "payment":
        return <PaymentTab />
      case "addresses":
        return <AddressesTab />
      default:
        return (
          <OverviewTab
            purchases={state.purchases}
            savedShows={savedShows}
            followingCount={followingCount()}
            onNavigate={goToTab}
          />
        )
    }
  }

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-12 lg:px-6 lg:py-10">
      <ProfileSidebar
        activeTab={tab}
        onSelect={goToTab}
        onEditProfile={handleEditProfile}
      />
      <main className="min-w-0 flex-1">{renderTab()}</main>
    </div>
  )
}
