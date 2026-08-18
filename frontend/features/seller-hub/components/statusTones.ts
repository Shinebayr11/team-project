import { SellerOrder, SellerShow, InventoryProduct } from '@/features/seller-hub/types';
import { StatusTone } from './StatusPill';

export const paymentTone = (status: SellerOrder['paymentStatus']): StatusTone =>
  status === 'PAID' ? 'green' : 'amber';

export const fulfillmentTone = (status: SellerOrder['fulfillmentStatus']): StatusTone => {
  if (status === 'DELIVERED') return 'green';
  if (status === 'SHIPPED') return 'blue';
  if (status === 'READY_TO_SHIP') return 'amber';
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
