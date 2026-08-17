import { Suspense } from "react"

import { LiveShow } from "@/components/screens/LiveShow"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <LiveShow />
    </Suspense>
  )
}
