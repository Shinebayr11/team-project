"use client"

import * as React from "react"
import { btn } from "@/features/seller-hub/components/buttons"

interface SettingsSaveBarProps {
  phase: "idle" | "saving" | "saved"
  canSubmit: boolean
  footerError: string | null
  onSubmit: () => void
}

export const SettingsSaveBar: React.FC<SettingsSaveBarProps> = ({
  phase,
  canSubmit,
  footerError,
  onSubmit,
}) => (
  <>
    {footerError && (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--wn-admin-danger-soft)] px-3.5 py-2.5">
        <p className="text-[13px] font-[600] text-[var(--wn-admin-danger)]">{footerError}</p>
        <button
          type="button"
          onClick={onSubmit}
          className="text-[13px] font-[800] text-[var(--wn-admin-danger)] underline underline-offset-2"
        >
          Дахин оролдох
        </button>
      </div>
    )}

    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className={btn("ink", "field")}
      >
        {phase === "saving" ? "Хадгалж байна…" : "Хадгалах"}
      </button>
      {phase === "saved" && (
        <span className="text-[13px] font-[700] text-[var(--wn-admin-ok)]">Хадгалагдлаа</span>
      )}
    </div>
  </>
)
