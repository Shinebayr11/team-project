import { Suspense } from "react"

import { Messages } from "@/components/screens/Messages"
import { RouteFallback } from "@/components/layout/AppShell"

/**
 * Худалдагчийн зурвас. Худалдан авагчийн `/messages`-тэй ЯГ нэг өгөгдөл,
 * нэг дэлгэцийг хардаг — ялгаа нь энэ нь `seller/layout.tsx`-ын дор байгаа
 * тул самбарын цэс, толгой хэвээр үлдэнэ.
 */
export default function Page() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Messages embedded basePath="/seller/messages" />
    </Suspense>
  )
}
