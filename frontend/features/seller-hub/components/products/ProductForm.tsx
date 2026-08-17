"use client"

import React, { useState } from 'react';
import { PageHeader } from '../PageHeader';
import { Panel } from '../DataCard';
import { TextField, SelectField, TextAreaField } from '../FormField';
import { ProductMediaCard } from './ProductMediaCard';
import { ProductPricingCard } from './ProductPricingCard';
import { ProductDraft, PRODUCT_CATEGORIES } from './productDraft';

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

      <div className="flex gap-6 max-w-[1000px]">
        <div className="flex-1 flex flex-col gap-6">
          <ProductMediaCard />

          <Panel title="Product Details">
            <div className="flex flex-col gap-4">
              <TextField label="Title *" value={draft.name} onChange={e => patch({ name: e.target.value })} />

              <div className="grid grid-cols-2 gap-4">
                <TextField label="SKU *" value={draft.sku} onChange={e => patch({ sku: e.target.value })} />
                <SelectField
                  label="Category *"
                  options={PRODUCT_CATEGORIES}
                  value={draft.category}
                  onChange={e => patch({ category: e.target.value })}
                />
              </div>

              <TextAreaField
                label="Description"
                rows={4}
                value={draft.description}
                onChange={e => patch({ description: e.target.value })}
              />
            </div>
          </Panel>
        </div>

        <div className="w-[320px] shrink-0 flex flex-col gap-6">
          <ProductPricingCard draft={draft} onPatch={patch} />

          <Panel title="Shipping">
            <SelectField label="Shipping Profile *" options={['2lbs (Shoebox)']} defaultValue="2lbs (Shoebox)" />
          </Panel>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 max-w-[1000px] pt-6 border-t border-gray-200">
        <button onClick={onCancel} className="px-5 py-2 rounded-full text-[14px] font-[700] text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </button>
        <button onClick={() => onSave(draft, false)} className="px-5 py-2 rounded-full border border-gray-300 text-[14px] font-[700] text-black hover:bg-gray-50 transition-colors">
          Save Draft
        </button>
        <button onClick={() => onSave(draft, true)} className="px-6 py-2 rounded-full bg-[#C9F73D] text-black text-[14px] font-[800] hover:bg-[#b8e62c] transition-colors">
          Publish
        </button>
      </div>
    </>
  );
};