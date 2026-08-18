"use client"

import React from 'react';

interface SettingsTabProps {
  // React 19 types useRef<T>(null) as RefObject<T | null>.
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  onSave: () => void;
}

const NOTIFICATIONS = ['Order updates', 'Followed sellers go live', 'Giveaway results'];

const fieldClass = 'w-full h-[44px] rounded-xl border border-[var(--wn-line-2)] px-4 text-[15px] text-[var(--wn-ink)] outline-none focus:border-[var(--wn-accent)] transition-colors';
const labelClass = 'block text-[13px] font-[700] text-[var(--wn-ink-2)] mb-2';

export const SettingsTab: React.FC<SettingsTabProps> = ({ nameInputRef, onSave }) => (
  <div className="flex flex-col gap-6 max-w-[480px]">
    <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Settings</h2>

    <div>
      <label className={labelClass} htmlFor="displayName">Display Name</label>
      <input id="displayName" ref={nameInputRef} type="text" defaultValue="junglefinds" className={fieldClass} />
    </div>

    <div>
      <label className={labelClass} htmlFor="email">Email Address</label>
      <input id="email" type="email" defaultValue="hello@junglefinds.com" className={fieldClass} />
    </div>

    <div>
      <label className={labelClass} htmlFor="bio">Bio</label>
      <textarea id="bio" rows={3} className="w-full rounded-xl border border-[var(--wn-line-2)] p-4 text-[15px] text-[var(--wn-ink)] outline-none focus:border-[var(--wn-accent)] resize-none transition-colors" />
    </div>

    <div className="h-px bg-[var(--wn-line)] w-full my-2" />

    <div className="flex flex-col gap-4">
      <h3 className="text-[15px] font-[800] text-[var(--wn-ink)]">Notifications</h3>
      {NOTIFICATIONS.map(label => (
        <label key={label} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input type="checkbox" defaultChecked className="peer appearance-none w-5 h-5 rounded border-2 border-[var(--wn-line-3)] checked:border-[var(--wn-accent)] checked:bg-[var(--wn-accent)] transition-colors cursor-pointer" />
            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-[14.5px] font-[500] text-[var(--wn-ink)] group-hover:text-[var(--wn-accent)] transition-colors">{label}</span>
        </label>
      ))}
    </div>

    <button
      onClick={onSave}
      className="mt-4 h-[48px] rounded-xl bg-[var(--wn-ink)] text-white text-[15px] font-[700] hover:bg-[var(--wn-ink-2)] transition-colors"
    >
      Save changes
    </button>
  </div>
);