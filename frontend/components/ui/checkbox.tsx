"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  className?: string
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border border-[var(--wn-line-3)] bg-white transition-colors",
          "focus-visible:ring-2 focus-visible:ring-[var(--wn-accent)]/40 focus-visible:outline-none",
          "data-[checked]:border-[var(--wn-accent)] data-[checked]:bg-[var(--wn-accent)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex text-white">
          <Check className="size-3.5" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  }
)
