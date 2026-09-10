export interface ReelChatLine {
  name: string;
  text: string;
  mod?: boolean;
}

export interface ReelItem {
  name: string;
  /** "watch" — жинхэнэ эфир: энд худалдах зүйл байхгүй, эфир рүү нь оруулна. */
  mode: "bid" | "buynow" | "watch";
  price: string;
  next: string;
  seconds: number;
  subline: string;
}

export type ReelTab = "buynow" | "giveaways" | "sold";

/** Reel tags are free-form (e.g. "Ends in 1:05"), so this is looser than SellerProduct. */
export interface ReelProduct {
  /** Жинхэнэ барааны id. Reel-ийн mock өгөгдөлд байхгүй тул сонголттой —
      байвал мөр нь барааны хуудас руу холбогдоно. */
  id?: string;
  name: string;
  price: string;
  tag: string;
  live?: boolean;
  /** Mock reel-д зураг байдаггүй тул сонголттой. */
  image?: string;
}

export interface ReelShow {
  slug: string;
  seller: string;
  initial: string;
  avatarBg: string;
  title: string;
  cat1: string;
  cat2: string;
  rating: string;
  reviews: string;
  followers: string;
  viewers: number;
  thumbnail?: string;
  /** Эфирийн бичлэг. Байвал зураг дээр давхарлаж, чимээгүй давтагдан тоглоно. */
  video?: string;
  /**
   * ЖИНХЭНЭ эфирийн зам (`/live/<room>`). Байвал энэ мөр нь mock биш — дарахад
   * бодит дамжуулалт руу орно.
   */
  watchPath?: string;
  /**
   * Худалдагчийн бодит id. `slug` нь жинхэнэ эфирт LiveKit өрөөний нэр байдаг
   * тул дэлгүүр рүү орох, дагах зэрэг нь ТҮҮГЭЭР БИШ үүгээр явна — эс тэгвэл
   * эфир дуусахад дагасан бүртгэл нь алга болно.
   */
  sellerId?: string;
  item: ReelItem;
  products: Record<ReelTab, ReelProduct[]>;
  chat: ReelChatLine[];
}
