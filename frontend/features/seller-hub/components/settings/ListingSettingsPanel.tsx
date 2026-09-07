"use client"

import * as React from "react"

import { Field } from "@/features/seller-hub/components/FormField"
import { PRODUCT_CATEGORIES } from "@/features/seller-hub/components/products/productDraft"
import { PRODUCT_CONDITIONS } from "@/features/seller-hub/sellerSettings"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSellerSettings } from "./useSellerSettings"
import { useSettingsSave } from "./useSettingsSave"

const control =
  "w-full h-10 rounded-lg border border-[var(--wn-ink-4)] px-3 text-[14px] font-[500] text-black outline-none focus:border-black"

/** Шинэ барааны маягтын ангилал, байдал, тоо ширхгийн урьдчилсан утга. */
export const ListingSettingsPanel: React.FC = () => {
  const { settings, save } = useSellerSettings()
  const { phase, footerError, submit } = useSettingsSave(save)

  const [category, setCategory] = React.useState(settings.listing.defaultCategory)
  const [condition, setCondition] = React.useState(settings.listing.defaultCondition)
  const [quantity, setQuantity] = React.useState(String(settings.listing.defaultQuantity))

  const parsedQuantity = Number(quantity)
  const quantityValid =
    Number.isInteger(parsedQuantity) && parsedQuantity >= 0 && parsedQuantity <= 9999

  const dirty =
    category !== settings.listing.defaultCategory ||
    condition !== settings.listing.defaultCondition ||
    parsedQuantity !== settings.listing.defaultQuantity
  const canSubmit = phase !== "saving" && dirty && quantityValid

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Барааны жагсаалтын тохиргоо</h2>
        <p className="text-[14px] text-gray-500 font-[500]">
          Шинэ бараа үүсгэхэд эдгээр утга анхнаасаа бөглөгдсөн байна.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Field label="Үндсэн ангилал">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={phase === "saving"}
            className={control}
          >
            {PRODUCT_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Барааны байдал">
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            disabled={phase === "saving"}
            className={control}
          >
            {PRODUCT_CONDITIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <Field label="Үндсэн тоо ширхэг">
            <input
              type="number"
              min={0}
              max={9999}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled={phase === "saving"}
              className={control}
            />
          </Field>
          {!quantityValid && (
            <p className="mt-1 text-[12.5px] font-[600] text-red-600">
              0–9999 хооронд бүхэл тоо оруулна уу.
            </p>
          )}
        </div>

        <SettingsSaveBar
          phase={phase}
          canSubmit={canSubmit}
          footerError={footerError}
          onSubmit={() =>
            canSubmit &&
            submit({
              listing: {
                defaultCategory: category,
                defaultCondition: condition,
                defaultQuantity: parsedQuantity,
              },
            })
          }
        />
      </div>
    </div>
  )
}
