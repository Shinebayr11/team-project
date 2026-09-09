"use client"

import React, { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { SellerShow } from '@/features/seller-hub/types';
import { PageHeader } from '../PageHeader';
import { CONTROL, TextField, SelectField, TextAreaField, Field } from '../FormField';
import { PRODUCT_CATEGORY_LABELS } from '../products/productDraft';
import { ShowPreview } from './ShowPreview';
import { btn } from "@/features/seller-hub/components/buttons"
import {
  SHOW_TYPES,
  defaultScheduledAt,
  humanWhen,
  schedulePresets,
  toLocalInput,
  untilLabel,
} from './showSchedule';

export interface ShowDraft {
  title: string;
  category: string;
  description: string;
  type: SellerShow['type'];
  scheduledAt: string;
}

interface ShowFormProps {
  onCancel: () => void;
  /** `status` нь ямар товч дарснаас шалтгаална — товлосон эсвэл ноорог. */
  onCreate: (draft: ShowDraft, status: 'SCHEDULED' | 'DRAFT') => void;
}

const CATEGORIES = ['Vintage Decor', 'Sneakers', 'Trading Cards', 'Other'];

export const emptyShowDraft = (): ShowDraft => ({
  title: '',
  category: CATEGORIES[0],
  description: '',
  type: 'mixed',
  scheduledAt: toLocalInput(defaultScheduledAt()),
});

/**
 * Шууд дамжуулалт үүсгэх.
 *
 * Энэ маягтын МӨН ЧАНАР нь «би ХЭЗЭЭ эфирт орох вэ» гэдгийг зарлах явдал —
 * худалдан авагчид тэр цагийг хүлээж ирнэ. Өмнө нь цаг нь нэр, ангилал,
 * тайлбарын дунд ялгаагүй жижиг талбар байсан бөгөөд бүр дор нь:
 *
 *   • анхны утга нь ОДОО байсан тул илгээх үед аль хэдийн өнгөрсөн байдаг,
 *     өнгөрсөн цагийг барих шалгалт ч байхгүй байв;
 *   • ямар товч дарсан ч төлөв нь ҮРГЭЛЖ `DRAFT` — өөрөөр хэлбэл маягт цагийг
 *     асуугаад утгыг нь хаядаг байлаа. Товлохын тулд худалдагч дараа нь
 *     дамжуулалтаа нээж «Шууд дамжуулалт товлох» дарах ёстой байсан тул
 *     `SCHEDULED` таб руу энэ замаар хэзээ ч хүрдэггүй.
 *
 * Одоо цаг нь маягтын эхний бөгөөд хамгийн том хэсэг, гурван товчоор оройн
 * цагаа сонгоно, өнгөрсөн цаг илгээгдэхгүй, «Товлох» нь жинхэнэ товлоно.
 */
export const ShowForm: React.FC<ShowFormProps> = ({ onCancel, onCreate }) => {
  const [draft, setDraft] = useState<ShowDraft>(emptyShowDraft);
  const [presets] = useState(schedulePresets);
  const patch = (updates: Partial<ShowDraft>) => setDraft(prev => ({ ...prev, ...updates }));

  const when = new Date(draft.scheduledAt);
  const valid = !Number.isNaN(when.getTime());
  const until = valid ? untilLabel(when) : null;
  const titled = draft.title.trim().length > 0;

  return (
    <>
      <PageHeader title="Шууд дамжуулалт үүсгэх" onBack={onCancel} />

      {/* Маягт 600px-ээс хэтрэхгүй байх нь зөв (урт мөр уншихад хэцүү) ч
          өргөн дэлгэц дээр баруун тал нь бүтэн хоосон үлддэг байв. Тэр зайд
          худалдан авагчийн харах карт орно — чимэглэл биш, худалдагч юу
          зарлаж байгаагаа бичиж байхдаа шууд хардаг. 1280px-ээс доош доошоо
          жагсана. */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,600px)_minmax(260px,320px)]">
      <div className="self-start rounded-2xl border border-[var(--wn-admin-card-border)] bg-white shadow-sm">
        {/* ── Хэзээ. Энэ дамжуулалтыг дамжуулалт болгож байгаа зүйл. ── */}
        <div className="flex flex-col gap-4 border-b border-[var(--wn-admin-row-rule)] p-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-[var(--wn-admin-muted)]" />
            <h2 className="text-[16px] font-[800] text-black">Цаг товлох</h2>
          </div>

          {presets.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {presets.map(({ label, value }) => {
                const chosen = draft.scheduledAt === toLocalInput(value);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => patch({ scheduledAt: toLocalInput(value) })}
                    aria-pressed={chosen}
                    className={`rounded-full px-4 py-2 text-[13px] font-[700] transition-colors ${
                      chosen
                        ? 'bg-[var(--wn-admin-ink)] text-white'
                        : 'bg-[var(--wn-admin-chip)] text-[var(--wn-admin-ink-2)] hover:bg-[var(--wn-admin-chip-2)]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <input
            type="datetime-local"
            aria-label="Эхлэх товлосон цаг"
            value={draft.scheduledAt}
            min={toLocalInput(new Date())}
            onChange={e => patch({ scheduledAt: e.target.value })}
            className={CONTROL}
          />

          {/* Түүхий `2026-09-15T20:00` нь ямар гараг, хэр удаагүй болохыг
              хэлдэггүй — товлолтод хамгийн чухал нь яг тэр хоёр. */}
          {until ? (
            <div>
              <div className="text-[18px] font-[800] tracking-tight text-black">{humanWhen(when)}</div>
              <div className="mt-0.5 text-[13px] font-[600] text-[var(--wn-admin-muted)]">{until}</div>
            </div>
          ) : (
            <p className="text-[13px] font-[600] text-[var(--wn-admin-danger)]">
              Товлолт ирээдүйн цаг байх ёстой.
            </p>
          )}
        </div>

        {/* ── Юуны тухай. ── */}
        <div className="flex flex-col gap-5 p-6">
          <TextField
            label="Шууд дамжуулалтын нэр *"
            placeholder="Жишээ нь: Винтаж чимэглэлийн шөнө"
            value={draft.title}
            onChange={e => patch({ title: e.target.value })}
          />

          <SelectField
            label="Ангилал *"
            options={CATEGORIES}
            labels={PRODUCT_CATEGORY_LABELS}
            value={draft.category}
            onChange={e => patch({ category: e.target.value })}
          />

          <Field label="Худалдааны хэлбэр *">
            <div className="flex flex-col gap-2">
              {SHOW_TYPES.map(({ value, label, hint }) => {
                const chosen = draft.type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => patch({ type: value })}
                    aria-pressed={chosen}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      chosen
                        ? 'border-[var(--wn-admin-ink)] bg-[var(--wn-admin-row-rule)]'
                        : 'border-[var(--wn-ink-4)] hover:bg-[var(--wn-admin-row-rule)]'
                    }`}
                  >
                    <div className="text-[14px] font-[800] text-black">{label}</div>
                    <div className="mt-0.5 text-[13px] font-[500] text-[var(--wn-admin-muted)]">{hint}</div>
                  </button>
                );
              })}
            </div>
          </Field>

          <TextAreaField
            label="Тайлбар"
            rows={3}
            placeholder="Юу зарахаа товчхон бичвэл худалдан авагчид шийдэхэд амар."
            value={draft.description}
            onChange={e => patch({ description: e.target.value })}
          />
        </div>

        {/* Хоёр гарц хоёулаа үнэн: товлобол `SCHEDULED` таб руу орж, худалдан
            авагчид цагийг харна; ноорог нь цаг нь тодороогүй үед л хэрэгтэй. */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--wn-admin-row-rule)] p-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-full text-[14px] font-[700] text-[var(--wn-admin-ink-2)] hover:bg-[var(--wn-admin-nav-hover)] transition-colors"
          >
            Цуцлах
          </button>
          <button
            type="button"
            onClick={() => onCreate(draft, 'DRAFT')}
            disabled={!titled}
            className={btn("outline", "pillWide")}
          >
            Ноорог болгох
          </button>
          <button
            type="button"
            onClick={() => onCreate(draft, 'SCHEDULED')}
            disabled={!titled || !until}
            className={btn("ink", "pillWide")}
          >
            Товлох
          </button>
        </div>
      </div>

        {/* Sticky нь grid item ӨӨР ДЭЭР нь ажиллахгүй: стретч болсон item аль
            хэдийн мөрийн бүтэн өндөртэй тул наахад юу ч өөрчлөгдөхгүй, дотор
            нь суусан карт нь item-ийнхээ дээд ирмэгтэй хамт гүйнэ. Наалддаг нь
            ХҮҮ элемент байх ёстой. */}
        <div>
          <div className="xl:sticky xl:top-24">
            <ShowPreview
              title={draft.title}
              category={draft.category}
              type={draft.type}
              when={valid ? when : null}
            />
          </div>
        </div>
      </div>
    </>
  );
};
