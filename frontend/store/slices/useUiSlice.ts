"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ModalState, ToastState, UiSlice } from '../types';
import { makeId } from '../state';

const TOAST_MS = 2600;

/** Modal + toast state. A hook rather than a factory because it owns its own React state. */
export const useUiSlice = (): UiSlice => {
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const addToast = useCallback((msg: string) => {
    const id = makeId('t_');
    setToasts(prev => [...prev, { id, msg }]);
    timers.current.push(setTimeout(
      () => setToasts(prev => prev.filter(t => t.id !== id)),
      TOAST_MS,
    ));
  }, []);

  const openModal = useCallback((type: ModalState['type'], data?: any) => setModal({ type, data }), []);
  const closeModal = useCallback(() => setModal({ type: null }), []);

  // Stable identity so the provider's context value only changes when UI state does.
  return useMemo(
    () => ({ modal, openModal, closeModal, toasts, addToast }),
    [modal, toasts, openModal, closeModal, addToast],
  );
};