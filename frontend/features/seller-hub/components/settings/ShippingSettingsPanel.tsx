"use client"

import * as React from "react"

import { CONTROL, Field } from "@/features/seller-hub/components/FormField"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSellerSettings } from "./useSellerSettings"
import { useSettingsSave } from "./useSettingsSave"

/**
 * Захиалга бэлтгэх хугацаа. Тээвэрлэгчийн сонголт БАЙХГҮЙ — хүргэлтэд
 * гаргахдаа тухайн жолоочийн утас, машины дугаарыг захиалга тус бүрд
 * бөглөдөг тул урьдчилан тохируулах утга байхгүй.
 */
export const ShippingSettingsPanel: React.FC = () => {
  const { settings, save } = useSellerSettings()
  const { phase, footerError, submit } = useSettingsSave(save)

  const [days, setDays] = React.useState(String(settings.shipping.processingDays))

  const parsedDays = Number(days)
  const daysValid = Number.isInteger(parsedDays) && parsedDays >= 1 && parsedDays <= 30

  const dirty = parsedDays !== settings.shipping.processingDays
  const canSubmit = phase !== "saving" && dirty && daysValid

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Хүргэлтийн тохиргоо</h2>
        <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500]">
          Захиалгыг бэлтгэхэд хэдэн хоног шаардагдахыг эндээс тохируулна.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
        <div>
          <Field label="Бэлтгэх хугацаа (хоног)">
            <input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(event) => setDays(event.target.value)}
              disabled={phase === "saving"}
              className={CONTROL}
            />
          </Field>
          {daysValid ? (
            <p className="mt-1 text-[13px] text-[var(--wn-admin-muted)]">
              Захиалгыг илгээхэд шаардагдах ажлын хоног.
            </p>
          ) : (
            <p className="mt-1 text-[13px] font-[600] text-[var(--wn-admin-danger)]">
              1–30 хоногийн хооронд бүхэл тоо оруулна уу.
            </p>
          )}
        </div>

        <SettingsSaveBar
          phase={phase}
          canSubmit={canSubmit}
          footerError={footerError}
          onSubmit={() => canSubmit && submit({ shipping: { processingDays: parsedDays } })}
        />
      </div>
    </div>
  )
}
