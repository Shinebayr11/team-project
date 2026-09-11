"use client"

import React from "react"
import {
  Package,
  Heart,
  Users,
  Settings,
  MapPin,
  Wallet,
  LogOut,
} from "lucide-react"
import { useClerk } from "@clerk/nextjs"
import { Link } from "@/lib/router"
import { useDisplayName } from "@/hooks/useDisplayName"

export type ProfileTab =
  | "overview"
  | "purchases"
  | "saved"
  | "following"
  | "settings"
  | "addresses"

interface ProfileSidebarProps {
  activeTab: string
  /** Бүртгэл дээр хадгалагдсан профайл зураг. Байхгүй бол нэрний эхний үсэг. */
  avatarUrl?: string
  onSelect: (tab: ProfileTab) => void
  onEditProfile: () => void
}

/**
 * Таб солих (`id`) эсвэл өөр маршрут руу үсрэх (`href`) гэсэн хоёр төрөл.
 * Хэтэвч нь Topbar дээр `hidden sm:flex` тул гар утсан дээр ЗӨВХӨН эндүүр
 * хүрэх боломжтой — цэснээс хасах юм бол утсаар данс цэнэглэх зам үлдэхгүй.
 */
type NavItem =
  | { label: string; icon: React.ElementType; id: ProfileTab; href?: never }
  | { label: string; icon: React.ElementType; href: string; id?: never }

const NAV_GROUPS: { section: string; items: NavItem[] }[] = [
  {
    section: "Худалдан авалт",
    items: [
      { id: "overview", label: "Ерөнхий тойм", icon: Package },
      { id: "purchases", label: "Худалдан авалт", icon: Package },
      { id: "saved", label: "Хадгалсан", icon: Heart },
      { id: "following", label: "Дагаж буй", icon: Users },
    ],
  },
  {
    section: "Бүртгэл",
    items: [
      { id: "settings", label: "Тохиргоо", icon: Settings },
      { href: "/wallet", label: "Хэтэвч цэнэглэх", icon: Wallet },
      { id: "addresses", label: "Хүргэлтийн хаяг", icon: MapPin },
    ],
  },
]

const itemClass = (active: boolean) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-[600] transition-colors ${
    active
      ? "bg-[var(--wn-surface-2)] text-[var(--wn-ink)]"
      : "text-[var(--wn-ink-2)] hover:bg-[var(--wn-accent-wash)]"
  }`

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  avatarUrl,
  onSelect,
  onEditProfile,
}) => {
  const { signOut } = useClerk()
  const { displayName, handle, initial } = useDisplayName()

  return (
    <aside className="flex w-full flex-col gap-8 lg:w-[240px] lg:shrink-0">
      <div className="flex flex-col items-center text-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="mb-4 size-24 rounded-full object-cover"
          />
        ) : (
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#E6E6EE] text-[32px] font-[700] text-[var(--wn-ink)] uppercase">
            {initial}
          </div>
        )}
        <h1 className="text-[20px] leading-tight font-[800] text-[var(--wn-ink)]">
          {displayName}
        </h1>
        <div className="mb-4 text-[14px] font-[500] text-[var(--wn-ink-3)]">
          {handle && `@${handle}`}
        </div>
        <button
          onClick={onEditProfile}
          className="w-full rounded-full border border-[var(--wn-line-2)] py-2 text-[13px] font-[700] text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-accent-wash)]"
        >
          Профайл засах
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.section}>
            <div className="mb-2 px-3 text-[11px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase">
              {group.section}
            </div>
            <nav className="flex flex-col gap-1">
              {group.items.map((item) =>
                item.id === undefined ? (
                  <Link key={item.href} to={item.href} className={itemClass(false)}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={itemClass(activeTab === item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              )}
            </nav>
          </div>
        ))}

        <div className="border-t border-[var(--wn-line)] pt-4">
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-[600] text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Гарах
          </button>
        </div>
      </div>
    </aside>
  )
}
