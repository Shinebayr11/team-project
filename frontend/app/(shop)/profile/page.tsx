import { Suspense } from "react"

import { Profile } from "@/components/screens/Profile"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Profile />
    </Suspense>
  )
}
