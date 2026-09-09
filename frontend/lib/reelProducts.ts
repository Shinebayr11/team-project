import { ReelProduct, ReelTab } from "@/types"
import { AuctionProduct, Listing, isActive } from "@/hooks/useAuction"
import { ShowProduct, productOfEntry } from "@/hooks/useShowProducts"

/**
 * Худалдагчийн урьдчилан эмхэлсэн жагсаалт панелийн үндэс болно; дуудлага худалдаанд
 * гарсан бараа нь "Шууд явж байна", дуусcан нь "Зарагдсан" болж доошоо шилжинэ.
 */
export const buildProducts = (
  entries: ShowProduct[],
  listing: Listing | null
): Record<ReelTab, ReelProduct[]> => {
  const onBlock =
    listing && typeof listing.product_id === "object" ? listing.product_id : null
  const running = isActive(listing)
  const livePrice = String(
    listing?.current_highest_bid_coins ?? listing?.starting_price_coins ?? 0
  )

  const buynow: ReelProduct[] = []
  const sold: ReelProduct[] = []

  const push = (product: AuctionProduct) => {
    const current = onBlock?._id === product._id
    const row: ReelProduct = {
      id: product._id,
      name: product.name,
      price: current ? livePrice : String(product.price_coins ?? 0),
      tag: current ? (running ? "Шууд явж байна" : "Зарагдсан") : "Удахгүй",
      live: current && running,
      image: product.images?.[0],
    }
    if (current && !running) sold.push(row)
    else buynow.push(row)
  }

  const listed = new Set<string>()
  for (const entry of entries) {
    const product = productOfEntry(entry)
    if (!product) continue
    listed.add(product._id)
    push(product)
  }

  // Жагсаалтад ороогүй бараагаар дуудлага худалдаа явж байвал түүнийг ч гэсэн харуулна —
  // /sell дээр жагсаалт эмхлээгүй байсан ч панель хоосон харагдахгүй.
  if (onBlock && !listed.has(onBlock._id)) push(onBlock)

  return { buynow, giveaways: [], sold }
}
