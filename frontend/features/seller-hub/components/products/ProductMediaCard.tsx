"use client"

import React, { useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { uploadFile } from "@/lib/upload"
import { Panel } from "../DataCard"

interface ProductMediaCardProps {
  images: string[]
  onChange: (images: string[]) => void
}

const MAX_IMAGES = 6

const HINT = `JPG, PNG, WEBP, GIF · 5MB хүртэл · ${MAX_IMAGES} зураг хүртэл`

/**
 * Барааны зураг.
 *
 * Зургууд Vercel Blob руу шууд хөтчөөс очиж, зөвхөн хаяг нь бараанд хадгалагдана —
 * store нь localStorage-д бичигддэг тул base64 хадгалбал багтаамж дүүрнэ.
 *
 * Өмнө нь энэ хэсэг 100×100 жижиг товч байсан тул «энд зураг оруулна» гэдэг нь
 * уншигдахгүй, тохиргоо хийгдээгүй үед бүр ганц мөр саарал бичиг үлдэж карт нь
 * эвдэрсэн мэт харагддаг байв. Одоо аль ч төлөвт зурагны талбарын ХЭЛБЭР
 * хадгалагдана.
 */
export const ProductMediaCard: React.FC<ProductMediaCardProps> = ({
  images,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remaining = MAX_IMAGES - images.length
  const disabled = uploading || remaining <= 0

  const pickFiles = async (files: FileList | null) => {
    if (!files?.length) return

    setUploading(true)
    setError(null)

    const uploaded: string[] = []
    try {
      // Нэг нэгээр нь илгээнэ — аль нэг нь бүтэлгүйтвэл өмнөх нь хэвээр үлдэнэ.
      for (const file of Array.from(files).slice(0, remaining)) {
        uploaded.push(await uploadFile(file))
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Зураг байршуулж чадсангүй"
      )
    } finally {
      if (uploaded.length) onChange([...images, ...uploaded])
      setUploading(false)
      // Ижил файлыг дахин сонгоход өөрчлөлт бүртгэгдэхийн тулд цэвэрлэнэ.
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <Panel title="Зураг">
      {/* Чирж оруулах нь зурагны талбараас хүлээгддэг зан — файл сонгогч нь
          гар утсан дээр `accept="image/*"`-аар камер/галерейг өөрөө санал
          болгодог тул тусдаа зам хэрэггүй. */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (!disabled) void pickFiles(event.dataTransfer.files)
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          dragging
            ? "border-[var(--wn-admin-ink)] bg-[var(--wn-admin-row-rule)]"
            : "border-[var(--wn-ink-4)] hover:bg-[var(--wn-admin-row-rule)]"
        }`}
      >
        {/* `pointer-events-none` нь заавал: үүнгүй бол чирж явахад дүрс, бичиг
            дээгүүр өнгөрөх бүрд эцэг дээр `dragleave` буудаж, хүрээ нь
            асаж-унтарч анивчдаг. */}
        <span className="pointer-events-none flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 className="h-7 w-7 animate-spin text-[var(--wn-admin-muted)]" />
          ) : (
            <ImagePlus className="h-7 w-7 text-[var(--wn-admin-muted)]" />
          )}
          <span className="text-[14px] font-[700] text-[var(--wn-admin-ink-2)]">
            {uploading
              ? "Байршуулж байна…"
              : remaining <= 0
                ? `${MAX_IMAGES} зураг бүрэн орсон`
                : "Зургаа чирж оруулах эсвэл сонгох"}
          </span>
          <span className="text-[13px] font-[500] text-[var(--wn-admin-muted)]">
            {HINT}
          </span>
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => pickFiles(event.target.files)}
      />

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--wn-admin-card-border)] bg-[var(--wn-admin-chip)]"
            >
              {/* Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо
                  шаардахгүйн тулд энгийн <img> ашиглав. */}
              <img
                src={url}
                alt={`Барааны зураг ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* «Эхний зураг жагсаалтад харагдана» гэдэг нь өмнө нь зөвхөн
                  доорх тайлбарт бичээстэй байсан — аль нь эхнийх болохыг
                  зураг дээр нь хэлэх нь ойлгомжтой. */}
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-[var(--wn-admin-ink)] px-2 py-0.5 text-[11px] font-[800] tracking-wide text-white">
                  НҮҮР
                </span>
              )}

              <button
                type="button"
                onClick={() => onChange(images.filter((item) => item !== url))}
                aria-label={`${index + 1}-р зургийг устгах`}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--wn-admin-card-border)] bg-white text-[var(--wn-admin-muted)] shadow-sm transition-colors hover:text-black"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-3 text-[13px] font-[600] text-[var(--wn-admin-danger)]">
          {error}
        </p>
      )}
    </Panel>
  )
}
