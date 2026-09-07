"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "./useApiClient"
import type {
  AccountNotifications,
  AccountPreferences,
  AccountSettings,
  AccountUpdateBody,
  AccountUpdateResponse,
} from "@/types/account"

export const DEFAULT_PREFERENCES: AccountPreferences = {
  language: "mn",
  timezone: "Asia/Ulaanbaatar",
}

export const DEFAULT_NOTIFICATIONS: AccountNotifications = {
  orderUpdates: true,
  showReminders: true,
  bidAlerts: true,
  messages: true,
  promotions: false,
}

/**
 * Бүртгэлийн тохиргоог сервертэй уншиж, бичнэ.
 *
 * Схемд `preferences`/`notifications` нэмэгдэхээс өмнө үүссэн хэрэглэгчдийн
 * баримтад тэдгээр талбар байхгүй — mongoose-ийн default нь зөвхөн шинэ баримтад
 * тавигддаг тул уншсаны дараа энд нөхөж өгнө.
 */
export function useAccount() {
  const { callApi } = useApiClient()
  const { isLoaded, isSignedIn } = useUser()
  const [account, setAccount] = useState<AccountSettings | null>(null)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    callApi<{ data: AccountSettings }>("/api/users/me")
      .then(({ data }) => {
        if (cancelled) return
        setAccount({
          ...data,
          preferences: { ...DEFAULT_PREFERENCES, ...data.preferences },
          notifications: { ...DEFAULT_NOTIFICATIONS, ...data.notifications },
        })
      })
      .catch((error) => {
        console.error("Бүртгэлийн тохиргоо уншиж чадсангүй:", error)
      })
      .finally(() => {
        if (!cancelled) setSettled(true)
      })

    return () => {
      cancelled = true
    }
  }, [callApi, isLoaded, isSignedIn])

  const loading = !isLoaded || (isSignedIn === true && !settled)

  /** Ирсэн хэсгийг нь л явуулна. Алдаа гарвал `ApiError` шиднэ. */
  const save = useCallback(
    async (body: AccountUpdateBody): Promise<AccountSettings> => {
      const { data } = await callApi<AccountUpdateResponse>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      })
      const merged: AccountSettings = {
        ...data,
        preferences: { ...DEFAULT_PREFERENCES, ...data.preferences },
        notifications: { ...DEFAULT_NOTIFICATIONS, ...data.notifications },
      }
      setAccount(merged)
      return merged
    },
    [callApi]
  )

  return { account, loading, save }
}
