"use client"

import React from 'react';
import { Package, Heart, Users, Settings, CreditCard, MapPin, LogOut } from 'lucide-react';

export type ProfileTab =
  | 'overview' | 'purchases' | 'saved' | 'following'
  | 'settings' | 'payment' | 'addresses';

interface ProfileSidebarProps {
  activeTab: string;
  onSelect: (tab: ProfileTab) => void;
  onEditProfile: () => void;
}

const NAV_GROUPS: { section: string; items: { id: ProfileTab; label: string; icon: React.ElementType }[] }[] = [
  {
    section: 'Buying',
    items: [
      { id: 'overview', label: 'Overview', icon: Package },
      { id: 'purchases', label: 'Purchases', icon: Package },
      { id: 'saved', label: 'Saved', icon: Heart },
      { id: 'following', label: 'Following', icon: Users },
    ],
  },
  {
    section: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'payment', label: 'Payment Methods', icon: CreditCard },
      { id: 'addresses', label: 'Shipping Addresses', icon: MapPin },
    ],
  },
];

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onSelect, onEditProfile }) => (
  <aside className="w-[240px] shrink-0 flex flex-col gap-8">
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-[#E6E6EE] flex items-center justify-center text-[32px] font-[700] text-[var(--wn-ink)] mb-4">J</div>
      <h1 className="text-[20px] font-[800] text-[var(--wn-ink)] leading-tight">John Doe</h1>
      <div className="text-[14px] text-[var(--wn-ink-3)] font-[500] mb-4">@johndoe</div>
      <button
        onClick={onEditProfile}
        className="w-full py-2 rounded-full border border-[var(--wn-line-2)] text-[13px] font-[700] text-[var(--wn-ink)] hover:bg-[var(--wn-surface-2)] transition-colors"
      >
        Edit Profile
      </button>
    </div>

    <div className="flex flex-col gap-6">
      {NAV_GROUPS.map(group => (
        <div key={group.section}>
          <div className="text-[11px] font-[800] tracking-wider text-[var(--wn-ink-4)] uppercase mb-2 px-3">{group.section}</div>
          <nav className="flex flex-col gap-1">
            {group.items.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] font-[600] transition-colors ${
                  activeTab === id
                    ? 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)]'
                    : 'text-[var(--wn-ink-2)] hover:bg-[var(--wn-surface-2)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      ))}

      <div className="pt-4 border-t border-[var(--wn-line)]">
        <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] font-[600] text-red-600 hover:bg-red-50 transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  </aside>
);