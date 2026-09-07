"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useUser } from "@clerk/nextjs"

/**
 * Уншсан мэдэгдлийг хөтөч дээр тэмдэглэх. Хэрэглэгч тус бүрээр нь тусад нь
 * хадгална — нэг browser-ээс хэд хэдэн хүн нэвтэрч болно.
 *
 * Хожил, борлуулалт хоёр ижилхэн ажилладаг тул нэг л газар байна.
 */
export function useSeenIds(prefix: string, ids: string[]) {
  const { user } = useUser()
  const [seen, setSeen] = useState<string[]>([])

  const storageKey = `${prefix}:${user?.id ?? "anon"}`

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      setSeen(raw ? (JSON.parse(raw) as string[]) : [])
    } catch {
      setSeen([])
    }
  }, [storageKey])

  const unseenCount = useMemo(
    () => ids.filter((id) => !seen.includes(id)).length,
    [ids, seen]
  )

  const markAllSeen = useCallback(() => {
    setSeen(ids)
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids))
    } catch {
      // Хувийн горим гэх мэт хадгалах боломжгүй үед мэдэгдэл дахин
      // тоологдох нь болно — гэхдээ програм ажиллахад саад болохгүй.
    }
  }, [ids, storageKey])

  const isUnseen = useCallback((id: string) => !seen.includes(id), [seen])

  return { unseenCount, markAllSeen, isUnseen }
}
