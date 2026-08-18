"use client"

import React from 'react';
import {
  User, Sliders, Bell, Shield, CheckCircle2, Store, List, Truck, Package, CreditCard,
} from 'lucide-react';

export interface SettingsLink {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const ACCOUNT_LINKS: SettingsLink[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export const SELLER_LINKS: SettingsLink[] = [
  { id: 'verification', label: 'Verification', icon: CheckCircle2 },
  { id: 'shop', label: 'Shop Information', icon: Store },
  { id: 'selling', label: 'Selling Preferences', icon: Sliders },
  { id: 'listing', label: 'Listing Settings', icon: List },
  { id: 'shipping', label: 'Shipping Settings', icon: Truck },
  { id: 'orders', label: 'Order Settings', icon: Package },
  { id: 'payouts', label: 'Payouts', icon: CreditCard },
];

interface SettingsNavProps {
  activeTab: string;
  onSelect: (id: string) => void;
}

const NavGroup: React.FC<{ title: string; links: SettingsLink[]; activeTab: string; onSelect: (id: string) => void }> = ({
  title, links, activeTab, onSelect,
}) => (
  <div>
    <div className="text-[11px] font-[800] text-gray-400 uppercase tracking-wider mb-3 px-4">{title}</div>
    <div className="flex flex-col gap-1">
      {links.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-[600] transition-all ${
              active
                ? 'bg-white border-2 border-blue-600 text-black shadow-sm'
                : 'border-2 border-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
            {label}
          </button>
        );
      })}
    </div>
  </div>
);

export const SettingsNav: React.FC<SettingsNavProps> = ({ activeTab, onSelect }) => (
  <div className="w-[280px] shrink-0">
    <h1 className="text-[24px] font-[800] text-black mb-2">Account Center</h1>
    <p className="text-[14px] text-gray-500 font-[500] mb-8 leading-relaxed">
      Manage your account, preferences, payments, and seller settings.
    </p>

    <div className="mb-8">
      <NavGroup title="Account" links={ACCOUNT_LINKS} activeTab={activeTab} onSelect={onSelect} />
    </div>
    <NavGroup title="Seller" links={SELLER_LINKS} activeTab={activeTab} onSelect={onSelect} />
  </div>
);