"use client"

import * as React from "react"
import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton"
import { useUser } from "@clerk/nextjs"

import { ProfileImagesCard } from "@/components/settings/ProfileImagesCard"
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
  const { phase, fieldErrors, footerError, clearFieldError, submit } =
    useSettingsSave(save)

  const email = user?.primaryEmailAddress?.emailAddress
  const phone = user?.primaryPhoneNumber?.phoneNumber

  const [name, setName] = React.useState(displayName)
  const [bio, setBio] = React.useState(account.bio ?? "")

  const trimmedName = name.trim()
  const trimmedBio = bio.trim()
  const nameValid = trimmedName.length >= 2 && trimmedName.length <= 40
  const dirty =
    trimmedName !== displayName || trimmedBio !== (account.bio ?? "")
  const canSubmit = phase !== "saving" && dirty && nameValid

  const handleSubmit = async () => {
    if (!canSubmit) return
    await submit({ display_name: trimmedName, bio: trimmedBio })
    // Mongo амжилттай бол Clerk-ийг зэрэгцүүлнэ. Энэ нь амжилтгүй болбол нэр
    // бусдад шинэчлэгдсэн ч өөрийн дэлгэц дээр хуучнаараа үлдэнэ.
    if (user && trimmedName !== displayName) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            [DISPLAY_NAME_KEY]: trimmedName,
          },
        })
      } catch (error) {
        console.error("Clerk дээрх нэр шинэчлэгдсэнгүй:", error)
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Дэлгүүрийн хуудасны толгойд яг эдгээр зураг гарна. */}
      <ProfileImagesCard
        name={displayName}
        avatarUrl={account.avatar_url}
        coverUrl={account.cover_url}
        save={save}
      />

      <div className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
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
            <p className="mt-1 text-[13px] font-[600] text-[var(--wn-admin-danger)]">
              {fieldErrors.display_name}
            </p>
          ) : (
            <p className="mt-1 text-[13px] text-[var(--wn-admin-muted)]">
              2–40 тэмдэгт.
            </p>
          )}
        </div>

        <div>
          {/* Утсаар бүртгүүлсэн хэрэглэгчид и-мэйл байхгүй байж болно. */}
          <Field label={email ? "И-мэйл хаяг" : "Утасны дугаар"}>
            <input
              value={email ?? phone ?? ""}
              readOnly
              className="h-10 w-full rounded-lg border border-[var(--wn-ink-4)] bg-[var(--wn-admin-row-rule)] px-3 text-[14px] font-[500] text-[var(--wn-admin-muted)] outline-none"
            />
          </Field>
          <p className="mt-1 text-[13px] text-[var(--wn-admin-muted)]">
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
              className="w-full resize-none rounded-lg border border-[var(--wn-ink-4)] p-3 text-[14px] font-[500] text-black outline-none focus:border-black"
            />
          </Field>
          {fieldErrors.bio ? (
            <p className="mt-1 text-[13px] font-[600] text-[var(--wn-admin-danger)]">
              {fieldErrors.bio}
            </p>
          ) : (
            <p className="mt-1 text-[13px] text-[var(--wn-admin-muted)]">
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
    </div>
  )
}

export const AccountProfilePanel: React.FC = () => {
  const { account, loading, save } = useAccount()

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-1 text-[24px] font-[800] text-black">Профайл</h2>
        <p className="text-[14px] font-[500] text-[var(--wn-admin-muted)]">
          Бусад хэрэглэгчид таныг хэрхэн харахыг эндээс тохируулна.
        </p>
      </div>

      {loading ? (
        <SkeletonScreen className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-10 w-32 rounded-lg" />
        </SkeletonScreen>
      ) : account ? (
        <ProfileForm account={account} save={save} />
      ) : (
        <p className="text-[14px] font-[600] text-[var(--wn-admin-danger)]">
          Бүртгэлийн мэдээлэл уншиж чадсангүй. Хуудсаа шинэчилнэ үү.
        </p>
      )}
    </div>
  )
}
