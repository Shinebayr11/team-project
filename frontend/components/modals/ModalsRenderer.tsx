"use client"

import React from 'react';
import { useStore } from '../../store';
import { BuyModal, BuyModalData } from './BuyModal';
import { BidModal, BidModalData } from './BidModal';
import { CartModal } from './CartModal';
import { GiveawayModal, GiveawayModalData } from './GiveawayModal';

/** Single mount point for every global modal; each type owns its own component. */
export const ModalsRenderer: React.FC = () => {
  const { modal } = useStore();

  switch (modal.type) {
    case 'buy':
      return <BuyModal data={modal.data as BuyModalData} />;
    case 'bid':
      return <BidModal data={modal.data as BidModalData} />;
    case 'cart':
      return <CartModal />;
    case 'giveaway':
      return <GiveawayModal data={modal.data as GiveawayModalData} />;
    default:
      return null;
  }
};