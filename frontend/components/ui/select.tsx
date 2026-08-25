"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { inputClass } from "@/components/ui/input"

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface SelectProps<T extends string = string> {
  value: T
  onValueChange: (value: T) => void
  items: ReadonlyArray<SelectOption<T>>
  /** Сонгох боломжгүй болгоно (жишээ нь илгээж байх үед). */
  disabled?: boolean
  id?: string
  className?: string
  "aria-labelledby"?: string
}

/**
 * Талбарын өндөр/хүрээ нь `Input`-тэй яг ижил байхын тулд `inputClass`-ыг
 * дахин ашиглаж, зөвхөн текстийн байрлалыг тохируулав.
 */
export function Select<T extends string = string>({
  value,
  onValueChange,
  items,
  disabled,
  id,
  className,
  ...rest
}: SelectProps<T>) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={(next) => {
        if (next != null) onValueChange(next as T)
      }}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={cn(
          inputClass,
          "flex items-center justify-between gap-2 text-left",
          "data-[popup-open]:border-[var(--wn-accent)]",
          className
        )}
        {...rest}
      >
        <SelectPrimitive.Value>
          {(current: string | null) =>
            items.find((item) => item.value === current)?.label ?? ""
          }
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon className="flex text-[var(--wn-ink-4)]">
          <ChevronDown className="size-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          alignItemWithTrigger={false}
          sideOffset={6}
          className="z-[110]"
        >
          <SelectPrimitive.Popup
            className={cn(
              "max-h-[min(20rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto rounded-xl border border-[var(--wn-line)] bg-white p-1.5",
              "shadow-[0_16px_40px_rgba(12,12,24,0.16)]",
              "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none",
              "data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0"
            )}
          >
            <SelectPrimitive.List>
              {items.map((item) => (
                <SelectPrimitive.Item
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "flex cursor-default items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[15px] font-[600] text-[var(--wn-ink)] outline-none select-none",
                    "data-[highlighted]:bg-[var(--wn-surface-2)]",
                    "data-[selected]:text-[var(--wn-accent)]"
                  )}
                >
                  <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="flex text-[var(--wn-accent)]">
                    <Check className="size-4" strokeWidth={3} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
