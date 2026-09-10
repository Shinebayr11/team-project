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
 * Асаалттай төлөв нь ХАР (`--wn-admin-ink`) — идэвхтэй цэс, таб, гол товчтой
 * нэг. Унтраалга асаалттай байх нь СОНГОЛТ болохоос амжилтын мэдэгдэл биш тул
 * палетрын дүрмээр (harilcan үйлдэл → ink, төлөв → ok/warn/danger) энд ирнэ.
 *
 * Өмнө нь энд хоёр өөр ногоон дараалан туршигдсан бөгөөд хоёулаа буруу байв:
 *   • `#34C759` (iOS) — цагаан дээр 2.22:1, SC 1.4.11-ийн 3:1-ийг давдаггүй;
 *   • `--wn-admin-ok` (#0e6632) — энэ нь ЦАЙВАР ДЭВСГЭР ДЭЭР БИЧИХ өнгө
 *     (6.2:1-д зориулж сонгосон бараан, ханалт багатай ой мод), дэвсгэр болгож
 *     хэрэглэхэд самбарын өөр хаана ч байхгүй шаварлаг ногоон толбо болдог.
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
        ? "border-[var(--wn-admin-ink)] bg-[var(--wn-admin-ink)]"
        : "border-[var(--wn-ink-4)] bg-[var(--wn-admin-chip-2)]"
    }`}
  >
    <span
      className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all ${
        checked ? "right-1" : "left-1"
      }`}
    />
  </button>
)
