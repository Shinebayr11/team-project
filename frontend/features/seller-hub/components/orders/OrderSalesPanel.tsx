"use client"

import React from 'react';
import { MessageSquare, ShoppingBag } from 'lucide-react';
import { ProductThumb } from '@/components/ui/ProductThumb';
import {
  DirectOrder,
  orderBuyer,
  orderBuyerName,
  orderProduct,
  useMySellerOrders,
} from '@/hooks/useMySellerOrders';

const OrderRow: React.FC<{ order: DirectOrder }> = ({ order }) => {
  const product = orderProduct(order);
  const buyer = orderBuyer(order);
  const name = orderBuyerName(buyer);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <ProductThumb product={product} size={44} />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-[700] text-black">
          {product?.name ?? 'Бараа'}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-[var(--wn-admin-muted)]">
          <span className="flex items-center gap-1 font-[600] text-black">
            <ShoppingBag className="size-3.5 text-[var(--wn-admin-accent)]" /> {name}
          </span>
          <span>· {order.quantity} ширхэг</span>
          {order.createdAt && <span>· {new Date(order.createdAt).toLocaleDateString()}</span>}
        </div>
      </div>

      <div className="text-right text-[14px] font-[800] text-black">
        ₮{(order.price_coins ?? 0).toLocaleString()}
      </div>

      {/* Худалдан авагчийн id байхгүй бол чат нээх боломжгүй — хоосон ?user= үүсгэхгүй. */}
      {buyer?._id && (
        <a
          href={`/messages?user=${buyer._id}`}
          className="flex items-center gap-2 rounded-lg bg-[var(--wn-admin-chip)] px-3 py-1.5 text-[13px] font-[700] text-black transition-colors hover:bg-[var(--wn-admin-chip-2)]"
        >
          <MessageSquare className="size-4" /> Зурвас бичих
        </a>
      )}
    </div>
  );
};

/**
 * "Худалдаж авах" товчоор шууд зарагдсан бараа. `AuctionSalesPanel`-тэй адил
 * зарчим — эсрэг тал нь дуудлага худалдаа биш шууд захиалга.
 */
export const OrderSalesPanel: React.FC = () => {
  const { orders, loading, error } = useMySellerOrders();

  if (loading || (!error && orders.length === 0)) return null;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-[18px] font-[800] text-black">Шууд захиалгууд</h2>
        <p className="mt-0.5 text-[14px] font-[500] text-[var(--wn-admin-muted)]">
          "Худалдаж авах" товчоор шууд зарагдсан бараа. Хүргэлт, төлбөрөө
          тохирохын тулд худалдан авагчтайгаа шууд холбогдоно уу.
        </p>
      </div>

      {error ? (
        <p className="text-[14px] font-[600] text-[var(--wn-admin-danger)]">{error}</p>
      ) : (
        <div className="divide-y divide-[var(--wn-admin-row-rule)] overflow-hidden rounded-2xl border border-[var(--wn-admin-card-border)] bg-white shadow-sm">
          {orders.map((order) => (
            <OrderRow key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
