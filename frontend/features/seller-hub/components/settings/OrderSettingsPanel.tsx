"use client"

import * as React from "react"

import { Field } from "@/features/seller-hub/components/FormField"
import { Toggle } from "@/features/seller-hub/components/Toggle"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSellerSettings } from "./useSellerSettings"
import { useSettingsSave } from "./useSettingsSave"

const NOTE_MAX = 300

/** Шинэ захиалгыг хэрхэн угтах, хүргэлтийн хуудсанд юу бичих. */
export const OrderSettingsPanel: React.FC = () => {
  const { settings, save } = useSellerSettings()
  const { phase, footerError, submit } = useSettingsSave(save)

  const [autoConfirm, setAutoConfirm] = React.useState(settings.orders.autoConfirm)
  const [note, setNote] = React.useState(settings.orders.packingSlipNote)

  const trimmedNote = note.trim()
  const dirty =
    autoConfirm !== settings.orders.autoConfirm ||
    trimmedNote !== settings.orders.packingSlipNote
  const canSubmit = phase !== "saving" && dirty

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Захиалгын тохиргоо</h2>
        <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500]">
          Шинэ захиалга ирэхэд юу болохыг эндээс тохируулна.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[14px] font-[700] text-black">Захиалгыг шууд баталгаажуулах</div>
            <div className="mt-0.5 text-[13px] leading-tight text-[var(--wn-admin-muted)]">
              Шинэ захиалгыг нээхэд “Боловсруулж буй” төлөвт өөрөө шилжинэ.
            </div>
          </div>
          <Toggle
            checked={autoConfirm}
            disabled={phase === "saving"}
            label="Захиалгыг шууд баталгаажуулах"
            onChange={() => setAutoConfirm((prev) => !prev)}
          />
        </div>

        <div>
          <Field label="Баглаанд хийх тэмдэглэл">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              maxLength={NOTE_MAX}
              disabled={phase === "saving"}
              placeholder="Жишээ нь: Худалдан авсанд баярлалаа!"
              className="w-full rounded-lg border border-[var(--wn-ink-4)] p-3 text-[14px] font-[500] text-black outline-none focus:border-black resize-none"
            />
          </Field>
          <p className="mt-1 text-[13px] text-[var(--wn-admin-muted)]">
            Захиалгын биелэлтийн хэсэгт харагдана. {trimmedNote.length}/{NOTE_MAX} тэмдэгт.
          </p>
        </div>

        <SettingsSaveBar
          phase={phase}
          canSubmit={canSubmit}
          footerError={footerError}
          onSubmit={() =>
            canSubmit && submit({ orders: { autoConfirm, packingSlipNote: trimmedNote } })
          }
        />
      </div>
    </div>
  )
}
