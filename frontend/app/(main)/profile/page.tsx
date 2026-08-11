"use client"

import { useState } from "react"
import { ProfileCard } from "@/components/profile/profile-card"
import { ProfileTabs, type ProfileTab } from "@/components/profile/profile-tabs"
import { SellerList } from "@/components/profile/seller-list"
import { MOCK_USER, MOCK_FOLLOWED } from "@/lib/mock-data"

export default function ProfilePage() {
  const [tab, setTab] = useState<ProfileTab>("following")

  return (
    <main className="mx-auto max-w-[1440px] px-10 pt-8 pb-10">
      <ProfileCard user={MOCK_USER} />

      <div className="mt-8">
        <ProfileTabs
          active={tab}
          counts={{
            following: MOCK_USER.followingCount,
            purchases: MOCK_USER.purchasesCount,
            saved: MOCK_USER.savedShowsCount,
          }}
          onChange={setTab}
        />

        <div className="pt-6">
          {tab === "following" && <SellerList sellers={MOCK_FOLLOWED} />}
          {tab === "purchases" && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Худалдан авалт байхгүй байна.
            </p>
          )}
          {tab === "saved" && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Хадгалсан шоу байхгүй байна.
            </p>
          )}
          {tab === "settings" && (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Тохиргоо удахгүй.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
