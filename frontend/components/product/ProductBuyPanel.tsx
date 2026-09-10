"use client"

import React from 'react';
import { Link } from '@/lib/router';
import { Truck, Package } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { QuantityStepper } from './QuantityStepper';
import { ProductActions } from './ProductActions';
import { ShopProduct, ProductSeller, productShopName, shopKeyOf } from '@/hooks/useProduct';

interface ProductBuyPanelProps {
  product: ShopProduct;
  seller: ProductSeller | null;
  qty: number;
  onQtyChange: (qty: number) => void;
  onBuy: () => void;
  onAddToCart: () => void;
  /**
   * Дуудлага худалдаа явж байвал үнэ, тоо ширхэг, худалдан авах товчийг ЭНЭ
   * ОРЛУУЛНА — тогтсон үнээр авах, санал өгөх хоёр зэрэг байвал худалдан
   * авагч алийг нь хийж байгаагаа ойлгохгүй.
   */
  auction?: React.ReactNode;
}

export const ProductBuyPanel: React.FC<ProductBuyPanelProps> = ({
  product, seller, qty, onQtyChange, onBuy, onAddToCart, auction,
}) => {
  const shop = productShopName(seller);
  const shopKey = shopKeyOf(seller);
  const price = product.price_coins ?? 0;
  const stock = product.stock_quantity ?? 0;
  const soldOut = stock <= 0 || product.status === 'OUT_OF_STOCK';

  return (
    <div className="flex w-full flex-col lg:w-[420px] lg:shrink-0">
      {shopKey ? (
        <Link to={`/shop?seller=${encodeURIComponent(shopKey)}`} className="group mb-6 flex items-center gap-3">
          <Avatar name={shop} tint="var(--wn-accent-soft)" className="!text-[var(--wn-accent)]" />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-[700] text-[var(--wn-ink)] transition-colors group-hover:text-[var(--wn-accent)]">
              {shop}
            </div>
            {product.category && (
              <div className="text-[12px] font-[600] tracking-wider text-[var(--wn-ink-4)] uppercase">
                {product.category}
              </div>
            )}
          </div>
        </Link>
      ) : (
        <div className="mb-6 flex items-center gap-3">
          <Avatar name={shop} tint="var(--wn-accent-soft)" className="!text-[var(--wn-accent)]" />
          <div className="text-[15px] font-[700] text-[var(--wn-ink)]">{shop}</div>
        </div>
      )}

      <h1 className="mb-4 text-[20px] leading-tight font-[800] break-words text-[var(--wn-ink)] sm:text-[25px]">
        {product.name}
      </h1>

      {auction ?? (
        <>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[var(--wn-accent)] text-[14px] font-[700] text-white">₮</div>
            <span className="text-[26px] font-[800] tracking-tight text-[var(--wn-ink)] sm:text-[32px]">
              {price.toLocaleString()}
            </span>
          </div>

          {/* Нөөц нь жинхэнэ тоо — «Дууссан» гэдэг нь таамаг биш өгөгдөл. */}
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-[600] ${
              soldOut
                ? 'bg-[var(--wn-live-soft)] text-[var(--wn-live-deep)]'
                : 'bg-[var(--wn-surface-2)] text-[var(--wn-ink-2)]'
            }`}
          >
            {soldOut ? (
              <>
                <Package className="size-5" /> Энэ бараа дууссан байна
              </>
            ) : (
              <>
                <Truck className="size-5 text-[var(--wn-ink-3)]" /> Нөөцөд {stock} ширхэг · 1–2 хоногт илгээнэ
              </>
            )}
          </div>

          {!soldOut && <QuantityStepper qty={qty} onChange={onQtyChange} max={Math.min(stock, 9)} />}

          <ProductActions price={price} qty={qty} soldOut={soldOut} onBuy={onBuy} onAddToCart={onAddToCart} />
        </>
      )}

      {product.description && (
        <>
          <div className="mb-6 h-px w-full bg-[var(--wn-line)]" />
          <p className="text-[15px] leading-relaxed whitespace-pre-line text-[var(--wn-ink-2)]">
            {product.description}
          </p>
        </>
      )}
    </div>
  );
};
