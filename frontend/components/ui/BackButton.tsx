"use client"

import React from "react"
import { ChevronLeft } from "lucide-react"

import { useNavigate } from "@/lib/router"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  /** Товчны бичиг. */
  label?: string
  /**
   * Буцах түүх байхгүй үеийн нөөц зам — холбоосыг шинэ таб дээр шууд нээсэн,
   * эсвэл гаднаас орж ирсэн үед `router.back()` хаашаа ч аваачихгүй.
   */
  fallback?: string
  className?: string
}

/**
 * Өмнөх хуудас руу буцаана.
 *
 * Тогтмол зам руу биш, ЯГ өмнө байсан хуудас руу нь буцаадаг: нэг дэлгүүр рүү
 * нүүр, хайлт, шууд дамжуулалт гурван өөр замаар орж ирж болох тул "буцах" нь
 * хэрэглэгчийн явсан замыг дагах ёстой.
 */
export const BackButton: React.FC<BackButtonProps> = ({
  label = "Буцах",
  fallback = "/home",
  className,
}) => {
  const navigate = useNavigate()

  const goBack = () => {
    const hasHistory = typeof window !== "undefined" && window.history.length > 1
    if (hasHistory) navigate(-1)
    else navigate(fallback)
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        "inline-flex items-center gap-1 text-[14px] font-[600] text-[var(--wn-ink-3)] transition-colors hover:text-[var(--wn-ink)]",
        className
      )}
    >
      <ChevronLeft className="size-4" />
      {label}
    </button>
  )
}
