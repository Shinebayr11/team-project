"use client"

import * as React from "react"

import { Field } from "@/features/seller-hub/components/FormField"
import { useAccount } from "@/hooks/useAccount"
import type { AccountLanguage, AccountSettings, AccountUpdateBody } from "@/types/account"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSettingsSave } from "./useSettingsSave"

const LANGUAGES: { value: AccountLanguage; label: string }[] = [
  { value: "mn", label: "Монгол" },
  { value: "en", label: "English" },
]

const TIMEZONES = [
  { value: "Asia/Ulaanbaatar", label: "Улаанбаатар (UTC+8)" },
  { value: "Asia/Hovd", label: "Ховд (UTC+7)" },
  { value: "UTC", label: "UTC" },
]

const control =
  "w-full h-10 rounded-lg border border-[var(--wn-ink-4)] px-3 text-[14px] font-[500] text-black outline-none focus:border-black"

const PreferencesForm: React.FC<{
  account: AccountSettings
  save: (body: AccountUpdateBody) => Promise<unknown>
}> = ({ account, save }) => {
  const { phase, footerError, submit } = useSettingsSave(save)

  const [language, setLanguage] = React.useState(account.preferences.language)
  const [timezone, setTimezone] = React.useState(account.preferences.timezone)

  const dirty =
    language !== account.preferences.language || timezone !== account.preferences.timezone
  const canSubmit = phase !== "saving" && dirty

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <Field label="Хэл">
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as AccountLanguage)}
          disabled={phase === "saving"}
          className={control}
        >
          {LANGUAGES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Цагийн бүс">
        <select
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
          disabled={phase === "saving"}
          className={control}
        >
          {TIMEZONES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <SettingsSaveBar
        phase={phase}
        canSubmit={canSubmit}
        footerError={footerError}
        onSubmit={() => canSubmit && submit({ preferences: { language, timezone } })}
      />
    </div>
  )
}

export const PreferencesPanel: React.FC = () => {
  const { account, loading, save } = useAccount()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Тохиргоо</h2>
        <p className="text-[14px] text-gray-500 font-[500]">
          Хэл, цагийн бүсээ энд сонгоно.
        </p>
      </div>

      {loading ? (
        <p className="text-[14px] text-gray-500">Уншиж байна...</p>
      ) : account ? (
        <PreferencesForm account={account} save={save} />
      ) : (
        <p className="text-[14px] font-[600] text-red-600">
          Тохиргоо уншиж чадсангүй. Хуудсаа шинэчилнэ үү.
        </p>
      )}
    </div>
  )
}
