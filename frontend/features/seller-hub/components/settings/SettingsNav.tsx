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
  { id: 'profile', label: 'Профайл', icon: User },
  { id: 'preferences', label: 'Тохиргоо', icon: Sliders },
  { id: 'notifications', label: 'Мэдэгдэл', icon: Bell },
  { id: 'security', label: 'Аюулгүй байдал', icon: Shield },
];

export const SELLER_LINKS: SettingsLink[] = [
  { id: 'verification', label: 'Баталгаажуулалт', icon: CheckCircle2 },
  { id: 'shop', label: 'Дэлгүүрийн мэдээлэл', icon: Store },
  { id: 'selling', label: 'Худалдааны тохиргоо', icon: Sliders },
  { id: 'listing', label: 'Барааны жагсаалтын тохиргоо', icon: List },
  { id: 'shipping', label: 'Хүргэлтийн тохиргоо', icon: Truck },
  { id: 'orders', label: 'Захиалгын тохиргоо', icon: Package },
  { id: 'payouts', label: 'Төлбөр тооцоо', icon: CreditCard },
];

interface SettingsNavProps {
  activeTab: string;
  onSelect: (id: string) => void;
}

const NavGroup: React.FC<{ title: string; links: SettingsLink[]; activeTab: string; onSelect: (id: string) => void }> = ({
  title, links, activeTab, onSelect,
}) => (
  <div>
    <div className="text-[11px] font-[800] text-[var(--wn-admin-muted)] uppercase tracking-wider mb-3 px-4">{title}</div>
    <div className="flex flex-col gap-1">
      {links.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-[600] transition-all ${
              active
                ? 'bg-[var(--wn-admin-ink)] text-white'
                : 'text-[var(--wn-admin-ink-2)] hover:bg-[var(--wn-admin-nav-hover)]'
            }`}
          >
            <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[var(--wn-admin-muted)]'}`} />
            {label}
          </button>
        );
      })}
    </div>
  </div>
);

export const SettingsNav: React.FC<SettingsNavProps> = ({ activeTab, onSelect }) => (
  <div className="w-full lg:w-[320px] lg:shrink-0">
    <h1 className="text-[24px] font-[800] text-black mb-2">Хэрэглэгчийн төв</h1>
    <p className="text-[14px] text-[var(--wn-admin-muted)] font-[500] mb-8 leading-relaxed">
      Бүртгэл, тохиргоо, төлбөр болон худалдагчийн тохиргоогоо удирдана уу.
    </p>

    <div className="mb-8">
      <NavGroup title="Бүртгэл" links={ACCOUNT_LINKS} activeTab={activeTab} onSelect={onSelect} />
    </div>
    <NavGroup title="Худалдагч" links={SELLER_LINKS} activeTab={activeTab} onSelect={onSelect} />
  </div>
);