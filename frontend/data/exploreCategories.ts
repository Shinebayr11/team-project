export interface ExploreCategory {
  id: string;
  name: string;
  viewers: string;
  shows: number;
  icon: string;
}

/**
 * `name` нь дэлгэц дээр гарахаас гадна шинэ дамжуулалтын `category` утга болж
 * хадгалагддаг тул монголоор бичнэ. `id` нь тогтвортой түлхүүр — хөндөхгүй.
 */
export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  { id: 'fashion', name: 'Хувцас', viewers: '12.4K', shows: 23, icon: '👕' },
  { id: 'sneakers', name: 'Пүүз', viewers: '8.7K', shows: 17, icon: '👟' },
  { id: 'sports-cards', name: 'Спортын карт', viewers: '15.2K', shows: 45, icon: '⚾' },
  { id: 'trading-cards', name: 'Цуглуулгын карт', viewers: '22.1K', shows: 62, icon: '🃏' },
  { id: 'collectibles', name: 'Цуглуулга', viewers: '5.3K', shows: 12, icon: '🧸' },
  { id: 'electronics', name: 'Электроник', viewers: '3.8K', shows: 8, icon: '🎮' },
  { id: 'vintage-decor', name: 'Винтаж чимэглэл', viewers: '9.1K', shows: 28, icon: '🏺' },
  { id: 'jewelry', name: 'Гоёл чимэглэл', viewers: '4.5K', shows: 15, icon: '💎' },
];
