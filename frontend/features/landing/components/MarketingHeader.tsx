"use client"

/**
 * Landing-ийн sticky header.
 *
 * Текстийн өнгө нь дэлгэцийн голыг огтолж буй section-ийн tone-оос ирнэ
 * (`ScrollProvider`-ийн IntersectionObserver) — бараан section дээр цагаан,
 * цайван дээр noir болж 0.35s-д уусна. 80px scroll хийсний дараа blur болон
 * доод зураас идэвхжинэ.
 */

import { useState } from "react"
import { useMotionValueEvent, useScroll } from "framer-motion"
import { useUser } from "@clerk/nextjs"

import { Link } from "@/lib/router"
import { cn } from "@/lib/utils"

import { DUR } from "../motion"
import { useLandingScroll } from "./ScrollProvider"

const NAV = [
  { to: "/live-show", label: "Шууд" },
  { to: "/explore", label: "Судлах" },
  { to: "/home", label: "Дэлгүүр" },
]

/** Header өөрийн дэвсгэрийг асаах босго. */
const BLUR_AT = 80

export function MarketingHeader() {
  const { active } = useLandingScroll()
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  // Landing нь нэвтэрсэн хэрэглэгчид ч "Нэвтрэх / Бүртгүүлэх" гэж харуулсаар
  // байсан тул нэвтэрсэн хүн энд буцаж ирэхэд орж чадаагүй мэт санагддаг байв.
  // `isLoaded` болтол нэвтрээгүй хувилбарыг үзүүлнэ — SSR-ийн markup-тай таарна.
  const { isLoaded, isSignedIn } = useUser()

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > BLUR_AT
    setSolid((prev) => (prev === next ? prev : next))
  })

  const light = active.tone === "light"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        solid && "backdrop-blur-[12px]",
        solid && (light ? "border-b border-white/8" : "border-b border-black/8")
      )}
      style={{
        color: light ? "#ffffff" : "var(--wn-noir)",
        transition: `color ${DUR.tone}s ease, background-color ${DUR.tone}s ease, border-color ${DUR.tone}s ease`,
        backgroundColor: solid
          ? light
            ? "rgb(14 11 24 / 0.28)"
            : "rgb(255 255 255 / 0.4)"
          : "transparent",
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          className="text-[21px] font-[800] tracking-[-0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          WhyNot
        </Link>

        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-[6px] px-3.5 py-2 text-[15px] font-[600] opacity-85 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {isLoaded && isSignedIn ? (
            <Link
              to="/home"
              className={cn(
                "rounded-[6px] px-4 py-2 text-[15px] font-[700] transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-current",
                light
                  ? "bg-white text-[var(--wn-noir)] hover:bg-white/85"
                  : "bg-[var(--wn-noir)] text-white hover:bg-[#241f35]"
              )}
            >
              Дэлгүүр рүү
            </Link>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="rounded-[6px] px-3.5 py-2 text-[15px] font-[600] opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              >
                Нэвтрэх
              </Link>
              <Link
                to="/sign-up"
                className={cn(
                  "rounded-[6px] px-4 py-2 text-[15px] font-[700] transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-current",
                  light
                    ? "bg-white text-[var(--wn-noir)] hover:bg-white/85"
                    : "bg-[var(--wn-noir)] text-white hover:bg-[#241f35]"
                )}
              >
                Бүртгүүлэх
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
