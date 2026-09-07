"use client"

import * as React from "react"

import { Field } from "@/features/seller-hub/components/FormField"
import type { ListingType } from "@/types/seller"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSellerSettings } from "./useSellerSettings"
import { useSettingsSave } from "./useSettingsSave"

const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: "buy_it_now", label: "Шууд худалдах" },
  { value: "auction", label: "Дуудлага худалдаа" },
]

const control =
  "w-full h-10 rounded-lg border border-[var(--wn-ink-4)] px-3 text-[14px] font-[500] text-black outline-none focus:border-black"

/**
 * Шинэ бараа үүсгэхэд урьдчилан сонгогдох утгууд. `SellerProducts` дээр
 * "Бараа нэмэх" дарахад эдгээр нь маягтад бэлэн орно.
 */
export const SellingPreferencesPanel: React.FC = () => {
  const { settings, save } = useSellerSettings()
  const { phase, footerError, submit } = useSettingsSave(save)

  const [listingType, setListingType] = React.useState(settings.selling.defaultListingType)
  const [acceptOffers, setAcceptOffers] = React.useState(settings.selling.acceptOffers)

  const dirty =
    listingType !== settings.selling.defaultListingType ||
    acceptOffers !== settings.selling.acceptOffers
  const canSubmit = phase !== "saving" && dirty

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] mb-1 text-black">Худалдааны тохиргоо</h2>
        <p className="text-[14px] text-gray-500 font-[500]">
          Шинэ бараа үүсгэхэд ямар утгууд бэлэн байхыг эндээс сонгоно.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Field label="Худалдах үндсэн хэлбэр">
          <select
            value={listingType}
            onChange={(event) => setListingType(event.target.value as ListingType)}
            disabled={phase === "saving"}
            className={control}
          >
            {LISTING_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[14px] font-[700] text-black">Санал хүлээн авах</div>
            <div className="mt-0.5 text-[12.5px] leading-tight text-gray-500">
              Шинэ бараа анхнаасаа худалдан авагчийн үнийн санал хүлээж авна.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAcceptOffers((prev) => !prev)}
            disabled={phase === "saving"}
            role="switch"
            aria-checked={acceptOffers}
            aria-label="Санал хүлээн авах"
            className={`relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
              acceptOffers ? "bg-[#34C759]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all ${
                acceptOffers ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>

        <SettingsSaveBar
          phase={phase}
          canSubmit={canSubmit}
          footerError={footerError}
          onSubmit={() =>
            canSubmit &&
            submit({ selling: { defaultListingType: listingType, acceptOffers } })
          }
        />
      </div>
    </div>
  )
}
