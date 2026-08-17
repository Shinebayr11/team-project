"use client"

import React from 'react';

interface ModalActionButtonProps {
  onClick: () => void;
  enabled: boolean;
  label: string;
  /** Shown instead of `label` when `enabled` is false. */
  disabledLabel?: string;
}

export const ModalActionButton: React.FC<ModalActionButtonProps> = ({
  onClick, enabled, label, disabledLabel = 'Not enough funds',
}) => (
  <button
    onClick={onClick}
    disabled={!enabled}
    className="w-full h-[52px] rounded-xl bg-[var(--wn-accent)] text-white text-[16px] font-[800] hover:bg-[var(--wn-accent-hover)] transition-colors disabled:opacity-50 disabled:bg-[var(--wn-ink-4)]"
  >
    {enabled ? label : disabledLabel}
  </button>
);