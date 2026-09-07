"use client"

import { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

import { useApiClient } from "./useApiClient"
import type { Address, AddressBody, AddressListResponse } from "@/types/account"

/**
 * Хүргэлтийн хаягууд.
 *
 * Сервер бүх үйлдлийн хариуд БҮТЭН жагсаалтаа буцаадаг тул нэмэх/засах/устгах
 * бүрд дахин татах шаардлагагүй — үндсэн хаяг шилжих зэрэг хажуугийн
 * өөрчлөлтүүд ч шууд тусна.
 */
export function useAddresses() {
  const { callApi } = useApiClient()
  const { isLoaded, isSignedIn } = useUser()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [settled, setSettled] = useState(false)

  const load = useCallback(async () => {
    const { data } = await callApi<AddressListResponse>("/api/users/addresses")
    setAddresses(data)
  }, [callApi])

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    let cancelled = false
    load()
      .catch((error) => console.error("Хаягуудыг уншиж чадсангүй:", error))
      .finally(() => {
        if (!cancelled) setSettled(true)
      })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, load])

  const create = useCallback(
    async (body: AddressBody) => {
      const { data } = await callApi<AddressListResponse>("/api/users/addresses", {
        method: "POST",
        body: JSON.stringify(body),
      })
      setAddresses(data)
    },
    [callApi]
  )

  const update = useCallback(
    async (id: string, body: AddressBody) => {
      const { data } = await callApi<AddressListResponse>(`/api/users/addresses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      })
      setAddresses(data)
    },
    [callApi]
  )

  const remove = useCallback(
    async (id: string) => {
      const { data } = await callApi<AddressListResponse>(`/api/users/addresses/${id}`, {
        method: "DELETE",
      })
      setAddresses(data)
    },
    [callApi]
  )

  return {
    addresses,
    loading: !isLoaded || (isSignedIn === true && !settled),
    create,
    update,
    remove,
  }
}
