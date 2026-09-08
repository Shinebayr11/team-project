"use client"

import React from 'react';
import { MessageSquare, Trophy } from 'lucide-react';
import { ProductThumb } from '@/components/ui/ProductThumb';
import {
  AuctionSale,
  saleProduct,
  saleShow,
  saleWinner,
  useMySales,
  winnerName,
} from '@/hooks/useMySales';

const SaleRow: React.FC<{ sale: AuctionSale }> = ({ sale }) => {
  const product = saleProduct(sale);
  const winner = saleWinner(sale);
  const show = saleShow(sale);
  const name = winnerName(winner);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <ProductThumb product={product} size={44} />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-[700] text-black">
          {product?.name ?? 'Бараа'}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px] text-gray-500">
          <span className="flex items-center gap-1 font-[600] text-black">
            <Trophy className="size-3.5 text-[#B9791F]" /> {name}
          </span>
          {show?.title && <span>· {show.title}</span>}
          {sale.updatedAt && <span>· {new Date(sale.updatedAt).toLocaleDateString()}</span>}
        </div>
      </div>

      <div className="text-right text-[14px] font-[800] text-black">
        ₮{(sale.current_highest_bid_coins ?? 0).toLocaleString()}
      </div>

      {/* Ялагчийн id байхгүй бол чат нээх боломжгүй — хоосон ?user= үүсгэхгүй. */}
      {winner?._id && (
        <a
          href={`/messages?user=${winner._id}`}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-[13px] font-[700] text-black transition-colors hover:bg-gray-200"
        >
          <MessageSquare className="size-4" /> Зурвас бичих
        </a>
      )}
    </div>
  );
};

/**
 * Дуудлага худалдаагаар зарагдсан лотууд. Шууд дамжуулалт дээрх "Ялагч" тууз
 * дараагийн лот гармагц алга болдог тул худалдагч ялагчтайгаа холбогдох
 * тогтмол зам энд байна.
 */
export const AuctionSalesPanel: React.FC = () => {
  const { sales, loading, error } = useMySales();

  if (loading || (!error && sales.length === 0)) return null;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-[18px] font-[800] text-black">Дуудлага худалдааны ялагчид</h2>
        <p className="mt-0.5 text-[14px] font-[500] text-gray-500">
          Хүргэлт, төлбөрөө тохирохын тулд ялагчтайгаа шууд холбогдоно уу.
        </p>
      </div>

      {error ? (
        <p className="text-[14px] font-[600] text-red-600">{error}</p>
      ) : (
        <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {sales.map((sale) => (
            <SaleRow key={sale._id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
};
