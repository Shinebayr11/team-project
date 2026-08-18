// Direct-message threads between a shopper and a seller.
export interface ChatMessage {
  from: "me" | "them";
  text: string;
  at: string;
}

export interface Thread {
  slug: string;
  initial: string;
  tint: string;
  unread: number;
  messages: ChatMessage[];
}

