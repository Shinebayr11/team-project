"use client"

import React from 'react';
import { Home, Compass, Radio } from 'lucide-react';
import { Link } from '@/lib/router';

interface TopbarNavProps {
  path: string;
}

const LINKS = [
  { to: '/home', label: 'Нүүр', icon: Home, exact: true },
  { to: '/explore', label: 'Ангилал', icon: Compass },
  { to: '/live-show', label: 'Шууд', icon: Radio },
];

const isActive = (path: string, to: string, exact?: boolean) =>
  exact ? path === to : path.startsWith(to);

export const TopbarNav: React.FC<TopbarNavProps> = ({ path }) => (
  <div className="flex min-w-0 items-center gap-1 md:gap-2">
    <Link to="/home" className="md:mr-4 flex shrink-0 items-center gap-2">
      <span className="font-display text-[21px] font-[800] tracking-[-0.04em] text-[var(--wn-ink)]">WhyNot</span>
    </Link>

    {LINKS.map(({ to, label, icon: Icon, exact }) => {
      const active = isActive(path, to, exact);
      // Идэвхтэй линк нь `--wn-accent-soft` дээр суудаг байсан: аппын бусад
      // бүх ягаан (түрийвчний тэмдэг, "Шууд үзэх", "Нэвтрэх") бол цагаан
      // бичигтэй ДҮҮРГЭСЭН `--wn-accent` тул навигацийн цайвар лаванда нь
      // ганцаараа өөр палетраас ирсэн мэт харагддаг байв. Цагаан бичиг
      // --wn-accent дээр 6.50:1 — AA давна.
      const tone = active
        ? 'bg-[var(--wn-accent)] text-white hover:bg-[var(--wn-accent-hover)]'
        : 'text-[var(--wn-ink)] hover:bg-[var(--wn-surface-2)]';

      return (
        <React.Fragment key={to}>
          {/* `hidden md:block` нь гурван линкийг бүгдийг нь нуучихдаг тул
              гар утсан дээр Home/Explore/Browse руу буцах зам огт үлддэггүй
              байв — энд icon хэлбэрээр нөхөж өгнө. */}
          <Link
            to={to}
            aria-label={label}
            className={`flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${tone}`}
          >
            <Icon className="h-5 w-5" />
          </Link>
          <Link
            to={to}
            className={`hidden md:block px-3 lg:px-5 py-2 rounded-full text-[15px] font-[700] transition-colors ${tone}`}
          >
            {label}
          </Link>
        </React.Fragment>
      );
    })}
  </div>
);