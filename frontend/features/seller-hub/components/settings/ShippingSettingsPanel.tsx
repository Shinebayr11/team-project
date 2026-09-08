"use client"

import * as React from "react"

import { CONTROL, Field } from "@/features/seller-hub/components/FormField"
import { CARRIERS } from "@/features/seller-hub/components/orders/ShippingForm"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSellerSettings } from "./useSellerSettings"
import { useSettingsSave } from "./useSettingsSave"

/** Захиалга илгээх маягтын тээвэрлэгч болон бэлтгэх хугацаа. */
export const ShippingSettingsPanel: React.FC = () => {
  const { settings, save } = useSellerSettings()
  const { phase, footerError, submit } = useSettingsSave(save)

  const [carrier, setCarrier] = React.useState(settings.shipping.defaultCarrier)
  const [days, setDays] = React.useState(String(settings.shipping.processingDays))

  const parsedDays = Number(days)
  const daysValid = Number.isInteger(parsedDays) && parsedDays >= 1 && parsedDays <= 30

  const dirty =
    carrier !== settings.shipping.defaultCarrier ||
    parsedDays !== settings.shipping.processingDays
  const canSubmit = phase !== "saving" && dirty && daysValid

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Хүргэлтийн тохиргоо</h2>
        <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500]">
          Захиалга илгээхэд ямар тээвэрлэгч бэлэн байхыг эндээс сонгоно.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
        <Field label="Үндсэн тээвэрлэгч">
          <select
            value={carrier}
            onChange={(event) => setCarrier(event.target.value)}
            disabled={phase === "saving"}
            className={CONTROL}
          >
            {CARRIERS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

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
          onSubmit={() =>
            canSubmit &&
            submit({ shipping: { defaultCarrier: carrier, processingDays: parsedDays } })
          }
        />
      </div>
    </div>
  )
}
