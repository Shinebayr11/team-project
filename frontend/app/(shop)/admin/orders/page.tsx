import { Suspense } from "react"

import { SellerOrders } from "@/features/seller-hub"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <SellerOrders />
    </Suspense>
  )
}
