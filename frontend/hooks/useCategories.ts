"use client"

import { useCallback, useEffect, useState } from "react"
import { useApiClient } from "./useApiClient"

export interface Category {
  _id: string
  name: string
}

/**
 * Ангиллын жагсаалт. Худалдагч /sell дээрээс шинэ ангилал нэмэхэд бусад бүх
 * хэрэглэгчид харагдах ерөнхий сан руу хадгалагдана — Home-ийн ангиллаар
 * бүлэглэх нь шоуны `category` талбар дээр шууд тулгуурладаг тул шинэ нэр
 * бүхий шоу гарахад автоматаар шинэ бүлэг үүснэ.
 */
export function useCategories() {
  const { callApi } = useApiClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { category } = await callApi<{ category: Category[] }>("/api/category")
      setCategories(category)
    } catch (error) {
      console.error("Ангилал уншиж чадсангүй:", error)
    } finally {
      setLoading(false)
    }
  }, [callApi])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addCategory = useCallback(
    async (name: string): Promise<{ ok: boolean; message?: string; category?: Category }> => {
      const trimmed = name.trim()
      if (!trimmed) return { ok: false, message: "Ангиллын нэрээ оруулна уу" }

      const existing = categories.find(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase()
      )
      if (existing) return { ok: true, category: existing }

      try {
        const { category } = await callApi<{ category: Category }>("/api/category", {
          method: "POST",
          body: JSON.stringify({ name: trimmed }),
        })
        setCategories((prev) => [...prev, category])
        return { ok: true, category }
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "Нэмж чадсангүй",
        }
      }
    },
    [callApi, categories]
  )

  return { categories, loading, addCategory, refresh }
}
