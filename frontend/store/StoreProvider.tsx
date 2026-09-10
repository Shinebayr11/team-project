"use client"

import React, { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { StoreState } from '../types';
import { StoreContextType } from './types';
import { defaultState, loadState, persistState } from './state';
import { useApiClient } from '@/hooks/useApiClient';
import { createWalletSlice } from './slices/walletSlice';
import { createCartSlice } from './slices/cartSlice';
import { createSocialSlice } from './slices/socialSlice';
import { createMessagesSlice } from './slices/messagesSlice';
// Seller Hub owns these three slices; the provider only composes them.
import { createInventorySlice } from '@/features/seller-hub/store/inventorySlice';
import { createOrdersSlice } from '@/features/seller-hub/store/ordersSlice';
import { createShowsSlice } from '@/features/seller-hub/store/showsSlice';
import { useUiSlice } from './slices/useUiSlice';

export const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Server render and first client render must agree, so localStorage is read
  // after mount rather than in the useState initialiser.
  const [state, setState] = useState<StoreState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const ui = useUiSlice();
  const { callApi } = useApiClient();

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persistState(state);
  }, [hydrated, state]);

  const update = useCallback(
    (updater: (prev: StoreState) => StoreState) => setState(prev => updater(prev)),
    [],
  );

  /**
   * ЗӨВХӨН `update`-аас хамаардаг slice-ууд тусдаа memo-д сууна.
   *
   * Тэднийг `state`-тэй нэг memo дотор үүсгэвэл төлөв өөрчлөгдөх бүрд
   * функцүүд нь ШИНЭ ишлэл болдог. `setInventory` яг ийм байсан бөгөөд
   * үүнээс болж Seller Hub төгсгөлгүй давталтад ордог байв:
   *
   *   setInventory шинэ ишлэл → useRefreshInventory-ийн useCallback шинэчлэгдэнэ
   *   → useInventoryHydration-ийн effect дахин ажиллана → /api/product/mine
   *   → setInventory дуудагдаж төлөв өөрчлөгдөнө → эхнээсээ.
   *
   * Хэмжихэд ачаалж дууссан хуудас 6 секундэд 12 хүсэлт явуулж, хэзээ ч
   * зогсдоггүй байлаа. Одоо эдгээр функц насан туршдаа тогтвортой.
   */
  const writers = useMemo(() => ({
    ...createInventorySlice(update),
    ...createOrdersSlice(update),
    ...createShowsSlice(update),
  }), [update]);

  const value = useMemo<StoreContextType>(() => ({
    state,
    ...createWalletSlice(state, update),
    ...createCartSlice(state, update, callApi),
    ...createSocialSlice(state, update),
    ...createMessagesSlice(state, update),
    ...writers,
    ...ui,
  }), [state, update, writers, ui, callApi]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};