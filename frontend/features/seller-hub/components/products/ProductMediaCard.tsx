"use client"

import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { isImageUploadReady, uploadImage } from '@/lib/cloudinary';
import { Panel } from '../DataCard';

interface ProductMediaCardProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const MAX_IMAGES = 6;

/**
 * Барааны зураг. Файл сонгогч нь компьютер, утас хоёуланд ажиллана —
 * `accept="image/*"` гар утсан дээр камер/галерейг өөрөө санал болгодог тул
 * тусдаа "утаснаас" гэсэн зам хэрэггүй.
 *
 * Зургууд Cloudinary руу шууд хөтчөөс очиж, зөвхөн хаяг нь бараанд хадгалагдана —
 * store нь localStorage-д бичигддэг тул base64 хадгалбал багтаамж дүүрнэ.
 */
export const ProductMediaCard: React.FC<ProductMediaCardProps> = ({ images, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadReady = isImageUploadReady();
  const remaining = MAX_IMAGES - images.length;

  const pickFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    setError(null);

    const uploaded: string[] = [];
    try {
      // Нэг нэгээр нь илгээнэ — аль нэг нь бүтэлгүйтвэл өмнөх нь хэвээр үлдэнэ.
      for (const file of Array.from(files).slice(0, remaining)) {
        uploaded.push(await uploadImage(file));
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Зураг байршуулж чадсангүй');
    } finally {
      if (uploaded.length) onChange([...images, ...uploaded]);
      setUploading(false);
      // Ижил файлыг дахин сонгоход өөрчлөлт бүртгэгдэхийн тулд цэвэрлэнэ.
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Panel title="Зураг">
      {!uploadReady ? (
        <p className="text-[13px] font-[600] text-[var(--wn-admin-muted)]">
          Зураг байршуулах тохиргоо хийгдээгүй байна.
        </p>
      ) : (
        <>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || remaining <= 0}
              className="w-[100px] h-[100px] shrink-0 rounded-xl border-2 border-dashed border-[var(--wn-ink-4)] flex flex-col items-center justify-center text-[var(--wn-admin-muted)] hover:bg-[var(--wn-admin-row-rule)] hover:border-[var(--wn-ink-4)] transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 mb-1 animate-spin" />
              ) : (
                <ImagePlus className="w-6 h-6 mb-1" />
              )}
              <span className="text-[12px] font-[600]">
                {uploading ? 'Байршуулж байна' : 'Зураг сонгох'}
              </span>
            </button>

            {images.map((url, index) => (
              <div
                key={url}
                className="w-[100px] h-[100px] shrink-0 rounded-xl bg-[var(--wn-admin-chip)] border border-[var(--wn-admin-card-border)] relative"
              >
                {/* Cloudinary-ийн хаяг тул next/image-ийн домэйн тохиргоо
                    шаардахгүйн тулд энгийн <img> ашиглав. */}
                <img
                  src={url}
                  alt={`Барааны зураг ${index + 1}`}
                  className="w-full h-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => onChange(images.filter((item) => item !== url))}
                  aria-label={`${index + 1}-р зургийг устгах`}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-[var(--wn-admin-card-border)] shadow-sm flex items-center justify-center text-[var(--wn-admin-muted)] hover:text-black"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => pickFiles(event.target.files)}
          />

          {error ? (
            <p className="mt-2 text-[13px] font-[600] text-[var(--wn-admin-danger)]">{error}</p>
          ) : (
            <p className="mt-2 text-[13px] text-[var(--wn-admin-muted)]">
              JPG, PNG, WEBP, GIF · 5MB хүртэл · {images.length}/{MAX_IMAGES} зураг.
              Эхний зураг нь жагсаалтад харагдана.
            </p>
          )}
        </>
      )}
    </Panel>
  );
};
