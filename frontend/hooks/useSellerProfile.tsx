"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "@/hooks/useApiClient"
import type { SellerMeResponse, SellerProfile } from "@/types/seller"

interface SellerProfileContextValue {
  profile: SellerProfile | null
  /** Профайл эхний удаа уншигдаж дуустал `true`. */
  isLoading: boolean
  /** Худалдагч идэвхтэй эсэх. Уншиж байх үед `false`. */
  isActive: boolean
  /** Серверээс дахин уншина — идэвхжсэний дараа заавал дуудна. */
  refresh: () => Promise<SellerProfile | null>
  /** Серверийн хариуг шууд суулгана (идэвхжсэний дараа нэмэлт дуудлага хэмнэнэ). */
  setProfile: (profile: SellerProfile | null) => void
}

const SellerProfileContext =
  React.createContext<SellerProfileContextValue | null>(null)

/**
 * Худалдагчийн профайлыг нэг л газар уншиж, цэс, хаалт, идэвхжүүлэх хуудас
 * гурав ижил төлөв харна. Идэвхжсэний дараа `/seller` рүү орохоос ӨМНӨ энэ
 * кэшийг шинэчилдэг тул самбар дахин хаалт үзүүлэхгүй.
 */
export const SellerProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoaded, isSignedIn } = useUser()
  const { callApi } = useApiClient()
  const [profile, setProfile] = React.useState<SellerProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const refresh = React.useCallback(async (): Promise<SellerProfile | null> => {
    if (!isSignedIn) {
      setProfile(null)
      setIsLoading(false)
      return null
    }

    try {
      const { data } = await callApi<SellerMeResponse>("/api/seller/me")
      setProfile(data)
      return data
    } catch (error) {
      // UserSync хэрэглэгчийг үүсгэж амжаагүй үед 404 ирж болно. Идэвхгүй гэж
      // үзээд цааш явна — цэс нээлттэй хэвээр байх тул хэрэглэгч гацахгүй.
      console.error("Худалдагчийн профайл уншиж чадсангүй:", error)
      setProfile(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [callApi, isSignedIn])

  React.useEffect(() => {
    if (!isLoaded) return
    void refresh()
  }, [isLoaded, refresh])

  const value = React.useMemo<SellerProfileContextValue>(
    () => ({
      profile,
      isLoading: !isLoaded || isLoading,
      isActive: profile?.status === "active",
      refresh,
      setProfile,
    }),
    [profile, isLoaded, isLoading, refresh]
  )

  return (
    <SellerProfileContext.Provider value={value}>
      {children}
    </SellerProfileContext.Provider>
  )
}

export function useSellerProfile(): SellerProfileContextValue {
  const context = React.useContext(SellerProfileContext)
  if (!context) {
    throw new Error(
      "useSellerProfile-ийг SellerProfileProvider дотор ашиглана уу"
    )
  }
  return context
}
