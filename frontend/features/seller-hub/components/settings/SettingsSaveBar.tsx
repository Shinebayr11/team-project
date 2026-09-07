"use client"

import * as React from "react"

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
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-red-50 px-3.5 py-2.5">
        <p className="text-[13px] font-[600] text-red-600">{footerError}</p>
        <button
          type="button"
          onClick={onSubmit}
          className="text-[13px] font-[800] text-red-600 underline underline-offset-2"
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
        className="h-10 rounded-lg bg-black px-5 text-[14px] font-[700] text-white transition-colors hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
      >
        {phase === "saving" ? "Хадгалж байна…" : "Хадгалах"}
      </button>
      {phase === "saved" && (
        <span className="text-[13px] font-[700] text-emerald-600">Хадгалагдлаа</span>
      )}
    </div>
  </>
)
