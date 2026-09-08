"use client"

import React, { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { Panel } from '../DataCard';
import { TextField, SelectField, TextAreaField } from '../FormField';
import { ProductMediaCard } from './ProductMediaCard';
import { ProductPricingCard } from './ProductPricingCard';
import { ProductDraft, PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from './productDraft';
import { btn } from "@/features/seller-hub/components/buttons"

interface ProductFormProps {
  title: string;
  initialDraft: ProductDraft;
  onCancel: () => void;
  onSave: (draft: ProductDraft, publish: boolean) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ title, initialDraft, onCancel, onSave }) => {
  const [draft, setDraft] = useState<ProductDraft>(initialDraft);
  const patch = (updates: Partial<ProductDraft>) => setDraft(prev => ({ ...prev, ...updates }));

  return (
    <>
      <PageHeader title={title} onBack={onCancel} />

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1100px]">
        <div className="flex-1 flex flex-col gap-6">
          <ProductMediaCard
            images={draft.images}
            onChange={(images) => patch({ images })}
          />

          <Panel title="Барааны дэлгэрэнгүй">
            <div className="flex flex-col gap-4">
              <TextField label="Гарчиг *" value={draft.name} onChange={e => patch({ name: e.target.value })} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField label="SKU *" value={draft.sku} onChange={e => patch({ sku: e.target.value })} />
                <SelectField
                  label="Ангилал *"
                  options={PRODUCT_CATEGORIES}
                  labels={PRODUCT_CATEGORY_LABELS}
                  value={draft.category}
                  onChange={e => patch({ category: e.target.value })}
                />
              </div>

              <TextAreaField
                label="Тайлбар"
                rows={4}
                value={draft.description}
                onChange={e => patch({ description: e.target.value })}
              />
            </div>
          </Panel>
        </div>

        <div className="w-full lg:w-[320px] lg:shrink-0 flex flex-col gap-6">
          <ProductPricingCard draft={draft} onPatch={patch} />

          <Panel title="Хүргэлт">
            <SelectField label="Хүргэлтийн профайл *" options={['2кг (Хайрцаг)']} defaultValue="2кг (Хайрцаг)" />
          </Panel>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 max-w-[1100px] pt-6 border-t border-[var(--wn-admin-card-border)]">
        <button onClick={onCancel} className="px-5 py-2 rounded-full text-[14px] font-[700] text-[var(--wn-admin-ink-2)] hover:bg-[var(--wn-admin-nav-hover)] transition-colors">
          Цуцлах
        </button>
        <button onClick={() => onSave(draft, false)} className={btn("outline", "pill")}>
          Ноорогт хадгалах
        </button>
        <button onClick={() => onSave(draft, true)} className={btn("lime", "pillWide")}>
          Нийтлэх
        </button>
      </div>
    </>
  );
};