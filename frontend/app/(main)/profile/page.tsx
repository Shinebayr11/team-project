"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { ProfileCard } from "@/components/profile/profile-card"
import { ProfileTabs, type ProfileTab } from "@/components/profile/profile-tabs"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { SellerList } from "@/components/profile/seller-list"
import { Button } from "@/components/ui/button"
import { MOCK_FOLLOWED } from "@/lib/mock-data"

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [tab, setTab] = useState<ProfileTab>("following")

  if (!isLoaded) {
    return (
      <main className="mx-auto max-w-[1440px] px-10 py-8">
        <div className="h-32 animate-pulse rounded-xl border bg-card" />
      </main>
    )
  }

  if (!user) return null

  const isSeller = user.publicMetadata?.sellerStatus === "approved"

  const profile = {
    username:
      user.username ??
      user.firstName ??
      user.primaryEmailAddress?.emailAddress ??
      "Хэрэглэгч",
    avatarUrl: user.imageUrl,
    memberSince: new Intl.DateTimeFormat("mn-MN", {
      year: "numeric",
      month: "long",
    }).format(user.createdAt ?? new Date()),
    followingCount: MOCK_FOLLOWED.length,
    purchasesCount: 0,
    savedShowsCount: 0,
  }

  return (
    <main className="mx-auto max-w-[1440px] px-10 pt-8 pb-10">
      <ProfileCard user={profile} />

      {!isSeller && (
        <div className="mt-4 flex items-center justify-between rounded-xl border bg-card p-4">
          <div>
            <p className="font-medium">Худалдагч болох</p>
            <p className="text-sm text-muted-foreground">
              Шоу хийж бараагаа зараарай
            </p>
          </div>
          <Button size="sm" onClick={() => router.push("/sell")}>
            Эхлэх
          </Button>
        </div>
      )}

      <div className="mt-8">
        <ProfileTabs
          active={tab}
          counts={{
            following: profile.followingCount,
            purchases: profile.purchasesCount,
            saved: profile.savedShowsCount,
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
          {tab === "settings" && <ProfileSettings />}
        </div>
      </div>
    </main>
  )
}
