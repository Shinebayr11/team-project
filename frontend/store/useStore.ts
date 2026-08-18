"use client"

import { useContext } from 'react';
import { StoreContext } from './StoreProvider';
import { StoreContextType } from './types';

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};