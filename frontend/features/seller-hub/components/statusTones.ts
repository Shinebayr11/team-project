import { SellerOrder, SellerShow, InventoryProduct } from '@/features/seller-hub/types';
import { StatusTone } from './StatusPill';

export const paymentTone = (status: SellerOrder['paymentStatus']): StatusTone =>
  status === 'PAID' ? 'green' : 'amber';

export const fulfillmentTone = (status: SellerOrder['fulfillmentStatus']): StatusTone => {
  if (status === 'DELIVERED') return 'green';
  if (status === 'SHIPPED') return 'blue';
  if (status === 'CONFIRMED') return 'amber';
  return 'gray';
};

export const showTone = (status: SellerShow['status']): StatusTone => {
  if (status === 'LIVE') return 'red';
  if (status === 'COMPLETED') return 'green';
  if (status === 'SCHEDULED') return 'blue';
  return 'gray';
};

export const productTone = (status: InventoryProduct['status']): StatusTone => {
  if (status === 'ACTIVE') return 'green';
  if (status === 'OUT_OF_STOCK') return 'red';
  if (status === 'ARCHIVED') return 'muted';
  return 'gray';
};

/** Дотоод статус утгыг (`PAID`, `SHIPPED` гэх мэт) хэрэглэгчид харуулах монгол нэрэнд буулгана. */
export const PAYMENT_STATUS_LABELS: Record<SellerOrder['paymentStatus'], string> = {
  PENDING: 'Хүлээгдэж буй',
  PAID: 'Төлөгдсөн',
  REFUNDED: 'Буцаагдсан',
};

export const FULFILLMENT_STATUS_LABELS: Record<SellerOrder['fulfillmentStatus'], string> = {
  PENDING: 'Хүлээгдэж буй',
  CONFIRMED: 'Баталгаажсан',
  SHIPPED: 'Хүргэлтэд гарсан',
  DELIVERED: 'Хүргэгдсэн',
  CANCELLED: 'Цуцлагдсан',
  RETURNED: 'Буцаагдсан',
};

export const SHOW_STATUS_LABELS: Record<SellerShow['status'], string> = {
  DRAFT: 'Ноорог',
  SCHEDULED: 'Товлогдсон',
  STARTING_SOON: 'Удахгүй эхэлнэ',
  LIVE: 'Шууд',
  ENDING: 'Дуусаж байна',
  COMPLETED: 'Дууссан',
  CANCELLED: 'Цуцлагдсан',
};

export const PRODUCT_STATUS_LABELS: Record<InventoryProduct['status'], string> = {
  ACTIVE: 'Идэвхтэй',
  DRAFT: 'Ноорог',
  ARCHIVED: 'Архивласан',
  OUT_OF_STOCK: 'Дууссан',
};
