"use client"

import * as React from "react"

import { CONTROL, Field, TextField, SelectField } from "@/features/seller-hub/components/FormField"
import { ApiError } from "@/lib/api"
import { useApiClient } from "@/hooks/useApiClient"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { slugify, SLUG_MIN, SLUG_PATTERN } from "@/lib/slug"
import {
  CATEGORIES,
  PHONE_PATTERN,
  SELLER_TYPES,
} from "@/components/seller/SellerActivationSheet"
import type {
  SellerErrorResponse,
  SellerType,
  SellerUpdateBody,
  SellerUpdateResponse,
  SlugAvailableResponse,
} from "@/types/seller"
import { btn } from "@/features/seller-hub/components/buttons"

const SLUG_DEBOUNCE_MS = 300
const SAVED_HOLD_MS = 1800

type Phase = "idle" | "saving" | "saved"
type SlugState = "idle" | "checking" | "available" | "taken"
type FieldKey = keyof SellerUpdateBody

const typeLabelOf = (value: SellerType) =>
  SELLER_TYPES.find((t) => t.value === value)?.label ?? SELLER_TYPES[0].label
const typeValueOf = (label: string): SellerType =>
  SELLER_TYPES.find((t) => t.label === label)?.value ?? "individual"

/**
 * Дэлгүүрийн идэвхтэй мэдээллийг засварлана — идэвхжүүлэлтийн үед асуусан
 * нэр, төрөл, ангилал, хаяг, утсыг л дахин авна. Гарын үсэг, гэрээ нэг
 * удаагийн зөвшөөрөл тул энд байхгүй.
 */
export const ShopInformationPanel: React.FC = () => {
  const { callApi } = useApiClient()
  const { profile, setProfile } = useSellerProfile()

  const [storeName, setStoreName] = React.useState(profile?.storeName ?? "")
  const [sellerTypeLabel, setSellerTypeLabel] = React.useState(
    typeLabelOf(profile?.sellerType ?? "individual")
  )
  const [category, setCategory] = React.useState(
    profile?.category ?? CATEGORIES[0].value
  )
  const [address, setAddress] = React.useState(profile?.address ?? "")
  const [phone, setPhone] = React.useState(profile?.phone ?? "")

  const [phase, setPhase] = React.useState<Phase>("idle")
  const [errors, setErrors] = React.useState<Partial<Record<FieldKey, string>>>({})
  const [footerError, setFooterError] = React.useState<string | null>(null)
  const [slugState, setSlugState] = React.useState<SlugState>("idle")

  const holdTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
  }, [])

  const trimmedName = storeName.trim()
  const slug = slugify(trimmedName)

  const nameHasLetter = /\p{L}/u.test(trimmedName)
  const nameValid =
    trimmedName.length >= 3 && trimmedName.length <= 30 && nameHasLetter
  const slugValid = slug.length >= SLUG_MIN && SLUG_PATTERN.test(slug)
  const addressValid = address.trim().length >= 5
  const phoneValid = PHONE_PATTERN.test(phone.trim())

  const ownSlug = profile?.storeSlug === slug
  const dirty =
    !!profile &&
    (trimmedName !== profile.storeName ||
      typeValueOf(sellerTypeLabel) !== profile.sellerType ||
      category !== profile.category ||
      address.trim() !== profile.address ||
      phone.trim() !== profile.phone)

  const canSubmit =
    phase !== "saving" &&
    dirty &&
    nameValid &&
    slugValid &&
    slugState !== "taken" &&
    addressValid &&
    phoneValid

  // Хаяг өөрчлөгдвөл давхардсан эсэхийг 300мс хүлээж шалгана — өөрийн одоогийн
  // хаягтай таарч байвал давхардал биш тул шалгах шаардлагагүй.
  React.useEffect(() => {
    if (!nameValid || !slugValid || ownSlug) {
      setSlugState("idle")
      return
    }

    let cancelled = false
    setSlugState("checking")

    const timer = setTimeout(async () => {
      try {
        const { available } = await callApi<SlugAvailableResponse>(
          `/api/seller/slug-available?slug=${encodeURIComponent(slug)}`
        )
        if (!cancelled) setSlugState(available ? "available" : "taken")
      } catch {
        if (!cancelled) setSlugState("idle")
      }
    }, SLUG_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [slug, nameValid, slugValid, ownSlug, callApi])

  // Профайл ирээгүй үед hook-ууд дуудагдсаны ДАРАА л гарна — эс тэгвээс
  // профайл ирэхэд render бүрийн hook тоо өөрчлөгдөж React унана.
  if (!profile) return null

  const submit = async () => {
    if (!canSubmit) return

    setPhase("saving")
    setErrors({})
    setFooterError(null)

    const body: SellerUpdateBody = {
      storeName: trimmedName,
      storeSlug: slug,
      sellerType: typeValueOf(sellerTypeLabel),
      category,
      address: address.trim(),
      phone: phone.trim(),
    }

    try {
      const { data } = await callApi<SellerUpdateResponse>("/api/seller/profile", {
        method: "PATCH",
        body: JSON.stringify(body),
      })

      setProfile(data)
      setPhase("saved")
      holdTimer.current = setTimeout(() => setPhase("idle"), SAVED_HOLD_MS)
    } catch (error) {
      setPhase("idle")

      if (error instanceof ApiError) {
        const detail = error.body as SellerErrorResponse | null

        if (detail?.fields && Object.keys(detail.fields).length > 0) {
          setErrors(detail.fields)
          if (detail.fields.storeSlug || detail.fields.storeName) {
            setSlugState("taken")
          }
          return
        }

        if (error.status === 409) {
          setSlugState("taken")
          setErrors({ storeSlug: "Энэ нэр аль хэдийн ашиглагдсан байна. Өөр нэр сонгоно уу." })
          return
        }
      }

      setFooterError(
        error instanceof ApiError && error.status < 500
          ? error.message
          : "Холболт тасарлаа. Дахин оролдоно уу."
      )
    }
  }

  const nameHint = (() => {
    if (!trimmedName) {
      return <p className="text-[13px] text-[var(--wn-admin-muted)]">Дэлгүүрийн нэр 3–30 тэмдэгт.</p>
    }
    if (!nameHasLetter) {
      return (
        <p className="text-[13px] font-[600] text-[var(--wn-admin-danger)]">
          Зөвхөн тооноос бус, ядаж нэг үсэг агуулсан нэр оруулна уу.
        </p>
      )
    }
    if (!slugValid) {
      return (
        <p className="text-[13px] text-[var(--wn-admin-muted)]">
          Латин үсэг эсвэл тоо агуулсан нэр оруулна уу.
        </p>
      )
    }
    return (
      <p className="flex flex-wrap items-center gap-1.5 text-[13px]">
        <span className="font-[600] text-[var(--wn-admin-muted)]">whynot.mn/@{slug}</span>
        {slugState === "checking" && <span className="text-[var(--wn-admin-muted)]">шалгаж байна…</span>}
        {slugState === "available" && (
          <span className="font-[700] text-[var(--wn-admin-ok)]">Боломжтой</span>
        )}
        {slugState === "taken" && (
          <span className="font-[700] text-[var(--wn-admin-danger)]">Ашиглагдсан</span>
        )}
      </p>
    )
  })()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Дэлгүүрийн мэдээлэл</h2>
        <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500]">
          Дэлгүүрийнхээ нэр, төрөл, хаягийг энд засварлана.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
        <div>
          <Field label="Дэлгүүрийн нэр">
            <input
              value={storeName}
              onChange={(event) => {
                setStoreName(event.target.value)
                setErrors((prev) => ({ ...prev, storeName: undefined, storeSlug: undefined }))
              }}
              maxLength={30}
              autoComplete="off"
              disabled={phase === "saving"}
              className={CONTROL}
            />
          </Field>
          {(errors.storeName ?? errors.storeSlug) ? (
            <p className="mt-1 text-[13px] font-[600] text-[var(--wn-admin-danger)]">
              {errors.storeName ?? errors.storeSlug}
            </p>
          ) : (
            <div className="mt-1">{nameHint}</div>
          )}
        </div>

        <SelectField
          label="Худалдагчийн төрөл"
          options={SELLER_TYPES.map((t) => t.label)}
          value={sellerTypeLabel}
          onChange={(event) => setSellerTypeLabel(event.target.value)}
          disabled={phase === "saving"}
        />

        <SelectField
          label="Үндсэн ангилал"
          options={CATEGORIES.map((c) => c.value)}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          disabled={phase === "saving"}
        />

        <div>
          <TextField
            label="Оршин суух хаяг"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value)
              setErrors((prev) => ({ ...prev, address: undefined }))
            }}
            maxLength={200}
            autoComplete="street-address"
            disabled={phase === "saving"}
          />
          {errors.address && (
            <p className="mt-1 text-[13px] font-[600] text-[var(--wn-admin-danger)]">{errors.address}</p>
          )}
        </div>

        <div>
          <TextField
            label="Холбогдох дугаар"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value)
              setErrors((prev) => ({ ...prev, phone: undefined }))
            }}
            maxLength={20}
            autoComplete="tel"
            disabled={phase === "saving"}
          />
          {errors.phone && (
            <p className="mt-1 text-[13px] font-[600] text-[var(--wn-admin-danger)]">{errors.phone}</p>
          )}
        </div>

        {footerError && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--wn-admin-danger-soft)] px-3.5 py-2.5">
            <p className="text-[13px] font-[600] text-[var(--wn-admin-danger)]">{footerError}</p>
            <button
              type="button"
              onClick={submit}
              className="text-[13px] font-[800] text-[var(--wn-admin-danger)] underline underline-offset-2"
            >
              Дахин оролдох
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={btn("ink", "field")}
          >
            {phase === "saving" ? "Хадгалж байна…" : "Хадгалах"}
          </button>
          {phase === "saved" && (
            <span className="text-[13px] font-[700] text-[var(--wn-admin-ok)]">Хадгалагдлаа</span>
          )}
        </div>
      </div>
    </div>
  )
}
