"use client"

import React from 'react';
import { SkeletonRows, SkeletonScreen } from '@/components/ui/Skeleton';
import { useNavigate } from '@/lib/router';
import { useFollow, followedSellerName } from '@/hooks/useFollow';
import { Avatar } from '../ui/Avatar';

/**
 * Дагаж буй худалдагчид — серверийн `User.following`-оос уншина.
 *
 * Өмнө нь localStorage дахь нэрсийн жагсаалтыг `data/SELLERS` mock-той тулгаж
 * зурдаг байсан: mock-д байхгүй нэр бүр чимээгүй алга болж, өөр төхөөрөмж дээр
 * жагсаалт хоосон эхэлдэг байв.
 */
export const FollowingTab: React.FC = () => {
  const navigate = useNavigate();
  const { sellers, loading, isFollowing, toggleFollow, pendingId } = useFollow();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Дагаж буй</h2>

      <div className="flex flex-col gap-4">
        {sellers.map(seller => {
          const name = followedSellerName(seller);
          const following = isFollowing(seller._id);

          return (
            <div
              key={seller._id}
              className="flex items-center justify-between p-4 rounded-[16px] border border-[var(--wn-line)] hover:border-[var(--wn-line-2)] transition-colors"
            >
              <div
                className="flex items-center gap-4 cursor-pointer min-w-0"
                onClick={() => navigate(`/messages?user=${seller._id}`)}
              >
                {seller.avatar_url ? (
                  <img
                    src={seller.avatar_url}
                    alt={name}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <Avatar name={name} size={48} />
                )}
                <div className="min-w-0">
                  <div className="truncate font-[700] text-[16px] text-[var(--wn-ink)]">{name}</div>
                  <div className="text-[13px] text-[var(--wn-ink-3)] mt-0.5">Зурвас бичих</div>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(seller)}
                disabled={pendingId === seller._id}
                className={`shrink-0 px-4 py-2 rounded-full text-[14px] font-[700] transition-colors disabled:opacity-60 ${
                  following
                    ? 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)] hover:bg-[var(--wn-line)]'
                    : 'bg-[var(--wn-ink)] text-white hover:bg-[var(--wn-ink-2)]'
                }`}
              >
                {following ? 'Дагаж байна' : 'Дагах'}
              </button>
            </div>
          );
        })}

        {loading ? (
          <SkeletonScreen label="Дагаж буй худалдагчдыг уншиж байна">
            <SkeletonRows rows={4} />
          </SkeletonScreen>
        ) : (
          sellers.length === 0 && (
            <div className="py-12 text-center text-[15px] font-[600] text-[var(--wn-ink-3)]">
              Та одоогоор хэнийг ч дагаагүй байна.
            </div>
          )
        )}
      </div>
    </div>
  );
};
