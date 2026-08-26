"use client"

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { SettingsNav } from '@/features/seller-hub/components/settings/SettingsNav';
import { VerificationPanel } from '@/features/seller-hub/components/settings/VerificationPanel';
import { PayoutsPanel } from '@/features/seller-hub/components/settings/PayoutsPanel';

const PlaceholderPanel: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 rounded-2xl">
    <Settings className="w-8 h-8 text-gray-400 mb-3" />
    <div className="text-[16px] font-[700] text-black mb-1">Settings Page</div>
    <div className="text-[14px] text-gray-500">This section is under construction.</div>
  </div>
);

export const SellerSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('verification');

  const renderPanel = () => {
    if (activeTab === 'verification') return <VerificationPanel />;
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