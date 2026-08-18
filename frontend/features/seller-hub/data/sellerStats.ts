// Static seller-hub figures that are not derived from store state.
export const SELLER_PAYOUTS = [
  { date: "Aug 6", desc: "Payout to Chase ••4417", amount: "-₮1,486,100", out: true },
  { date: "Aug 5", desc: "Sales — Milk Glass Mega Drop", amount: "+₮1,397,500" },
  { date: "Aug 2", desc: "Payout to Chase ••4417", amount: "-₮958,000", out: true },
  { date: "Aug 1", desc: "Sales — Jadeite & Kitchenalia", amount: "+₮1,045,400" },
];

export const SELLER_WALLET = { available: "₮1,397,500", pending: "₮455,000", lifetime: "₮17,685,400" };

export const SELLER_SHOW_STATS = [
  { title: "Milk Glass Mega Drop", when: "Aug 5", viewers: 1240, sold: 31, listed: 38, revenue: 1397500 },
  { title: "Jadeite & Kitchenalia", when: "Aug 1", viewers: 890, sold: 22, listed: 27, revenue: 1045400 },
  { title: "Late Night Bin Dive", when: "Jul 28", viewers: 1510, sold: 39, listed: 51, revenue: 1485400 },
  { title: "Pyrex & Kitchenalia Night", when: "Jul 24", viewers: 760, sold: 18, listed: 24, revenue: 798500 },
  { title: "Sunday Slow Scroll", when: "Jul 20", viewers: 540, sold: 12, listed: 19, revenue: 592200 },
  { title: "Estate Attic Haul", when: "Jul 16", viewers: 1080, sold: 28, listed: 34, revenue: 1266800 },
];

export const SELLER_TOP_PRODUCTS = [
  { name: "Jadeite mixing bowls", sold: 14, revenue: 966200 },
  { name: "Milk glass vases", sold: 11, revenue: 706300 },
  { name: "Pyrex Cinderella bowls", sold: 9, revenue: 642600 },
  { name: "Depression glass, mixed", sold: 8, revenue: 437800 },
  { name: "Enamelware & tins", sold: 6, revenue: 303500 },
];

/**
 * Auction figures are still placeholders — the store has no auction settlement
 * data yet, so the Analytics panel reads them from here instead of inline JSX.
 */
export const AUCTION_INSIGHTS = {
  completedAuctions: 42,
  successRate: '88%',
  avgWinningPrice: '₮45,200',
};
