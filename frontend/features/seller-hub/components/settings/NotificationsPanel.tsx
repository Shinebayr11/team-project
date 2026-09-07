"use client"

import * as React from "react"

import { useAccount } from "@/hooks/useAccount"
import type {
  AccountNotifications,
  AccountSettings,
  AccountUpdateBody,
} from "@/types/account"
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
    label: "Шоуны сануулга",
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

const Toggle: React.FC<{
  checked: boolean
  disabled: boolean
  label: string
  onChange: () => void
}> = ({ checked, disabled, label, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    role="switch"
    aria-checked={checked}
    aria-label={label}
    className={`relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
      checked ? "bg-[#34C759]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all ${
        checked ? "right-1" : "left-1"
      }`}
    />
  </button>
)

const NotificationsForm: React.FC<{
  account: AccountSettings
  save: (body: AccountUpdateBody) => Promise<unknown>
}> = ({ account, save }) => {
  const { phase, footerError, submit } = useSettingsSave(save)
  const [topics, setTopics] = React.useState(account.notifications)

  const dirty = TOPICS.some(({ key }) => topics[key] !== account.notifications[key])
  const canSubmit = phase !== "saving" && dirty

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {TOPICS.map(({ key, label, description }) => (
        <div key={key} className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[14px] font-[700] text-black">{label}</div>
            <div className="mt-0.5 text-[12.5px] leading-tight text-gray-500">
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
        <p className="text-[14px] text-gray-500 font-[500]">
          Ямар үед мэдэгдэл авахаа сонгоно уу.
        </p>
      </div>

      {loading ? (
        <p className="text-[14px] text-gray-500">Уншиж байна...</p>
      ) : account ? (
        <NotificationsForm account={account} save={save} />
      ) : (
        <p className="text-[14px] font-[600] text-red-600">
          Мэдэгдлийн тохиргоо уншиж чадсангүй. Хуудсаа шинэчилнэ үү.
        </p>
      )}
    </div>
  )
}
