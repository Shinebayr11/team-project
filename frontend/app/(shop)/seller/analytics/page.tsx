import { Suspense } from "react"

import { SellerAnalytics } from "@/features/seller-hub"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <SellerAnalytics />
    </Suspense>
  )
}
