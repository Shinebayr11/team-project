import { SellerRow } from "./seller-row"
import type { FollowedSeller } from "@/types/user"

export function SellerList({ sellers }: { sellers: FollowedSeller[] }) {
  if (sellers.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Одоогоор хоосон байна.
      </p>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {sellers.map((s) => (
        <SellerRow key={s.id} seller={s} />
      ))}
    </div>
  )
}
