"use client"

import React from "react"

/**
 * Уншиж байх үеийн орлуулагч.
 *
 * Спиннер нь «ямар нэг зүйл болж байна» гэдгийг л хэлдэг бол skeleton нь ирэх
 * агуулгынхаа БАЙРЛАЛЫГ урьдчилж эзэлдэг тул дуусахад хуудас үсэрдэггүй.
 * Тиймээс skeleton бүр орлуулж буй элементийнхээ ХЭМЖЭЭГ авах ёстой — «ойролцоо
 * саарал тэгш өнцөгт» нь спиннерээс дээрдэхгүй.
 *
 * Өнгө нь `--wn-line`: цагаан ба `--wn-page` хоёулан дээр мэдрэгдэх ч контентын
 * хэмжээнд анхаарал татахгүй хамгийн цайвар шугамын өнгө.
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-md bg-[var(--wn-line)] motion-reduce:animate-none ${className}`}
  />
)

/**
 * Skeleton-уудын бүрхүүл. Дэлгэц уншигчид НЭГ л мэдэгдэл өгнө — доторх
 * зурвасууд `aria-hidden` тул 30 ширхэг хоосон тэгш өнцөгт уншигдахгүй.
 */
export const SkeletonScreen: React.FC<{
  children: React.ReactNode
  className?: string
  label?: string
}> = ({ children, className = "", label = "Уншиж байна" }) => (
  <div role="status" aria-busy="true" aria-label={label} className={className}>
    <div aria-hidden="true" className="contents">
      {children}
    </div>
  </div>
)

/** Догол мөр. Сүүлийн мөр нь богино — жинхэнэ бичвэр ингэж тасардаг. */
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 2,
  className = "",
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton key={i} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
    ))}
  </div>
)

/**
 * Аватар + хоёр мөр бүхий жагсаалтын мөр. Зурвасын яриа, дагаж буй худалдагч,
 * худалдан авалт, хаяг, эфирийн лоттой ЯГ ижил бүтэцтэй тул дөрвүүлээ үүнийг
 * дахин ашиглана.
 */
export const SkeletonRows: React.FC<{
  rows?: number
  card?: boolean
  className?: string
}> = ({ rows = 4, card = true, className = "" }) => (
  <div className={`flex flex-col gap-3 ${className}`}>
    {Array.from({ length: rows }, (_, i) => (
      <div
        key={i}
        className={`flex items-center gap-4 ${
          card
            ? "rounded-2xl border border-[var(--wn-line)] bg-white p-4"
            : "border-b border-[var(--wn-line)] p-4"
        }`}
      >
        <Skeleton className="size-11 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
)

/**
 * Шууд дамжуулалт, барааны сүлжээ. `ratio` нь орлуулж буй картын харьцаа —
 * нүүрний шууд дамжуулалт 3/4, дэлгүүрийн бараа 1/1.
 */
export const SkeletonCardGrid: React.FC<{
  count?: number
  ratio?: "3/4" | "1/1"
  withHeader?: boolean
  className?: string
}> = ({ count = 8, ratio = "3/4", withHeader = true, className = "" }) => (
  <div className={className}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex flex-col gap-3">
        {withHeader && (
          <div className="flex items-center gap-2">
            <Skeleton className="size-[26px] rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        )}
        <Skeleton
          className={`w-full rounded-[16px] ${ratio === "3/4" ? "aspect-[3/4]" : "aspect-square"}`}
        />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
)
