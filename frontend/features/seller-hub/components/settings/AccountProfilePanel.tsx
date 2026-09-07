"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"

import { Field, TextField } from "@/features/seller-hub/components/FormField"
import { useAccount } from "@/hooks/useAccount"
import { DISPLAY_NAME_KEY, useDisplayName } from "@/hooks/useDisplayName"
import type { AccountSettings, AccountUpdateBody } from "@/types/account"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSettingsSave } from "./useSettingsSave"

const BIO_MAX = 300

interface ProfileFormProps {
  account: AccountSettings
  save: (body: AccountUpdateBody) => Promise<unknown>
}

/**
 * Хэрэглэгчийн үндсэн мэдээлэл. Нэр нь ХОЁР газар очно: Clerk-ийн metadata
 * (`useDisplayName` бүх дэлгэц дээр эндээс уншина) болон Mongo-гийн
 * `display_name` (бусад хэрэглэгч таныг эндээс харна) — нэг нь дутвал нэр
 * зөвхөн өөрт эсвэл зөвхөн бусдад шинэчлэгдэнэ.
 */
const ProfileForm: React.FC<ProfileFormProps> = ({ account, save }) => {
  const { user } = useUser()
  const { displayName } = useDisplayName()
  const { phase, fieldErrors, footerError, clearFieldError, submit } = useSettingsSave(save)

  const email = user?.primaryEmailAddress?.emailAddress
  const phone = user?.primaryPhoneNumber?.phoneNumber

  const [name, setName] = React.useState(displayName)
  const [bio, setBio] = React.useState(account.bio ?? "")

  const trimmedName = name.trim()
  const trimmedBio = bio.trim()
  const nameValid = trimmedName.length >= 2 && trimmedName.length <= 40
  const dirty = trimmedName !== displayName || trimmedBio !== (account.bio ?? "")
  const canSubmit = phase !== "saving" && dirty && nameValid

  const handleSubmit = async () => {
    if (!canSubmit) return
    await submit({ display_name: trimmedName, bio: trimmedBio })
    // Mongo амжилттай бол Clerk-ийг зэрэгцүүлнэ. Энэ нь амжилтгүй болбол нэр
    // бусдад шинэчлэгдсэн ч өөрийн дэлгэц дээр хуучнаараа үлдэнэ.
    if (user && trimmedName !== displayName) {
      try {
        await user.update({
          unsafeMetadata: { ...user.unsafeMetadata, [DISPLAY_NAME_KEY]: trimmedName },
        })
      } catch (error) {
        console.error("Clerk дээрх нэр шинэчлэгдсэнгүй:", error)
      }
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <TextField
          label="Харагдах нэр"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            clearFieldError("display_name")
          }}
          maxLength={40}
          autoComplete="name"
          disabled={phase === "saving"}
        />
        {fieldErrors.display_name ? (
          <p className="mt-1 text-[12.5px] font-[600] text-red-600">
            {fieldErrors.display_name}
          </p>
        ) : (
          <p className="mt-1 text-[12.5px] text-gray-500">2–40 тэмдэгт.</p>
        )}
      </div>

      <div>
        {/* Утсаар бүртгүүлсэн хэрэглэгчид и-мэйл байхгүй байж болно. */}
        <Field label={email ? "И-мэйл хаяг" : "Утасны дугаар"}>
          <input
            value={email ?? phone ?? ""}
            readOnly
            className="w-full h-10 rounded-lg border border-[var(--wn-ink-4)] bg-gray-50 px-3 text-[14px] font-[500] text-gray-500 outline-none"
          />
        </Field>
        <p className="mt-1 text-[12.5px] text-gray-500">
          Нэвтрэх мэдээллээ “Аюулгүй байдал” хэсгээс солино.
        </p>
      </div>

      <div>
        <Field label="Товч танилцуулга">
          <textarea
            value={bio}
            onChange={(event) => {
              setBio(event.target.value)
              clearFieldError("bio")
            }}
            rows={4}
            maxLength={BIO_MAX}
            disabled={phase === "saving"}
            className="w-full rounded-lg border border-[var(--wn-ink-4)] p-3 text-[14px] font-[500] text-black outline-none focus:border-black resize-none"
          />
        </Field>
        {fieldErrors.bio ? (
          <p className="mt-1 text-[12.5px] font-[600] text-red-600">{fieldErrors.bio}</p>
        ) : (
          <p className="mt-1 text-[12.5px] text-gray-500">
            {trimmedBio.length}/{BIO_MAX} тэмдэгт.
          </p>
        )}
      </div>

      <SettingsSaveBar
        phase={phase}
        canSubmit={canSubmit}
        footerError={footerError}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export const AccountProfilePanel: React.FC = () => {
  const { account, loading, save } = useAccount()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Профайл</h2>
        <p className="text-[14px] text-gray-500 font-[500]">
          Бусад хэрэглэгчид таныг хэрхэн харахыг эндээс тохируулна.
        </p>
      </div>

      {loading ? (
        <p className="text-[14px] text-gray-500">Уншиж байна...</p>
      ) : account ? (
        <ProfileForm account={account} save={save} />
      ) : (
        <p className="text-[14px] font-[600] text-red-600">
          Бүртгэлийн мэдээлэл уншиж чадсангүй. Хуудсаа шинэчилнэ үү.
        </p>
      )}
    </div>
  )
}
