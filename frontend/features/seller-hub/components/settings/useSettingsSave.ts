"use client"

import * as React from "react"

import { ApiError } from "@/lib/api"

const SAVED_HOLD_MS = 1800

type Phase = "idle" | "saving" | "saved"

/**
 * Тохиргооны панелуудын хадгалах урсгал: явж буй төлөв, талбарын алдаа, доод
 * талын алдааны мөр. Бүртгэлийн ч, худалдагчийн ч панелууд ижилхэн ажилладаг
 * тул нэг л газар байна — `TBody` нь тухайн панелийн явуулах биеийг заана.
 */
export function useSettingsSave<TBody extends object>(save: (body: TBody) => Promise<unknown>) {
  type FieldKey = keyof TBody
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<FieldKey, string>>>({})
  const [footerError, setFooterError] = React.useState<string | null>(null)
  const holdTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
  }, [])

  const clearFieldError = React.useCallback((key: FieldKey) => {
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [])

  const submit = React.useCallback(
    async (body: TBody) => {
      setPhase("saving")
      setFieldErrors({})
      setFooterError(null)

      try {
        await save(body)
        setPhase("saved")
        holdTimer.current = setTimeout(() => setPhase("idle"), SAVED_HOLD_MS)
      } catch (error) {
        setPhase("idle")

        if (error instanceof ApiError) {
          const detail = error.body as { fields?: Partial<Record<FieldKey, string>> } | null
          if (detail?.fields && Object.keys(detail.fields).length > 0) {
            setFieldErrors(detail.fields)
            return
          }
        }

        setFooterError(
          error instanceof ApiError && error.status < 500
            ? error.message
            : "Холболт тасарлаа. Дахин оролдоно уу."
        )
      }
    },
    [save]
  )

  return { phase, fieldErrors, footerError, clearFieldError, submit }
}
