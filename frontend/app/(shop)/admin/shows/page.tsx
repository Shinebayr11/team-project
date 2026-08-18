import { Suspense } from "react"

import { SellerShows } from "@/features/seller-hub"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <SellerShows />
    </Suspense>
  )
}
