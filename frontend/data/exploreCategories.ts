export interface ExploreCategory {
  id: string;
  name: string;
  viewers: string;
  shows: number;
  icon: string;
}

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  { id: 'fashion', name: 'Fashion', viewers: '12.4K', shows: 23, icon: '👕' },
  { id: 'sneakers', name: 'Sneakers', viewers: '8.7K', shows: 17, icon: '👟' },
  { id: 'sports-cards', name: 'Sports Cards', viewers: '15.2K', shows: 45, icon: '⚾' },
  { id: 'trading-cards', name: 'Trading Cards', viewers: '22.1K', shows: 62, icon: '🃏' },
  { id: 'collectibles', name: 'Collectibles', viewers: '5.3K', shows: 12, icon: '🧸' },
  { id: 'electronics', name: 'Electronics', viewers: '3.8K', shows: 8, icon: '🎮' },
  { id: 'vintage-decor', name: 'Vintage Decor', viewers: '9.1K', shows: 28, icon: '🏺' },
  { id: 'jewelry', name: 'Jewelry', viewers: '4.5K', shows: 15, icon: '💎' },
];
