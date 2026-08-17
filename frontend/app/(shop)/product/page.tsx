import { Suspense } from "react"

import { Product } from "@/components/screens/Product"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Product />
    </Suspense>
  )
}
