"use client"

import React from 'react';
import { useStore } from '../../store';
import { Modal } from '../ui/Modal';
import { CartLineRow } from './CartLineRow';
import { CartStaticRow } from './CartStaticRow';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-[13px] font-[800] text-[var(--wn-ink-3)] uppercase tracking-wider mb-3">{title}</h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

export const CartModal: React.FC = () => {
  const { state, closeModal, cart, cartTotal, canAfford, setCartQty, removeFromCart, checkoutCart, addToast } = useStore();

  const items = cart();
  const { bids, purchases } = state;
  const total = cartTotal();
  const isEmpty = items.length === 0 && bids.length === 0 && purchases.length === 0;

  const handleCheckout = () => {
    if (!checkoutCart()) return;
    closeModal();
    addToast(`Checked out ${items.length} items for ₮${total.toLocaleString()}`);
  };

  return (
    <Modal title="Your Cart" wide onClose={closeModal}>
      {/* Өндрийн хязгаарыг `ui/Modal.tsx`-ийн бүрхүүл эзэмшинэ (dvh-ээр). */}
      <div className="flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-8">
          {items.length > 0 && (
            <Section title="To Checkout">
              {items.map((line, i) => (
                <CartLineRow
                  key={`${line.seller}-${line.name}`}
                  line={line}
                  onQtyChange={qty => setCartQty(i, qty)}
                  onRemove={() => removeFromCart(i)}
                />
              ))}
            </Section>
          )}

          {bids.length > 0 && (
            <Section title="Active Bids">
              {bids.map(b => (
                <CartStaticRow key={b.id} title={b.title} seller={b.seller} price={b.amount} variant="bid" />
              ))}
            </Section>
          )}

          {purchases.length > 0 && (
            <Section title="Purchased">
              {purchases.map(p => (
                <CartStaticRow key={p.id} title={p.title} seller={p.seller} price={p.price} variant="purchase" />
              ))}
            </Section>
          )}

          {isEmpty && (
            <div className="py-12 text-center text-[15px] font-[600] text-[var(--wn-ink-3)]">Your cart is empty</div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[var(--wn-line)] bg-[var(--wn-surface-4)] shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[16px] font-[700] text-[var(--wn-ink-2)]">Total to pay</span>
              <span className="text-[20px] font-[800] text-[var(--wn-ink)]">₮{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!canAfford(total)}
              className="w-full h-[52px] rounded-xl bg-[var(--wn-accent)] text-white text-[16px] font-[800] hover:bg-[var(--wn-accent-hover)] transition-colors disabled:opacity-50 disabled:bg-[var(--wn-ink-4)]"
            >
              {canAfford(total) ? `Checkout — ₮${total.toLocaleString()}` : 'Not enough funds'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};