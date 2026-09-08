"use client"

import React, { useState } from 'react';
import { SettingsNav } from '@/features/seller-hub/components/settings/SettingsNav';
import { ShopInformationPanel } from '@/features/seller-hub/components/settings/ShopInformationPanel';
import { AccountProfilePanel } from '@/features/seller-hub/components/settings/AccountProfilePanel';
import { PreferencesPanel } from '@/features/seller-hub/components/settings/PreferencesPanel';
import { NotificationsPanel } from '@/features/seller-hub/components/settings/NotificationsPanel';
import { SecurityPanel } from '@/features/seller-hub/components/settings/SecurityPanel';
import { SellingPreferencesPanel } from '@/features/seller-hub/components/settings/SellingPreferencesPanel';
import { ShippingSettingsPanel } from '@/features/seller-hub/components/settings/ShippingSettingsPanel';
import { OrderSettingsPanel } from '@/features/seller-hub/components/settings/OrderSettingsPanel';

/**
 * Таб бүр панельтай — `SettingsNav`-ын id-нууд ЭНЭ жагсаалттай яг таарна.
 * Өмнө нь таарахгүй тохиолдолд «бэлтгэгдэж байна» гэсэн орлуулагч гардаг байсан
 * ч ямар ч таб түүн рүү хүрдэггүй байв.
 */
const PANELS: Record<string, React.FC> = {
  profile: AccountProfilePanel,
  preferences: PreferencesPanel,
  notifications: NotificationsPanel,
  security: SecurityPanel,
  shop: ShopInformationPanel,
  selling: SellingPreferencesPanel,
  shipping: ShippingSettingsPanel,
  orders: OrderSettingsPanel,
};

export const SellerSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const Panel = PANELS[activeTab] ?? AccountProfilePanel;

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-[1100px]">
      <SettingsNav activeTab={activeTab} onSelect={setActiveTab} />
      <div className="flex-1 pt-2"><Panel /></div>
    </div>
  );
};
