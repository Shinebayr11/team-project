"use client"

import React from 'react';
import { useSearchParams, useNavigate } from '@/lib/router';
import { useHomeFeed } from '@/hooks/useHomeFeed';
import { HomeSidebar } from '@/components/home/HomeSidebar';
import { HomeFeedHeader } from '@/components/home/HomeFeedHeader';
import { FeaturedShow } from '@/components/home/FeaturedShow';
import { CategorySection } from '@/components/home/CategorySection';
import { ShowGrid } from '@/components/home/ShowGrid';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get('cat') || 'For You';
  const query = searchParams.get('q') || '';

  const { isBrowsing, hottestShow, groupedShows, displayShows, hasMore, loaderRef } =
    useHomeFeed(query, category);

  const clearSearch = () => setSearchParams(prev => { prev.delete('q'); return prev; });

  return (
    <div className="max-w-[1440px] mx-auto flex gap-8 px-7 py-8">
      <HomeSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <HomeFeedHeader query={query} category={category} onClearSearch={clearSearch} />

        {isBrowsing && hottestShow && (
          <FeaturedShow show={hottestShow} onWatch={() => navigate(`/live-show?show=${hottestShow.seller}`)} />
        )}

        {isBrowsing ? (
          <div className="flex flex-col gap-12">
            {Object.entries(groupedShows).map(([groupCategory, shows]) => (
              <CategorySection
                key={groupCategory}
                category={groupCategory}
                shows={shows}
                onSeeMore={() => setSearchParams({ cat: groupCategory })}
              />
            ))}
          </div>
        ) : (
          <>
            <ShowGrid shows={displayShows} />
            {hasMore && (
              <div ref={loaderRef} className="h-20 w-full flex items-center justify-center mt-8">
                <div className="w-6 h-6 border-2 border-[var(--wn-ink-3)] border-t-transparent rounded-full animate-spin opacity-50" />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};