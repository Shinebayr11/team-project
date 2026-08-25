"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Гар утсан дээр доороос гарах хуудас, дэлгэц дээр төвд байрлах цонх.
 *
 * Харагдах байдлыг `components/ui/Modal.tsx`-ээс хуулбарласан — ижил радиус
 * (22px), ижил сүүдэр, ижил header зай (px-6 pt-6 pb-4), ижил анимацийн хугацаа
 * (0.3s / cubic-bezier(0.16, 1, 0.3, 1)). Ялгаа нь Base UI Dialog дээр
 * суурилсан тул фокус баригдана, ESC ажиллана, фокус буцаж очно.
 *
 * Modal.tsx-ийн `animate-slide-up`-ийг ЗОРИУДААР ашиглаагүй: тэр keyframe нь
 * toast-д зориулж `translate(-50%, …)`-ээр бичигдсэн бөгөөд `forwards` тул
 * flex-ээр төвлөрүүлсэн цонхыг өөрийн өргөний хагасаар зүүн тийш шилжүүлдэг.
 * Энд байрлуулалтыг Dialog.Viewport хийж, Popup нь зөвхөн гулсалтаа эзэмшинэ.
 */

const TRANSITION =
  "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  /** Хаагдахад фокус буцаж очих элемент (жишээ нь дарсан цэс). */
  finalFocus?: React.RefObject<HTMLElement | null>
  /** Нээгдэхэд фокус авах элемент. */
  initialFocus?: React.RefObject<HTMLElement | null>
  /** Өргөн хувилбар — Modal.tsx-ийн `wide` prop-той ижил (520px). */
  wide?: boolean
  /**
   * Дээр нь давхарлан нээгдэх хуудас. Ар талын хуудсаа хаахгүй тул оруулсан
   * утга алдагдахгүй.
   */
  nested?: boolean
  className?: string
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  children,
  finalFocus,
  initialFocus,
  wide,
  nested,
  className,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
    <Dialog.Portal>
      <Dialog.Backdrop
        className={cn(
          "fixed inset-0 z-[100] bg-[var(--wn-shot-deep)]/45 backdrop-blur-sm",
          "opacity-100 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          TRANSITION,
          // Давхарласан хуудас өөрийн гэсэн бүрхүүл нэмэхгүй — доод хуудасны
          // бүрхүүл л хангалттай, эс тэгвээс хоёр давхар харанхуй болно.
          nested && "bg-transparent backdrop-blur-none"
        )}
      />
      <Dialog.Viewport
        className={cn(
          "fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto",
          "sm:items-center sm:p-4"
        )}
      >
        <Dialog.Popup
          initialFocus={initialFocus}
          finalFocus={finalFocus}
          className={cn(
            "relative flex w-full flex-col overflow-hidden bg-white",
            // Гар утас: доороос гарна, дээд булан нь л мурий.
            "max-h-[92dvh] rounded-t-[22px]",
            // Дэлгэц: төвд, бүх булан мурий.
            "sm:max-h-[85dvh] sm:rounded-[22px]",
            wide ? "sm:max-w-[520px]" : "sm:max-w-[420px]",
            "shadow-[0_24px_64px_rgba(12,12,24,0.28)]",
            // Гар утсан дээр доороос, дэлгэц дээр бага зэрэг доороос мэлтэлзэнэ.
            "translate-y-0 opacity-100",
            "data-[starting-style]:translate-y-full data-[starting-style]:opacity-0",
            "data-[ending-style]:translate-y-full data-[ending-style]:opacity-0",
            "sm:data-[starting-style]:translate-y-2 sm:data-[ending-style]:translate-y-2",
            TRANSITION,
            className
          )}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
)

export interface SheetHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  /** Гарчгийн зүүн талд гарах жижиг тэмдэг. */
  icon?: React.ReactNode
  /** Хаах товч харуулах эсэх. */
  dismissible?: boolean
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({
  title,
  subtitle,
  eyebrow,
  icon,
  dismissible = true,
}) => (
  <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4">
    <div className="flex min-w-0 items-start gap-3">
      {icon}
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1 text-[11px] font-[800] tracking-wider text-[var(--wn-accent)] uppercase">
            {eyebrow}
          </div>
        )}
        <Dialog.Title className="text-[19px] font-[800] tracking-tight text-[var(--wn-ink)]">
          {title}
        </Dialog.Title>
        {subtitle && (
          <Dialog.Description className="mt-1 text-[14px] text-[var(--wn-ink-3)]">
            {subtitle}
          </Dialog.Description>
        )}
      </div>
    </div>

    {dismissible && (
      <Dialog.Close
        aria-label="Хаах"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--wn-surface-2)] text-[var(--wn-ink-3)] transition-colors hover:bg-[var(--wn-line)]"
      >
        <X className="size-4" />
      </Dialog.Close>
    )}
  </div>
)

/** Гүйлгэж болох хэсэг — доод талын товчнууд байрандаа наалдана. */
export const SheetBody: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)}>
    {children}
  </div>
)

export const SheetFooter: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div
    className={cn(
      "sticky bottom-0 flex flex-col gap-2 border-t border-[var(--wn-line)] bg-white px-6 pt-4",
      // Гар утасны доод хэсгийн аюулгүй бүсийг тооцно.
      "pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4",
      className
    )}
  >
    {children}
  </div>
)

export const SheetClose = Dialog.Close
