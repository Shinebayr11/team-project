"use client"

import * as React from "react"
import { Check, Store } from "lucide-react"

import { Sheet, SheetBody, SheetFooter, SheetHeader } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Select, type SelectOption } from "@/components/ui/select"
import { ApiError } from "@/lib/api"
import { useApiClient } from "@/hooks/useApiClient"
import { useNavigate } from "@/lib/router"
import { SELLER_HOME } from "@/hooks/useSellerGate"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { slugify, SLUG_MIN, SLUG_PATTERN } from "@/lib/slug"
import {
  ContractSections,
  SellerContractDrawer,
  type ContractDoc,
} from "@/components/seller/SellerContractDrawer"
import {
  PLATFORM_RULES,
  SELLER_CONTRACT,
  SELLER_TERMS_VERSION,
} from "@/components/seller/sellerContract"
import type {
  SellerActivateBody,
  SellerActivateResponse,
  SellerErrorResponse,
  SellerType,
  SlugAvailableResponse,
} from "@/types/seller"

const SELLER_TYPES: ReadonlyArray<SelectOption<SellerType>> = [
  { value: "individual", label: "Хувь хүн" },
  { value: "business", label: "Бизнес" },
]

const CATEGORIES: ReadonlyArray<SelectOption> = [
  { value: "Хувцас", label: "Хувцас" },
  { value: "Гоо сайхан", label: "Гоо сайхан" },
  { value: "Электроник", label: "Электроник" },
  { value: "Цуглуулга", label: "Цуглуулга" },
  { value: "Гэр ахуй", label: "Гэр ахуй" },
  { value: "Бусад", label: "Бусад" },
]

const PHONE_PATTERN = /^(\+?976[\s-]?)?\d{8}$/
const SLUG_DEBOUNCE_MS = 300
const SUCCESS_HOLD_MS = 900

type Phase = "form" | "submitting" | "success"
type SlugState = "idle" | "checking" | "available" | "taken"
type FieldKey = keyof SellerActivateBody

/**
 * Талбарын хайрцаг. `features/seller-hub/components/FormField.tsx`-ийг
 * ЗОРИУДААР дахин ашиглаагүй: тэр нь самбарын саарал өнгө (border-gray-300,
 * text-black, 40px) дээр тулгуурладаг бол энэ хуудас нь дэлгүүрийн `--wn-`
 * өнгө, 44px өндөр дээр байна.
 */
const Field: React.FC<{
  label: string
  htmlFor?: string
  hint?: React.ReactNode
  error?: string
  children: React.ReactNode
}> = ({ label, htmlFor, hint, error, children }) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={htmlFor}
      className="text-[13px] font-[700] text-[var(--wn-ink-2)]"
    >
      {label}
    </label>
    {children}
    {error ? (
      <p className="text-[12.5px] font-[600] text-[var(--wn-live)]">{error}</p>
    ) : (
      hint
    )}
  </div>
)

export interface SellerActivationSheetProps {
  open: boolean
  /** Хаах — query param-ыг цэвэрлэж, юу ч хадгалахгүй. */
  onClose: () => void
  /** Хаагдахад фокус буцаж очих цэсний товч. */
  finalFocus?: React.RefObject<HTMLElement | null>
}

export const SellerActivationSheet: React.FC<SellerActivationSheetProps> = ({
  open,
  onClose,
  finalFocus,
}) => {
  const { callApi } = useApiClient()
  const { setProfile, refresh } = useSellerProfile()
  const navigate = useNavigate()

  const [storeName, setStoreName] = React.useState("")
  const [sellerType, setSellerType] = React.useState<SellerType>("individual")
  const [category, setCategory] = React.useState(CATEGORIES[0].value)
  const [address, setAddress] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [signature, setSignature] = React.useState("")

  const [phase, setPhase] = React.useState<Phase>("form")
  const [errors, setErrors] = React.useState<Partial<Record<FieldKey, string>>>({})
  const [footerError, setFooterError] = React.useState<string | null>(null)
  const [slugState, setSlugState] = React.useState<SlugState>("idle")
  const [doc, setDoc] = React.useState<ContractDoc | null>(null)

  const nameRef = React.useRef<HTMLInputElement>(null)
  const holdTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const trimmedName = storeName.trim()
  const slug = slugify(trimmedName)

  const nameValid = trimmedName.length >= 3 && trimmedName.length <= 30
  const slugValid = slug.length >= SLUG_MIN && SLUG_PATTERN.test(slug)
  const addressValid = address.trim().length >= 5
  const phoneValid = PHONE_PATTERN.test(phone.trim())
  const signatureValid = signature.trim().length >= 2

  // Сонголтууд анхдагч утгатай тул хэзээ ч саад болохгүй.
  const canSubmit =
    phase === "form" &&
    nameValid &&
    slugValid &&
    slugState !== "taken" &&
    addressValid &&
    phoneValid &&
    signatureValid

  React.useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
  }, [])

  // Хаяг давхардсан эсэхийг 300мс хүлээж шалгана.
  React.useEffect(() => {
    if (!open || !nameValid || !slugValid) {
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
        // Шалгаж чадсангүй — илгээх товчийг хаахгүй, сервер эцсийн шийдийг гаргана.
        if (!cancelled) setSlugState("idle")
      }
    }, SLUG_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [open, slug, nameValid, slugValid, callApi])

  const locked = phase !== "form"

  const submit = async () => {
    if (!canSubmit) return

    setPhase("submitting")
    setErrors({})
    setFooterError(null)

    const body: SellerActivateBody = {
      storeName: trimmedName,
      storeSlug: slug,
      sellerType,
      category,
      address: address.trim(),
      phone: phone.trim(),
      signature: signature.trim(),
      termsVersion: SELLER_TERMS_VERSION,
    }

    try {
      const { data } = await callApi<SellerActivateResponse>(
        "/api/seller/activate",
        { method: "POST", body: JSON.stringify(body) }
      )

      // Самбар дахин хаалт үзүүлэхээс сэргийлж, замаа солихоос ӨМНӨ кэшийг
      // шинэчилнэ: эхлээд хариунаас шууд, дараа нь серверээс баталгаажуулна.
      setProfile(data)
      setPhase("success")
      await refresh()

      holdTimer.current = setTimeout(() => navigate(SELLER_HOME), SUCCESS_HOLD_MS)
    } catch (error) {
      setPhase("form")

      if (error instanceof ApiError) {
        const detail = error.body as SellerErrorResponse | null

        if (detail?.fields && Object.keys(detail.fields).length > 0) {
          setErrors(detail.fields)
          // Хаяг завгүй бол нэрний талбар дээр фокусыг үлдээнэ.
          if (detail.fields.storeSlug || detail.fields.storeName) {
            setSlugState("taken")
            nameRef.current?.focus()
          }
          return
        }

        if (error.status === 409) {
          setSlugState("taken")
          setErrors({ storeSlug: "Энэ хаяг завгүй байна. Өөр нэр сонгоно уу." })
          nameRef.current?.focus()
          return
        }
      }

      // Сүлжээ/500 — доод талд мессеж, оруулсан утга бүрэн хэвээр.
      setFooterError(
        error instanceof ApiError && error.status < 500
          ? error.message
          : "Холболт тасарлаа. Оруулсан мэдээлэл хэвээр байна."
      )
    }
  }

  const slugHint = (() => {
    if (!trimmedName) {
      return (
        <p className="text-[12.5px] text-[var(--wn-ink-4)]">
          Дэлгүүрийн нэр 3–30 тэмдэгт.
        </p>
      )
    }
    if (!slugValid) {
      return (
        <p className="text-[12.5px] text-[var(--wn-ink-4)]">
          Латин үсэг эсвэл тоо агуулсан нэр оруулна уу.
        </p>
      )
    }
    return (
      <p className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
        <span className="font-[600] text-[var(--wn-ink-3)]">
          reelshop.mn/@{slug}
        </span>
        {slugState === "checking" && (
          <span className="text-[var(--wn-ink-4)]">шалгаж байна…</span>
        )}
        {slugState === "available" && (
          <span className="font-[700] text-[var(--wn-accent)]">Боломжтой</span>
        )}
        {slugState === "taken" && (
          <span className="font-[700] text-[var(--wn-live)]">Завгүй байна</span>
        )}
      </p>
    )
  })()

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) onClose()
        }}
        finalFocus={finalFocus}
        wide
      >
        {phase === "success" ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[var(--wn-accent-soft)]">
              <Check className="size-7 text-[var(--wn-accent)]" strokeWidth={3} />
            </div>
            <h2 className="mt-5 text-[19px] font-[800] tracking-tight text-[var(--wn-ink)]">
              Дэлгүүр идэвхжлээ
            </h2>
            <p className="mt-1.5 text-[14px] text-[var(--wn-ink-3)]">
              Одоо шууд Лайв хийж эхлээрэй.
            </p>
          </div>
        ) : (
          <>
            <SheetHeader
              title="Худалдагч болох"
              subtitle="Шууд идэвхжинэ. Хүлээх, баталгаажуулах шаардлагагүй."
              icon={
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--wn-accent-soft)]">
                  <Store className="size-5 text-[var(--wn-accent)]" />
                </div>
              }
            />

            <SheetBody className="flex flex-col gap-5">
              <Field
                label="Дэлгүүрийн нэр"
                htmlFor="seller-store-name"
                hint={slugHint}
                error={errors.storeName ?? errors.storeSlug}
              >
                <Input
                  id="seller-store-name"
                  ref={nameRef}
                  value={storeName}
                  onChange={(event) => {
                    setStoreName(event.target.value)
                    setErrors((prev) => ({
                      ...prev,
                      storeName: undefined,
                      storeSlug: undefined,
                    }))
                  }}
                  placeholder="Жишээ: Винтаж Дэлгүүр"
                  maxLength={30}
                  autoComplete="off"
                  disabled={locked}
                  invalid={Boolean(errors.storeName ?? errors.storeSlug)}
                />
              </Field>

              <Field label="Худалдагчийн төрөл" htmlFor="seller-type">
                <Select<SellerType>
                  id="seller-type"
                  value={sellerType}
                  onValueChange={setSellerType}
                  items={SELLER_TYPES}
                  disabled={locked}
                />
              </Field>

              <Field label="Үндсэн ангилал" htmlFor="seller-category">
                <Select
                  id="seller-category"
                  value={category}
                  onValueChange={setCategory}
                  items={CATEGORIES}
                  disabled={locked}
                />
              </Field>

              <Field
                label="Оршин суух хаяг"
                htmlFor="seller-address"
                error={errors.address}
                hint={
                  <p className="text-[12.5px] text-[var(--wn-ink-4)]">
                    Нийтэд харагдахгүй. Зөвхөн захиалга, баримтад ашиглана.
                  </p>
                }
              >
                <Input
                  id="seller-address"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value)
                    setErrors((prev) => ({ ...prev, address: undefined }))
                  }}
                  placeholder="Улаанбаатар, Сүхбаатар дүүрэг, 1-р хороо…"
                  maxLength={200}
                  autoComplete="street-address"
                  disabled={locked}
                  invalid={Boolean(errors.address)}
                />
              </Field>

              <Field
                label="Холбогдох дугаар"
                htmlFor="seller-phone"
                error={errors.phone}
                hint={
                  <p className="text-[12.5px] text-[var(--wn-ink-4)]">
                    8 оронтой дугаар.
                  </p>
                }
              >
                <Input
                  id="seller-phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value)
                    setErrors((prev) => ({ ...prev, phone: undefined }))
                  }}
                  placeholder="99112233"
                  maxLength={20}
                  autoComplete="tel"
                  disabled={locked}
                  invalid={Boolean(errors.phone)}
                />
              </Field>

              {/* Гэрээ — доор нь гарын үсэг зурна. */}
              <div className="flex flex-col gap-3 rounded-2xl border border-[var(--wn-line)] bg-[var(--wn-surface-3)] p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-[800] text-[var(--wn-ink)]">
                    Худалдагчийн гэрээ
                  </h3>
                  <span className="text-[11px] font-[700] text-[var(--wn-ink-4)]">
                    Хувилбар {SELLER_TERMS_VERSION}
                  </span>
                </div>

                <div className="max-h-[180px] overflow-y-auto rounded-xl bg-white p-4">
                  <ContractSections sections={SELLER_CONTRACT} />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <button
                    type="button"
                    onClick={() => setDoc("terms")}
                    className="text-[12.5px] font-[700] text-[var(--wn-accent)] underline underline-offset-2 hover:text-[var(--wn-accent-hover)]"
                  >
                    Гэрээг бүтнээр нь унших
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoc("rules")}
                    className="text-[12.5px] font-[700] text-[var(--wn-accent)] underline underline-offset-2 hover:text-[var(--wn-accent-hover)]"
                  >
                    Платформын дүрэм
                  </button>
                </div>
              </div>

              <Field
                label="Гарын үсэг"
                htmlFor="seller-signature"
                error={errors.signature}
                hint={
                  <p className="text-[12.5px] text-[var(--wn-ink-4)]">
                    Бүтэн нэрээ бичсэнээр дээрх гэрээ болон {PLATFORM_RULES.length}{" "}
                    зүйлт платформын дүрмийг зөвшөөрсөнд тооцно.
                  </p>
                }
              >
                <Input
                  id="seller-signature"
                  value={signature}
                  onChange={(event) => {
                    setSignature(event.target.value)
                    setErrors((prev) => ({ ...prev, signature: undefined }))
                  }}
                  placeholder="Бүтэн нэрээ бичнэ үү"
                  maxLength={60}
                  autoComplete="name"
                  disabled={locked}
                  invalid={Boolean(errors.signature)}
                  className="font-display text-[17px]"
                />
              </Field>
            </SheetBody>

            <SheetFooter>
              {footerError && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--wn-live-soft)] px-3.5 py-2.5">
                  <p className="text-[13px] font-[600] text-[var(--wn-live)]">
                    {footerError}
                  </p>
                  <button
                    type="button"
                    onClick={submit}
                    className="text-[13px] font-[800] text-[var(--wn-live)] underline underline-offset-2"
                  >
                    Дахин оролдох
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className="h-[52px] w-full rounded-xl bg-[var(--wn-accent)] text-[16px] font-[800] text-white transition-colors hover:bg-[var(--wn-accent-hover)] disabled:bg-[var(--wn-ink-4)] disabled:opacity-50"
              >
                {phase === "submitting" ? "Идэвхжиж байна…" : "Идэвхжүүлэх"}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={locked}
                className="h-[44px] w-full rounded-xl text-[15px] font-[700] text-[var(--wn-ink-3)] transition-colors hover:bg-[var(--wn-surface-2)] disabled:opacity-50"
              >
                Дараа
              </button>
            </SheetFooter>
          </>
        )}
      </Sheet>

      <SellerContractDrawer doc={doc} onClose={() => setDoc(null)} />
    </>
  )
}
