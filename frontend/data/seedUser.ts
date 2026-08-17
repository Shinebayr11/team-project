// Seed state for the shopper side of the store.
export const SEED_CREDITS = 2480;

export const SEED_FOLLOWING = {
  amyperrin: true, thewittleshop: true, mysticroseantiques: true,
  dirtyrichesauctions: true, kellys_lighthouse: true,
};

export const SEED_PURCHASES = [
  { id: "p5", title: "Fenton Hobnail Milk Glass Vase", seller: "amyperrin", price: "240", date: "Aug 3", status: "delivered" as const },
  { id: "p4", title: "Murano Ribbon Bowl, 1960s", seller: "thewittleshop", price: "180", date: "Aug 5", status: "shipped" as const },
  { id: "p3", title: "Butterprint Cinderella Bowl", seller: "mysticroseantiques", price: "155", date: "Aug 7", status: "processing" as const },
  { id: "p2", title: "Sterling Flatware Set, 42 pc", seller: "dirtyrichesauctions", price: "620", date: "Jul 29", status: "delivered" as const },
  { id: "p1", title: "Coastal ceramics bundle", seller: "kellys_lighthouse", price: "88", date: "Jul 22", status: "delivered" as const },
];

export const SEED_THREADS = [
  {
    slug: "amyperrin", initial: "A", tint: "#E6E2F8", unread: 1,
    messages: [
      { from: "them" as const, text: "Hey! Thanks for the follow — the hobnail vase goes up around 8pm tonight.", at: "Yesterday" },
      { from: "me" as const, text: "Perfect, I'll be there. Is it the 8 inch one?", at: "Yesterday" },
      { from: "them" as const, text: "That's the one. Mint condition, no chips at all.", at: "10:12" },
    ],
  },
  {
    slug: "thewittleshop", initial: "T", tint: "#E4EAF0", unread: 0,
    messages: [
      { from: "me" as const, text: "Do you combine shipping across two shows?", at: "Mon" },
      { from: "them" as const, text: "Always — anything you win in the same week ships together.", at: "Mon" },
    ],
  },
  {
    slug: "mysticroseantiques", initial: "M", tint: "#F0E8E8", unread: 2,
    messages: [
      { from: "them" as const, text: "Your Butterprint bowl is packed and going out tomorrow.", at: "Tue" },
      { from: "them" as const, text: "Tracking will land in your email tonight.", at: "Tue" },
    ],
  },
  {
    slug: "dirtyrichesauctions", initial: "D", tint: "#EDE9E2", unread: 0,
    messages: [
      { from: "me" as const, text: "What was the final weight on the sterling set?", at: "Jul 30" },
      { from: "them" as const, text: "Just over 1400 grams. Invoice is in your orders.", at: "Jul 30" },
    ],
  },
];

