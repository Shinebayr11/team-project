"use client"

import React from 'react';

// Хүрээ нь `border-[var(--wn-ink-4)]` биш: цагаан дээр 1.47:1 буюу WCAG SC 1.4.11-ийн
// 3:1-ийг давдаггүй. Талбарын хүрээ бол түүний хил хязгаарыг заадаг цорын ганц
// тэмдэг тул шалгуур хамаарна. Tailwind-ын саарал хэмжүүрт 400 (2.54:1) унаж,
// 500 нь 4.83:1-ээр хэт хүнд харагдана — `--wn-ink-4` 3.38:1-ээр шалгуурыг
// давсан хамгийн цайвар утга бөгөөд `components/ui/input.tsx`-тэй ижил.
//
// ЭКСПОРТЛОГДСОН нь санаатай: энэ мөр өмнө нь дөрвөн файлд хуулагдаж
// (`ProductPricingCard`, `ShippingForm`, `ShowForm`, `StockModal`), хуулбар
// бүр нь дээрх шалтгааныг мэдэлгүй `border-[var(--wn-ink-4)]` дээр үлдсэн байв.
// Самбарын бүх хяналт 40px (`h-10`) өндөртэй — `SellerAnalytics` дээрх
// `h-9` нь толгойн мөрийг хуудас хооронд 4px-ээр үсрүүлдэг байсан.
export const CONTROL =
  'w-full h-10 rounded-lg border border-[var(--wn-ink-4)] px-3 text-[14px] font-[500] text-black outline-none focus:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-admin-accent)]';

/**
 * Дэлгэцийн толгой, хэрэгслийн мөрөнд суух шүүлтүүр. `CONTROL`-той ижил өндөр,
 * хүрээ, фокустай — зөвхөн өргөн нь агуулгаараа тодорхойлогдоно. `SellerAnalytics`
 * өмнө нь энд `h-9` хэрэглэдэг байсан тул хуудас солиход толгойн мөр үсэрдэг байв.
 */
export const FILTER_CONTROL =
  'h-10 rounded-lg border border-[var(--wn-ink-4)] bg-white px-3 text-[14px] font-[600] text-[var(--wn-admin-ink-2)] outline-none focus:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-admin-accent)]';

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, children }) => (
  <div>
    <label className="block text-[12px] font-[700] text-[var(--wn-admin-muted)] mb-1">{label}</label>
    {children}
  </div>
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export const TextField: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <Field label={label}><input {...props} className={`${CONTROL} ${className}`} /></Field>
);

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
  /** Хадгалагдах утга нь `options`-д хэвээр, дэлгэц дээр монгол нэрээр гарна. */
  labels?: Record<string, string>;
};

export const SelectField: React.FC<SelectProps> = ({ label, options, labels, ...props }) => (
  <Field label={label}>
    <select {...props} className={CONTROL}>
      {options.map(option => (
        <option key={option} value={option}>{labels?.[option] ?? option}</option>
      ))}
    </select>
  </Field>
);

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string };

export const TextAreaField: React.FC<TextareaProps> = ({ label, ...props }) => (
  <Field label={label}>
    <textarea
      {...props}
      className="w-full rounded-lg border border-[var(--wn-ink-4)] p-3 text-[14px] font-[500] text-black outline-none focus:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wn-admin-accent)] resize-none"
    />
  </Field>
);