"use client"

import React, { useRef } from "react"
import { useSearchParams } from "@/lib/router"
import { useStore } from "@/store"
import { HOME_SHOWS } from "@/data"
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

const SAVED_SHOWS = HOME_SHOWS.filter((show) => show.saved)

export const Profile: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { state, followingCount, addToast } = useStore()

  const tab = (searchParams.get("tab") || "overview") as ProfileTab
  const nameInputRef = useRef<HTMLInputElement>(null)

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
        return <SavedTab shows={SAVED_SHOWS} />
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
            savedShows={SAVED_SHOWS}
            followingCount={followingCount()}
            onNavigate={goToTab}
          />
        )
    }
  }

  return (
    <div className="mx-auto flex max-w-[1200px] gap-12 px-6 py-10">
      <ProfileSidebar
        activeTab={tab}
        onSelect={goToTab}
        onEditProfile={handleEditProfile}
      />
      <main className="min-w-0 flex-1">{renderTab()}</main>
    </div>
  )
}
