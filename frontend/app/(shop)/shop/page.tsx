import { Suspense } from "react"

import { Shop } from "@/components/screens/Shop"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Shop />
    </Suspense>
  )
}
