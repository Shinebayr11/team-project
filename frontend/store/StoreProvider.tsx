"use client"

import React, { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { StoreState } from '../types';
import { StoreContextType } from './types';
import { defaultState, loadState, persistState } from './state';
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

  const value = useMemo<StoreContextType>(() => ({
    state,
    ...createWalletSlice(state, update),
    ...createCartSlice(state, update),
    ...createSocialSlice(state, update),
    ...createMessagesSlice(state, update),
    ...createInventorySlice(update),
    ...createOrdersSlice(update),
    ...createShowsSlice(update),
    ...ui,
  }), [state, update, ui]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};