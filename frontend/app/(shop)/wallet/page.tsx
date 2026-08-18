import { Suspense } from "react"

import { Wallet } from "@/components/screens/Wallet"
import { RouteFallback } from "@/components/layout/AppShell"

export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Wallet />
    </Suspense>
  )
}
