"use client"

import * as React from "react"
import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton"

import { useAccount } from "@/hooks/useAccount"
import type {
  AccountNotifications,
  AccountSettings,
  AccountUpdateBody,
} from "@/types/account"
import { Toggle } from "@/features/seller-hub/components/Toggle"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSettingsSave } from "./useSettingsSave"

const TOPICS: { key: keyof AccountNotifications; label: string; description: string }[] = [
  {
    key: "orderUpdates",
    label: "Захиалгын шинэчлэл",
    description: "Захиалга баталгаажих, илгээгдэх, хүргэгдэх үед.",
  },
  {
    key: "showReminders",
    label: "Шууд дамжуулалтын сануулга",
    description: "Дагасан худалдагч шууд эфирт гарах гэж байгаа үед.",
  },
  {
    key: "bidAlerts",
    label: "Үнийн саналын мэдэгдэл",
    description: "Таны саналыг давсан эсвэл дуудлага худалдаа дуусах үед.",
  },
  {
    key: "messages",
    label: "Шинэ зурвас",
    description: "Худалдагч эсвэл худалдан авагч зурвас бичихэд.",
  },
  {
    key: "promotions",
    label: "Урамшуулал, мэдээ",
    description: "Шинэ боломж, хямдралын мэдээлэл.",
  },
]

const NotificationsForm: React.FC<{
  account: AccountSettings
  save: (body: AccountUpdateBody) => Promise<unknown>
}> = ({ account, save }) => {
  const { phase, footerError, submit } = useSettingsSave(save)
  const [topics, setTopics] = React.useState(account.notifications)

  const dirty = TOPICS.some(({ key }) => topics[key] !== account.notifications[key])
  const canSubmit = phase !== "saving" && dirty

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
      {TOPICS.map(({ key, label, description }) => (
        <div key={key} className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[14px] font-[700] text-black">{label}</div>
            <div className="mt-0.5 text-[13px] leading-tight text-[var(--wn-admin-muted)]">
              {description}
            </div>
          </div>
          <Toggle
            checked={topics[key]}
            disabled={phase === "saving"}
            label={label}
            onChange={() => setTopics({ ...topics, [key]: !topics[key] })}
          />
        </div>
      ))}

      <SettingsSaveBar
        phase={phase}
        canSubmit={canSubmit}
        footerError={footerError}
        onSubmit={() => canSubmit && submit({ notifications: topics })}
      />
    </div>
  )
}

export const NotificationsPanel: React.FC = () => {
  const { account, loading, save } = useAccount()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Мэдэгдэл</h2>
        <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500]">
          Ямар үед мэдэгдэл авахаа сонгоно уу.
        </p>
      </div>

      {loading ? (
        <SkeletonScreen className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-32 rounded-lg" />
        </SkeletonScreen>
      ) : account ? (
        <NotificationsForm account={account} save={save} />
      ) : (
        <p className="text-[14px] font-[600] text-[var(--wn-admin-danger)]">
          Мэдэгдлийн тохиргоо уншиж чадсангүй. Хуудсаа шинэчилнэ үү.
        </p>
      )}
    </div>
  )
}
