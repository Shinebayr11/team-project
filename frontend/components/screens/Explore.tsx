"use client"

import React, { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { Calendar, Star, TrendingUp } from 'lucide-react';
import { EXPLORE_CATEGORIES } from '@/data/exploreCategories';
import { useExploreFeed } from '@/hooks/useExploreFeed';
import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { ExploreSection } from '@/components/explore/ExploreSection';
import { CategoryGrid } from '@/components/explore/CategoryGrid';
import { TrendingProducts } from '@/components/explore/TrendingProducts';
import { UpcomingShows } from '@/components/explore/UpcomingShows';
import { ShowGrid } from '@/components/home/ShowGrid';
import { LiveDot } from '@/components/ui/LiveDot';

const LiveBadge = (
  <div className="px-2.5 py-1 rounded-full bg-[var(--wn-live-soft)] text-[var(--wn-live)] text-[11px] font-[800] uppercase tracking-wider flex items-center gap-1.5">
    <LiveDot /> Live
  </div>
);

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { liveShows, recommendedShows, upcomingShows, trendingProducts } = useExploreFeed(query);

  return (
    <div className="min-h-screen bg-[var(--wn-page)] pb-20">
      <ExploreHeader query={query} onQueryChange={setQuery} />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10 flex flex-col gap-16">
        <ExploreSection title="Categories" onViewAll={() => navigate('/home')}>
          <CategoryGrid
            categories={EXPLORE_CATEGORIES}
            onSelect={category => navigate(`/home?cat=${encodeURIComponent(category.name)}`)}
          />
        </ExploreSection>

        <ExploreSection title="Шууд" badge={LiveBadge} onViewAll={() => navigate('/live-show')}>
          <ShowGrid shows={liveShows.slice(0, 4)} />
        </ExploreSection>

        <ExploreSection
          title="Recommended for You"
          icon={<Star className="w-5 h-5 text-[var(--wn-accent)] fill-[var(--wn-accent)]" />}
        >
          <ShowGrid shows={recommendedShows.slice(0, 4)} />
        </ExploreSection>

        <ExploreSection
          title="Trending Products"
          icon={<TrendingUp className="w-5 h-5 text-[var(--wn-ink-2)]" />}
          onViewAll={() => navigate('/home')}
        >
          <TrendingProducts products={trendingProducts} />
        </ExploreSection>

        <ExploreSection
          title="Upcoming Shows"
          icon={<Calendar className="w-5 h-5 text-[var(--wn-ink-2)]" />}
          onViewAll={() => navigate('/home')}
        >
          <UpcomingShows shows={upcomingShows.slice(0, 4)} />
        </ExploreSection>
      </div>
    </div>
  );
};