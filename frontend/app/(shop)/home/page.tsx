import { Suspense } from "react"

import { Home } from "@/components/screens/Home"
import { RouteFallback } from "@/components/layout/AppShell"

// The shopper feed lives at /home; "/" is the public landing page.
export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Home />
    </Suspense>
  )
}
