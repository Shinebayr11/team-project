"use client"

import React from 'react';
import { Link } from '@/lib/router';
import { Home, Package, ShoppingBag, Video, BarChart2, Settings } from 'lucide-react';

interface SellerNavProps {
  path: string;
  pendingOrders: number;
  /** Гар утасны хуудаснаас дуудахад цэс сонгосны дараа хаана. */
  onNavigate?: () => void;
}

const NAVS = [
  { label: 'Нүүр', to: '/seller', icon: Home },
  { label: 'Бараа', to: '/seller/products', icon: Package },
  { label: 'Захиалга, хүргэлт', to: '/seller/orders', icon: ShoppingBag, badgeKey: 'pendingOrders' },
  { label: 'Шууд', to: '/seller/shows', icon: Video },
  { label: 'Аналитик', to: '/seller/analytics', icon: BarChart2 },
] as const;

const linkClass = (active: boolean) =>
  `flex items-center justify-between px-3 py-2 rounded-lg text-[14px] font-[600] transition-all relative ${
    active
      ? 'bg-[var(--wn-admin-ink)] text-white'
      : 'text-[var(--wn-admin-ink-2)] hover:bg-[var(--wn-admin-nav-hover)]'
  }`;

export const SellerBrand: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
  <Link to="/home" onClick={onNavigate} className="flex items-center gap-2">
    <span className="font-display text-[20px] font-[800] tracking-[-0.04em] text-black">WhyNot</span>
    <span className="px-2 py-0.5 border border-[var(--wn-admin-card-border)] bg-[var(--wn-admin-row-rule)] rounded-md text-[11px] font-[700] text-[var(--wn-admin-ink-2)] uppercase tracking-wider">
      Sellerhub
    </span>
  </Link>
);

/**
 * Цэсний жагсаалт. Дэлгэц дээрх хажуугийн самбар, гар утасны хуудас хоёулаа
 * ҮҮНИЙГ render хийдэг тул цэс нэг л газар тодорхойлогдоно.
 */
export const SellerNav: React.FC<SellerNavProps> = ({ path, pendingOrders, onNavigate }) => {
  const isActive = (to: string) => (to === '/seller' ? path === to : path.startsWith(to));
  const settingsActive = path === '/seller/settings';

  return (
    <>
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {NAVS.map(nav => {
          const active = isActive(nav.to);
          const badge = 'badgeKey' in nav && pendingOrders > 0 ? String(pendingOrders) : undefined;
          const Icon = nav.icon;

          return (
            <Link key={nav.label} to={nav.to} onClick={onNavigate} className={linkClass(active)}>
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[var(--wn-admin-muted)]'}`} />
                {nav.label}
              </div>
              {badge && (
                <span className={`px-1.5 py-0.5 rounded text-[11px] font-[800] ${active ? 'bg-white/20 text-white' : 'bg-[var(--wn-admin-chip-2)] text-[var(--wn-admin-ink-2)]'}`}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--wn-admin-card-border)] flex flex-col gap-1 shrink-0">
        <Link to="/seller/settings" onClick={onNavigate} className={linkClass(settingsActive)}>
          <div className="flex items-center gap-3">
            <Settings className={`w-4 h-4 ${settingsActive ? 'text-white' : 'text-[var(--wn-admin-muted)]'}`} />
            Тохиргоо
          </div>
        </Link>
      </div>
    </>
  );
};

/**
 * Хажуугийн самбар. 1024px-ээс доош нуугдаж, оронд нь `SellerTopbar`-ын
 * цэсний товчоор нээгддэг хуудас (`SellerHubLayout`) гарна — 240px тогтмол
 * өргөнтэй самбар гар утсан дээр контентыг дэлгэцээс шахаж гаргадаг байв.
 */
export const SellerSidebar: React.FC<Omit<SellerNavProps, 'onNavigate'>> = ({ path, pendingOrders }) => (
  <aside className="hidden lg:flex w-[240px] shrink-0 bg-white border-r border-[var(--wn-admin-card-border)] flex-col h-svh sticky top-0 z-30">
    <div className="h-16 flex items-center px-6 shrink-0">
      <SellerBrand />
    </div>
    <SellerNav path={path} pendingOrders={pendingOrders} />
  </aside>
);
