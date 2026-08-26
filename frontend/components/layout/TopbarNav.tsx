"use client"

import React from 'react';
import { Link } from '@/lib/router';

interface TopbarNavProps {
  path: string;
}

const LINKS = [
  { to: '/home', label: 'Home', exact: true },
  { to: '/explore', label: 'Explore' },
  { to: '/live-show', label: 'Browse' },
];

const isActive = (path: string, to: string, exact?: boolean) =>
  exact ? path === to : path.startsWith(to);

export const TopbarNav: React.FC<TopbarNavProps> = ({ path }) => (
  <div className="flex min-w-0 items-center gap-2">
    <Link to="/home" className="md:mr-4 flex shrink-0 items-center gap-2">
      <span className="font-display text-[21px] font-[800] tracking-[-0.04em] text-[var(--wn-ink)]">WhyNot</span>
    </Link>

    {LINKS.map(link => (
      <Link
        key={link.to}
        to={link.to}
        className={`hidden md:block px-3 lg:px-5 py-2 rounded-full text-[15px] font-[700] transition-colors ${
          isActive(path, link.to, link.exact)
            ? 'bg-[var(--wn-accent-soft)] text-[var(--wn-accent)]'
            : 'text-[var(--wn-ink)] hover:bg-[var(--wn-surface-2)]'
        }`}
      >
        {link.label}
      </Link>
    ))}
  </div>
);