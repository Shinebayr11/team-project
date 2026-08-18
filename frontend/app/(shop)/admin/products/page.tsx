import { Suspense } from "react"

import { SellerProducts } from "@/features/seller-hub"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <SellerProducts />
    </Suspense>
  )
}
