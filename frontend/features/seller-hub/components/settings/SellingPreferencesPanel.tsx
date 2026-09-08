"use client"

import * as React from "react"

import { CONTROL, Field } from "@/features/seller-hub/components/FormField"
import type { ListingType } from "@/types/seller"
import { Toggle } from "@/features/seller-hub/components/Toggle"
import { SettingsSaveBar } from "./SettingsSaveBar"
import { useSellerSettings } from "./useSellerSettings"
import { useSettingsSave } from "./useSettingsSave"

const LISTING_TYPES: { value: ListingType; label: string }[] = [
  { value: "buy_it_now", label: "Шууд худалдах" },
  { value: "auction", label: "Дуудлага худалдаа" },
]

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
        <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500]">
          Шинэ бараа үүсгэхэд ямар утгууд бэлэн байхыг эндээс сонгоно.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white p-6 shadow-sm">
        <Field label="Худалдах үндсэн хэлбэр">
          <select
            value={listingType}
            onChange={(event) => setListingType(event.target.value as ListingType)}
            disabled={phase === "saving"}
            className={CONTROL}
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
            <div className="mt-0.5 text-[13px] leading-tight text-[var(--wn-admin-muted)]">
              Шинэ бараа анхнаасаа худалдан авагчийн үнийн санал хүлээж авна.
            </div>
          </div>
          <Toggle
            checked={acceptOffers}
            disabled={phase === "saving"}
            label="Санал хүлээн авах"
            onChange={() => setAcceptOffers((prev) => !prev)}
          />
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
