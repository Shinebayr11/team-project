"use client"

import { useCallback, useState } from "react"
import { useApiClient } from "./useApiClient"
import { AuctionProduct } from "./useAuction"
import { useLoad } from "./useLoad"

export interface ShowProduct {
  _id: string
  live_show_id?: string
  product_id?: AuctionProduct | string
  display_order?: number
}

/**
 * Жагсаалтын мөрөөс барааны мэдээллийг гаргаж авах. Бараа нь устсан бол
 * populate хийхэд null ирдэг ба `typeof null === "object"` тул зөвхөн төрлөөр
 * шалгаж болохгүй.
 */
export const productOfEntry = (entry: ShowProduct): AuctionProduct | undefined =>
  entry.product_id && typeof entry.product_id === "object"
    ? entry.product_id
    : undefined

/**
 * Нэг дамжуулалтын барааны жагсаалт. Худалдагч /sell дээрээс энд бараагаа нэмж,
 * үзэгч дамжуулалт дээр яг үүнийг хардаг.
 */
export function useShowProducts(liveShowId?: string) {
  const { callApi } = useApiClient()
  const [entries, setEntries] = useState<ShowProduct[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!liveShowId) {
      setEntries([])
      setLoading(false)
      return
    }
    try {
      const { data } = await callApi<{ data: ShowProduct[] }>(
        `/api/showproduct?live_show_id=${liveShowId}`
      )
      setEntries(data)
    } catch (error) {
      console.error("Дамжуулалтын бараа уншиж чадсангүй:", error)
    } finally {
      setLoading(false)
    }
  }, [callApi, liveShowId])

  useLoad(refresh)

  const add = useCallback(
    async (productId: string): Promise<{ ok: boolean; message?: string }> => {
      if (!liveShowId) return { ok: false, message: "Дамжуулалт олдсонгүй" }
      try {
        await callApi("/api/showproduct", {
          method: "POST",
          body: JSON.stringify({
            live_show_id: liveShowId,
            product_id: productId,
          }),
        })
        await refresh()
        return { ok: true }
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "Нэмж чадсангүй",
        }
      }
    },
    [callApi, liveShowId, refresh]
  )

  const remove = useCallback(
    async (entryId: string): Promise<{ ok: boolean; message?: string }> => {
      try {
        await callApi(`/api/showproduct/${entryId}`, { method: "DELETE" })
        await refresh()
        return { ok: true }
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "Хасаж чадсангүй",
        }
      }
    },
    [callApi, refresh]
  )

  return { entries, loading, add, remove, refresh }
}

/** Дамжуулалтын жагсаалтыг хэд хэдэн панель хуваалцдаг тул төрлийг нэрлэв. */
export type ShowLineupState = ReturnType<typeof useShowProducts>

/** Тухайн бараа жагсаалтад аль хэдийн орсон эсэх. */
export const lineupEntryOf = (entries: ShowProduct[], productId: string) =>
  entries.find((entry) => productOfEntry(entry)?._id === productId)
