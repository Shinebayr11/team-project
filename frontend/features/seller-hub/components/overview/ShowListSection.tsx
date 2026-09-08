"use client"

import React from 'react';
import { Link } from '@/lib/router';
import { SellerShowSummary } from '@/features/seller-hub/hooks/useSellerShows';
import { btn } from "@/features/seller-hub/components/buttons"
import { SkeletonRows, SkeletonScreen } from "@/components/ui/Skeleton"

interface ShowListSectionProps {
  title: string;
  shows: SellerShowSummary[];
  icon: React.ElementType;
  actionLabel: string;
  onAction: () => void;
  emptyMessage: string;
  /** Renders the row subtitle — schedule for upcoming, results for completed. */
  subtitle: (show: SellerShowSummary) => string;
  viewAllTo?: string;
  emptyAction?: { label: string; onClick: () => void };
  /** Уншиж байгааг хоосон гэж харуулбал «дамжуулалт алга» гэсэн ХУДАЛ мэдээлэл
      хормын зуур гарна — тиймээс энэ нь `shows`-оос ӨМНӨ шалгагдана. */
  loading?: boolean;
}

export const ShowListSection: React.FC<ShowListSectionProps> = ({
  title, shows, icon: Icon, actionLabel, onAction, emptyMessage, subtitle, viewAllTo, emptyAction, loading = false,
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h2 className="text-[18px] font-[800] text-black">{title}</h2>
      {viewAllTo && (
        <Link to={viewAllTo} className="text-[14px] font-[700] text-[var(--wn-admin-accent)] hover:underline">Бүгдийг харах</Link>
      )}
    </div>

    {loading ? (
      <SkeletonScreen label={`${title} — уншиж байна`}>
        <SkeletonRows rows={2} />
      </SkeletonScreen>
    ) : shows.length > 0 ? shows.map(show => (
      <div key={show._id} className="p-5 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--wn-admin-chip)] flex items-center justify-center text-[var(--wn-admin-muted)]">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-[800] text-black">{show.title}</div>
            <div className="text-[13px] text-[var(--wn-admin-muted)] font-[500] mt-0.5">{subtitle(show)}</div>
          </div>
        </div>
        <button onClick={onAction} className="px-4 py-1.5 rounded-lg bg-[var(--wn-admin-chip)] text-[13px] font-[700] text-black hover:bg-[var(--wn-admin-chip-2)] transition-colors">
          {actionLabel}
        </button>
      </div>
    )) : (
      <div className="p-8 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white text-center flex flex-col items-center">
        <div className={`text-[var(--wn-admin-muted)] font-[500] ${emptyAction ? "mb-4" : ""}`}>{emptyMessage}</div>
        {emptyAction && (
          <button onClick={emptyAction.onClick} className={btn("ink", "pill")}>
            {emptyAction.label}
          </button>
        )}
      </div>
    )}
  </div>
);