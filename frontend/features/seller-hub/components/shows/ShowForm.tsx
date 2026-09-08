"use client"

import React, { useState } from 'react';
import { SellerShow } from '@/features/seller-hub/types';
import { PageHeader } from '../PageHeader';
import { TextField, SelectField, TextAreaField, Field } from '../FormField';
import { PRODUCT_CATEGORY_LABELS } from '../products/productDraft';

export interface ShowDraft {
  title: string;
  category: string;
  description: string;
  type: SellerShow['type'];
  scheduledAt: string;
}

interface ShowFormProps {
  onCancel: () => void;
  onCreate: (draft: ShowDraft) => void;
}

const CATEGORIES = ['Vintage Decor', 'Sneakers', 'Trading Cards', 'Other'];
const TYPES: { value: SellerShow['type']; label: string }[] = [
  { value: 'mixed', label: 'Хосолсон (Дуудлага худалдаа ба шууд худалдах)' },
  { value: 'auction', label: 'Зөвхөн дуудлага худалдаа' },
  { value: 'buy_it_now', label: 'Зөвхөн шууд худалдах' },
];

export const emptyShowDraft = (): ShowDraft => ({
  title: '',
  category: CATEGORIES[0],
  description: '',
  type: 'mixed',
  scheduledAt: new Date().toISOString().slice(0, 16),
});

export const ShowForm: React.FC<ShowFormProps> = ({ onCancel, onCreate }) => {
  const [draft, setDraft] = useState<ShowDraft>(emptyShowDraft);
  const patch = (updates: Partial<ShowDraft>) => setDraft(prev => ({ ...prev, ...updates }));

  return (
    <>
      <PageHeader title="Шууд дамжуулалт үүсгэх" onBack={onCancel} />

      <div className="max-w-[600px] bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <TextField label="Шууд дамжуулалтын нэр *" value={draft.title} onChange={e => patch({ title: e.target.value })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Ангилал *"
              options={CATEGORIES}
              labels={PRODUCT_CATEGORY_LABELS}
              value={draft.category}
              onChange={e => patch({ category: e.target.value })}
            />
            <Field label="Шууд дамжуулалтын төрөл *">
              <select
                value={draft.type}
                onChange={e => patch({ type: e.target.value as SellerShow['type'] })}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-[14px] font-[500] text-black outline-none focus:border-black"
              >
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
          </div>

          <TextField
            label="Эхлэх товлосон цаг *"
            type="datetime-local"
            value={draft.scheduledAt}
            onChange={e => patch({ scheduledAt: e.target.value })}
          />

          <TextAreaField
            label="Тайлбар"
            rows={3}
            value={draft.description}
            onChange={e => patch({ description: e.target.value })}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onCancel} className="px-5 py-2 rounded-full text-[14px] font-[700] text-gray-600 hover:bg-gray-100 transition-colors">
              Цуцлах
            </button>
            <button onClick={() => onCreate(draft)} className="px-6 py-2 rounded-full bg-black text-white text-[14px] font-[800] hover:bg-gray-800 transition-colors">
              Ноорог үүсгэх
            </button>
          </div>
        </div>
      </div>
    </>
  );
};