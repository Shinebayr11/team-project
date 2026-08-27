"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/**
 * Аппын бусад талбартай ижил хэмжээ: өндөр 44px, фокус дээр `--wn-accent`
 * цагираг (Topbar-ын хайлт, NamePrompt-той адил).
 *
 * Хүрээ нь `--wn-line` биш `--wn-ink-4`: талбарын хүрээ бол чимэглэл биш,
 * талбар хаанаас эхэлж байгааг заадаг цорын ганц тэмдэг тул WCAG SC 1.4.11
 * -ийн 3:1 хамаарна. `--wn-line` цагаан дээр 1.18:1, `--wn-ink-4` нь 3.38:1 —
 * шалгуурыг давсан хамгийн цайвар токен. Placeholder нь текст тул 4.5:1
 * шаардана: `--wn-ink-4` 3.38:1-ээр унадаг учир `--wn-ink-3` (5.20:1).
 */
export const inputClass =
  "h-[44px] w-full rounded-xl border border-[var(--wn-ink-4)] bg-white px-3.5 text-[15px] font-[500] text-[var(--wn-ink)] outline-none transition-colors placeholder:text-[var(--wn-ink-3)] focus:border-[var(--wn-accent)] focus:ring-2 focus:ring-[var(--wn-accent)]/25 disabled:cursor-not-allowed disabled:bg-[var(--wn-surface-2)] disabled:text-[var(--wn-ink-4)]"

export interface InputProps extends InputPrimitive.Props {
  /** Алдаатай үед хүрээг улаан болгоно. */
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, invalid, ...props }, ref) {
    return (
      <InputPrimitive
        ref={ref as React.Ref<HTMLElement>}
        aria-invalid={invalid || undefined}
        className={cn(
          inputClass,
          invalid &&
            "border-[var(--wn-live)] focus:border-[var(--wn-live)] focus:ring-[var(--wn-live)]/25",
          className
        )}
        {...props}
      />
    )
  }
)
