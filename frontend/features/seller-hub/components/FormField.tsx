"use client"

import React from 'react';

const CONTROL = 'w-full h-10 rounded-lg border border-gray-300 px-3 text-[14px] font-[500] text-black outline-none focus:border-black';

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
      className="w-full rounded-lg border border-gray-300 p-3 text-[14px] font-[500] text-black outline-none focus:border-black resize-none"
    />
  </Field>
);