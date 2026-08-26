import { Suspense } from "react"

import { StartShowScreen } from "@/components/sell/start-show-screen"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <StartShowScreen />
    </Suspense>
  )
}
