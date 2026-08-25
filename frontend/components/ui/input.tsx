"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/**
 * Аппын бусад талбартай ижил хэмжээ: өндөр 44px, `--wn-line` хүрээ,
 * фокус дээр `--wn-accent` цагираг (Topbar-ын хайлт, NamePrompt-той адил).
 */
export const inputClass =
  "h-[44px] w-full rounded-xl border border-[var(--wn-line)] bg-white px-3.5 text-[15px] font-[500] text-[var(--wn-ink)] outline-none transition-colors placeholder:text-[var(--wn-ink-4)] focus:border-[var(--wn-accent)] focus:ring-2 focus:ring-[var(--wn-accent)]/25 disabled:cursor-not-allowed disabled:bg-[var(--wn-surface-2)] disabled:text-[var(--wn-ink-4)]"

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
