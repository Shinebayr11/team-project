import { Suspense } from "react"

import { Messages } from "@/components/screens/Messages"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Messages />
    </Suspense>
  )
}
