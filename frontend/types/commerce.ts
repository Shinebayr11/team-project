// Shopper-side commerce records.
export interface Purchase {
  id: string;
  title: string;
  seller: string;
  price: string;
  date: string;
  status: "delivered" | "shipped" | "processing";
  qty?: number;
}

export interface Bid {
  id: string;
  title: string;
  seller: string;
  amount: string;
  date: string;
  status: "leading";
}

export interface CartLine {
  seller: string;
  name: string;
  price: string;
  qty: number;
}

