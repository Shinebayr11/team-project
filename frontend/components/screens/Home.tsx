"use client"

import React, { useState } from 'react';
import { useSearchParams, useNavigate } from '@/lib/router';
import { useHomeFeed, StatusFilter, DEFAULT_CATEGORY } from '@/hooks/useHomeFeed';
import { getWatchPath } from '@/lib/liveShows';
import { HomeSidebar } from '@/components/home/HomeSidebar';
import { HomeFeedHeader } from '@/components/home/HomeFeedHeader';
import { FeaturedShow } from '@/components/home/FeaturedShow';
import { CategorySection } from '@/components/home/CategorySection';
import { ShowGrid } from '@/components/home/ShowGrid';
import { Skeleton, SkeletonScreen, SkeletonCardGrid } from '@/components/ui/Skeleton';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get('cat') || DEFAULT_CATEGORY;
  const query = searchParams.get('q') || '';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);

  const { isBrowsing, hottestShow, groupedShows, displayShows, hasMore, loaderRef, loading } =
    useHomeFeed(query, category, statusFilter);

  const clearSearch = () => setSearchParams(prev => { prev.delete('q'); return prev; });

  // Хажуугийн самбар нь тэжээлээс хамаардаггүй тул уншиж байх үед ч ЖИНХЭНЭ
  // байдлаараа зурагдана — зөвхөн тэжээл нь орлуулагдана.
  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto flex gap-8 px-4 py-6 sm:px-6 lg:px-7 lg:py-8">
        <HomeSidebar />
        <SkeletonScreen className="flex-1 min-w-0">
          <Skeleton className="h-9 w-48 mb-6" />
          <div className="flex items-center gap-2 mb-8">
            {["w-16", "w-32", "w-28", "w-24"].map((width) => (
              <Skeleton key={width} className={`h-8 rounded-full ${width}`} />
            ))}
          </div>
          <Skeleton className="h-[260px] sm:h-[320px] lg:h-[360px] w-full rounded-[24px] mb-8 lg:mb-12" />
          <SkeletonCardGrid
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
            count={8}
          />
        </SkeletonScreen>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto flex gap-8 px-4 py-6 sm:px-6 lg:px-7 lg:py-8">
      <HomeSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <HomeFeedHeader
          query={query}
          category={category}
          onClearSearch={clearSearch}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {isBrowsing && hottestShow && (
          <FeaturedShow show={hottestShow} onWatch={() => navigate(getWatchPath(hottestShow))} />
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
              <div ref={loaderRef} className="mt-10 w-full">
                <SkeletonCardGrid
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                  count={4}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};