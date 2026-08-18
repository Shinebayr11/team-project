"use client"

import React from 'react';
import { useNavigate } from '@/lib/router';
import { SELLERS } from '../../data';
import { useStore } from '../../store';
import { Avatar } from '../ui/Avatar';

export const FollowingTab: React.FC = () => {
  const navigate = useNavigate();
  const { state, toggleFollow, isFollowing } = useStore();

  const slugs = Object.keys(state.following);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[24px] font-[800] text-[var(--wn-ink)]">Following</h2>
      <div className="flex flex-col gap-4">
        {slugs.map(slug => {
          const seller = SELLERS[slug];
          if (!seller) return null;

          return (
            <div key={slug} className="flex items-center justify-between p-4 rounded-[16px] border border-[var(--wn-line)] hover:border-[var(--wn-line-2)] transition-colors">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/shop?seller=${slug}`)}>
                <Avatar name={slug} initial={seller.initial} tint={seller.tint} size={48} />
                <div>
                  <div className="font-[700] text-[16px] text-[var(--wn-ink)]">{slug}</div>
                  <div className="text-[13px] text-[var(--wn-ink-3)] mt-0.5">★ {seller.rating} • {seller.followers} followers</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/live-show?show=${slug}`)}
                  className="px-4 py-2 rounded-full bg-[var(--wn-surface-2)] text-[14px] font-[700] text-[var(--wn-ink)] hover:bg-[var(--wn-line)] transition-colors"
                >
                  Watch
                </button>
                <button
                  onClick={() => toggleFollow(slug)}
                  className={`px-4 py-2 rounded-full text-[14px] font-[700] transition-colors ${
                    isFollowing(slug)
                      ? 'bg-[var(--wn-surface-2)] text-[var(--wn-ink)] hover:bg-[var(--wn-line)]'
                      : 'bg-[var(--wn-ink)] text-white hover:bg-[var(--wn-ink-2)]'
                  }`}
                >
                  {isFollowing(slug) ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          );
        })}

        {slugs.length === 0 && (
          <div className="py-12 text-center text-[15px] font-[600] text-[var(--wn-ink-3)]">
            You aren't following anyone yet.
          </div>
        )}
      </div>
    </div>
  );
};