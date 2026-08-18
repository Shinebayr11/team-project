import { Suspense } from "react"

import { Explore } from "@/components/screens/Explore"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Explore />
    </Suspense>
  )
}
