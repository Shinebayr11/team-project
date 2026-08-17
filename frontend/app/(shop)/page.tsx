import { Suspense } from "react"

import { Home } from "@/components/screens/Home"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Home />
    </Suspense>
  )
}
