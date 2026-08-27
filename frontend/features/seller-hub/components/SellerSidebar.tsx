"use client"

import React from 'react';
import { Link } from '@/lib/router';
import { Home, Package, ShoppingBag, Video, BarChart2, Settings, AlertTriangle } from 'lucide-react';

interface SellerNavProps {
  path: string;
  pendingOrders: number;
  /** Гар утасны хуудаснаас дуудахад цэс сонгосны дараа хаана. */
  onNavigate?: () => void;
}

const NAVS = [
  { label: 'Home', to: '/seller', icon: Home },
  { label: 'Inventory', to: '/seller/products', icon: Package },
  { label: 'Orders & Shipping', to: '/seller/orders', icon: ShoppingBag, badgeKey: 'pendingOrders' },
  { label: 'Шууд', to: '/seller/shows', icon: Video },
  { label: 'Analytics', to: '/seller/analytics', icon: BarChart2 },
] as const;

const linkClass = (active: boolean) =>
  `flex items-center justify-between px-3 py-2 rounded-lg text-[14px] font-[600] transition-all relative ${
    active ? 'bg-[#1A1A1A] text-white' : 'text-gray-600 hover:bg-gray-100'
  }`;

const ActiveRail = () => <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#F5A623]" />;

export const SellerBrand: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
  <Link to="/home" onClick={onNavigate} className="flex items-center gap-2">
    <span className="font-display text-[21px] font-[800] tracking-[-0.04em] text-black">WhyNot</span>
    <span className="px-2 py-0.5 border border-gray-200 bg-gray-50 rounded-md text-[11px] font-[700] text-gray-600 uppercase tracking-wider">
      Seller Hub
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
              {active && <ActiveRail />}
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />
                {nav.label}
              </div>
              {badge && (
                <span className={`px-1.5 py-0.5 rounded text-[11px] font-[800] ${active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200 flex flex-col gap-1 shrink-0">
        <Link to="/seller/settings" onClick={onNavigate} className={linkClass(settingsActive)}>
          {settingsActive && <ActiveRail />}
          <div className="flex items-center gap-3">
            <Settings className={`w-4 h-4 ${settingsActive ? 'text-white' : 'text-gray-500'}`} />
            Settings
          </div>
        </Link>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-[600] text-gray-600 hover:bg-gray-100 transition-all">
          <AlertTriangle className="w-4 h-4 text-gray-500" />
          Report a Bug
        </button>
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
  <aside className="hidden lg:flex w-[240px] shrink-0 bg-white border-r border-gray-200 flex-col h-screen sticky top-0 z-30">
    <div className="h-16 flex items-center px-6 shrink-0">
      <SellerBrand />
    </div>
    <SellerNav path={path} pendingOrders={pendingOrders} />
  </aside>
);
