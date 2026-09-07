"use client"

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { SettingsNav } from '@/features/seller-hub/components/settings/SettingsNav';
import { VerificationPanel } from '@/features/seller-hub/components/settings/VerificationPanel';
import { PayoutsPanel } from '@/features/seller-hub/components/settings/PayoutsPanel';
import { ShopInformationPanel } from '@/features/seller-hub/components/settings/ShopInformationPanel';
import { AccountProfilePanel } from '@/features/seller-hub/components/settings/AccountProfilePanel';
import { PreferencesPanel } from '@/features/seller-hub/components/settings/PreferencesPanel';
import { NotificationsPanel } from '@/features/seller-hub/components/settings/NotificationsPanel';
import { SecurityPanel } from '@/features/seller-hub/components/settings/SecurityPanel';
import { SellingPreferencesPanel } from '@/features/seller-hub/components/settings/SellingPreferencesPanel';
import { ListingSettingsPanel } from '@/features/seller-hub/components/settings/ListingSettingsPanel';
import { ShippingSettingsPanel } from '@/features/seller-hub/components/settings/ShippingSettingsPanel';
import { OrderSettingsPanel } from '@/features/seller-hub/components/settings/OrderSettingsPanel';

const PlaceholderPanel: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 rounded-2xl">
    <Settings className="w-8 h-8 text-gray-400 mb-3" />
    <div className="text-[16px] font-[700] text-black mb-1">Тохиргооны хуудас</div>
    <div className="text-[14px] text-gray-500">Энэ хэсэг одоогоор бэлтгэгдэж байна.</div>
  </div>
);

export const SellerSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('verification');

  const renderPanel = () => {
    if (activeTab === 'profile') return <AccountProfilePanel />;
    if (activeTab === 'preferences') return <PreferencesPanel />;
    if (activeTab === 'notifications') return <NotificationsPanel />;
    if (activeTab === 'security') return <SecurityPanel />;
    if (activeTab === 'verification') return <VerificationPanel />;
    if (activeTab === 'shop') return <ShopInformationPanel />;
    if (activeTab === 'selling') return <SellingPreferencesPanel />;
    if (activeTab === 'listing') return <ListingSettingsPanel />;
    if (activeTab === 'shipping') return <ShippingSettingsPanel />;
    if (activeTab === 'orders') return <OrderSettingsPanel />;
    if (activeTab === 'payouts') return <PayoutsPanel />;
    return <PlaceholderPanel />;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-[1100px]">
      <SettingsNav activeTab={activeTab} onSelect={setActiveTab} />
      <div className="flex-1 pt-2">{renderPanel()}</div>
    </div>
  );
};