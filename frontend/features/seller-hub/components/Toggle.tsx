"use client"

import React from "react"

interface ToggleProps {
  checked: boolean
  /** Дэлгэц уншигчид зориулсан нэр. Хажууд нь харагдах гарчиг нь `<label>` биш. */
  label: string
  onChange: () => void
  disabled?: boolean
}

/**
 * Самбарын цорын ганц унтраалга. Өмнө нь яг ижил бүтэц дөрвөн файлд хуулагдсан
 * байсан (`NotificationsPanel`, `OrderSettingsPanel`, `SellingPreferencesPanel`,
 * `ProductPricingCard`) тул засвар бүр дөрвөн газар давтагдах эрсдэлтэй байв.
 *
 * Асаалттай төлөв нь `#34C759` (iOS-ийн системийн ногоон) байсан:
 *   1. цагаан дэвсгэр дээр 2.22:1 — WCAG SC 1.4.11-ийн 3:1-ийг давдаггүй;
 *   2. самбарын бусад ногоонуудаас гэрэлтүүлгээр .28 өндөр тул ганцаараа
 *      өөр палетраас ирсэн мэт харагддаг.
 * Одоо `--wn-admin-ok` — төлөвийн ногоонтойгоо нэг.
 *
 * Төлөв нь зөвхөн ӨНГӨӨР дамждаггүй: унтраалттай үед бөмбөлөг зүүн талдаа
 * зогсоод хүрээтэй болдог тул өнгө ялгахгүй хэрэглэгч ч байдлыг харна.
 */
export const Toggle: React.FC<ToggleProps> = ({
  checked,
  label,
  onChange,
  disabled = false,
}) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    role="switch"
    aria-checked={checked}
    aria-label={label}
    className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-admin-accent)] disabled:opacity-60 ${
      checked
        ? "border-[var(--wn-admin-ok)] bg-[var(--wn-admin-ok)]"
        : "border-[var(--wn-ink-4)] bg-[var(--wn-admin-chip-2)]"
    }`}
  >
    <span
      className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all ${
        checked ? "right-1" : "left-1"
      }`}
    />
  </button>
)
