"use client"

/**
 * Дэлгэцийн доод голд суух навигац.
 *
 * Дараагийн section-ийн нэрийг харуулна; сүүлийн section дээр "Дээш буцах"
 * болж хувирна. Дарахад `lenis.scrollTo()`-оор зөөлөн гүйлгэнэ (reduced-motion
 * үед шууд үсэрнэ). Өнгө нь идэвхтэй section-ийн tone-оос ирнэ.
 */

import { ArrowDown, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

import { DUR, SECTIONS } from "../motion"
import { useLandingScroll } from "./ScrollProvider"

export function SectionNavPill() {
  const { activeIndex, active, scrollToSection } = useLandingScroll()

  const last = activeIndex >= SECTIONS.length - 1
  const target = last ? SECTIONS[0] : SECTIONS[activeIndex + 1]
  const label = last ? "Дээш буцах" : target.label
  const light = active.tone === "light"

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-5">
      <button
        type="button"
        onClick={() => scrollToSection(target.id)}
        className={cn(
          "pointer-events-auto inline-flex items-center gap-2 rounded-[6px] border px-4 py-2.5 text-[13px] font-[700] backdrop-blur-[12px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-current",
          light
            ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
            : "border-black/10 bg-white/70 text-[var(--wn-noir)] hover:bg-white"
        )}
        style={{
          transition: `color ${DUR.tone}s ease, background-color ${DUR.tone}s ease, border-color ${DUR.tone}s ease`,
        }}
      >
        {label}
        {last ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  )
}
