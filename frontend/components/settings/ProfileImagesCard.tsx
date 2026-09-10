"use client"

import * as React from "react"
import { Camera, Loader2, X } from "lucide-react"

import { Avatar } from "@/components/ui/Avatar"
import { uploadFile } from "@/lib/upload"
import type { AccountUpdateBody } from "@/types/account"

type Slot = "avatar_url" | "cover_url"

interface ProfileImagesCardProps {
  name: string
  avatarUrl?: string
  coverUrl?: string
  /** Байршуулсны дараа шууд хадгална — тусдаа «Хадгалах» товч байхгүй. */
  save: (body: AccountUpdateBody) => Promise<unknown>
}

const HINT = "JPG, PNG, WEBP, GIF · 4MB хүртэл"

/**
 * Профайл ба ковер зураг.
 *
 * Хоёулаа хэрэглэгчийн НЭГ бүртгэл дээр сууна: `/profile` дээр өөрийнх нь
 * хуудсанд, `/shop` дээр дэлгүүрийн толгойд яг эдгээр зураг гарна. Тиймээс
 * худалдагчийн самбар, худалдан авагчийн тохиргоо хоёр ижил хэсгийг дуудна.
 *
 * Зураг Vercel Blob руу шууд хөтчөөс очиж, зөвхөн хаяг нь хадгалагдана
 * (`lib/upload.ts`).
 */
export const ProfileImagesCard: React.FC<ProfileImagesCardProps> = ({
  name,
  avatarUrl,
  coverUrl,
  save,
}) => {
  const coverInput = React.useRef<HTMLInputElement>(null)
  const avatarInput = React.useRef<HTMLInputElement>(null)
  const [busy, setBusy] = React.useState<Slot | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const put = async (slot: Slot, url: string) => {
    setBusy(slot)
    setError(null)
    try {
      await save({ [slot]: url })
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Хадгалж чадсангүй"
      )
    } finally {
      setBusy(null)
    }
  }

  const pick = async (slot: Slot, files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    setBusy(slot)
    setError(null)
    try {
      const url = await uploadFile(file)
      await save({ [slot]: url })
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Зураг байршуулж чадсангүй"
      )
    } finally {
      setBusy(null)
      // Ижил файлыг дахин сонгоход өөрчлөлт бүртгэгдэхийн тулд цэвэрлэнэ.
      const input = slot === "cover_url" ? coverInput : avatarInput
      if (input.current) input.current.value = ""
    }
  }

  const iconBtn =
    "flex size-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md transition-colors hover:bg-black/75 disabled:opacity-60"

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--wn-line)] bg-white">
      {/* Ковер — `/shop` дээрх толгойтой ижил харьцаатай тул худалдагч энд
          сонгосон зургаа дэлгүүрийн хуудсанд яг ингэж харна. */}
      <div className="relative h-[140px] w-full bg-gradient-to-br from-[var(--wn-accent-soft)] to-[var(--wn-surface-3)]">
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => coverInput.current?.click()}
            disabled={!!busy}
            aria-label="Ковер зураг солих"
            className={iconBtn}
          >
            {busy === "cover_url" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4" />
            )}
          </button>
          {coverUrl && (
            <button
              type="button"
              onClick={() => put("cover_url", "")}
              disabled={!!busy}
              aria-label="Ковер зураг хасах"
              className={iconBtn}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 px-5 pb-5">
        <div className="relative -mt-10 shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="size-20 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="rounded-full border-4 border-white">
              <Avatar name={name} size={72} tint="var(--wn-accent-soft)" />
            </div>
          )}

          <button
            type="button"
            onClick={() => avatarInput.current?.click()}
            disabled={!!busy}
            aria-label="Профайл зураг солих"
            className={`${iconBtn} absolute right-0 bottom-0`}
          >
            {busy === "avatar_url" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4" />
            )}
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 pb-1">
          <p className="text-[13px] font-[700] text-[var(--wn-ink-2)]">
            Профайл ба ковер зураг
          </p>
          <p className="text-[13px] font-[500] text-[var(--wn-ink-3)]">
            {HINT}
          </p>
          {avatarUrl && (
            <button
              type="button"
              onClick={() => put("avatar_url", "")}
              disabled={!!busy}
              className="self-start text-[13px] font-[700] text-[var(--wn-ink-3)] underline underline-offset-2 hover:text-[var(--wn-ink)]"
            >
              Профайл зургаа хасах
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="px-5 pb-4 text-[13px] font-[600] text-[var(--wn-live-deep)]">
          {error}
        </p>
      )}

      <input
        ref={coverInput}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => pick("cover_url", event.target.files)}
      />
      <input
        ref={avatarInput}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => pick("avatar_url", event.target.files)}
      />
    </div>
  )
}
