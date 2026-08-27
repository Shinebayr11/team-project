"use client"

import React from 'react';

// Хүрээ нь `border-gray-300` биш: цагаан дээр 1.47:1 буюу WCAG SC 1.4.11-ийн
// 3:1-ийг давдаггүй. Талбарын хүрээ бол түүний хил хязгаарыг заадаг цорын ганц
// тэмдэг тул шалгуур хамаарна. Tailwind-ын саарал хэмжүүрт 400 (2.54:1) унаж,
// 500 нь 4.83:1-ээр хэт хүнд харагдана — `--wn-ink-4` 3.38:1-ээр шалгуурыг
// давсан хамгийн цайвар утга бөгөөд `components/ui/input.tsx`-тэй ижил.
const CONTROL = 'w-full h-10 rounded-lg border border-[var(--wn-ink-4)] px-3 text-[14px] font-[500] text-black outline-none focus:border-black';

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, children }) => (
  <div>
    <label className="block text-[12px] font-[700] text-gray-500 mb-1">{label}</label>
    {children}
  </div>
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export const TextField: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <Field label={label}><input {...props} className={`${CONTROL} ${className}`} /></Field>
);

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] };

export const SelectField: React.FC<SelectProps> = ({ label, options, ...props }) => (
  <Field label={label}>
    <select {...props} className={CONTROL}>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </Field>
);

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string };

export const TextAreaField: React.FC<TextareaProps> = ({ label, ...props }) => (
  <Field label={label}>
    <textarea
      {...props}
      className="w-full rounded-lg border border-[var(--wn-ink-4)] p-3 text-[14px] font-[500] text-black outline-none focus:border-black resize-none"
    />
  </Field>
);