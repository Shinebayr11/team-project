"use client"

/**
 * Landing дээрх барааны/хүний зургийн ганц үүд.
 *
 * Гурван төлөв, гурвуулаа ИЖИЛ `aspect-ratio`-той хайрцагт суух тул зураг
 * нэмэгдэх/унах алинд нь ч layout хөдлөхгүй — CLS 0:
 *   1. `src === null`      → токеноор зурсан дэвсгэр
 *   2. зураг ачаалагдсан   → `next/image` (blur placeholder-оос уусна)
 *   3. зураг олдоогүй/унасан → 1-рүү буцна
 *
 * 3-р төлөв нь санаатай: `public/landing/`-д файл нэмэгдэх хүртэл (эсвэл нэг
 * нь дутуу үлдэхэд) хуудас эвдэрсэн зургийн дүрс харуулахгүй, зүгээр л
 * placeholder хэвээр байна.
 */

import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

/**
 * 4×5 пикселийн бараан ягаан PNG (100 тэмдэгт). Зураг ачаалагдтал энэ нь
 * сунгагдаж бүдэг өнгө болж харагдана — гадны хүсэлт үүсгэхгүй.
 */
const BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAIAAADtz9qMAAAAEElEQVR42mPQUnGAIwYyOABnJAsZ5QxBSQAAAABJRU5ErkJggg=="

interface MediaSlotProps {
  src: string | null
  /** Монгол alt. Чимэглэлийн зураг бол хоосон мөр өгнө. */
  alt: string
  /** CSS `aspect-ratio`, ж: "4 / 5". */
  ratio: string
  /** `sizes` — Next зөв өргөнийг сонгоно. */
  sizes: string
  className?: string
  priority?: boolean
}

export function MediaSlot({
  src,
  alt,
  ratio,
  sizes,
  className,
  priority = false,
}: MediaSlotProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(155deg,rgb(255_255_255_/_0.22),rgb(255_255_255_/_0.04))]",
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      {src && !failed && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={BLUR}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </div>
  )
}
