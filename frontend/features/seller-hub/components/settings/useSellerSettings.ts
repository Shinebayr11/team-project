"use client"

import * as React from "react"

import { useApiClient } from "@/hooks/useApiClient"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { settingsOf } from "@/features/seller-hub/sellerSettings"
import type { SellerSettingsBody, SellerSettingsResponse } from "@/types/seller"

/**
 * Худалдагчийн тохиргоо. Профайлын кэш дээр л амьдардаг тул хадгалсны дараа
 * түүнийг шинэчилнэ — тохиргоог хэрэглэдэг маягтууд (шинэ бараа, хүргэлт) шууд
 * шинэ утгаа авна.
 */
export function useSellerSettings() {
  const { callApi } = useApiClient()
  const { profile, setProfile } = useSellerProfile()

  const save = React.useCallback(
    async (body: SellerSettingsBody) => {
      const { data } = await callApi<SellerSettingsResponse>("/api/seller/settings", {
        method: "PATCH",
        body: JSON.stringify(body),
      })
      setProfile(data)
      return data
    },
    [callApi, setProfile]
  )

  return { settings: settingsOf(profile), save }
}
