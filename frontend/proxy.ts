import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isSellerHubRoute = createRouteMatcher(["/seller(.*)"])

/**
 * Худалдагчийн самбарын хаалт.
 *
 * Энд зөвхөн НЭВТЭРСЭН эсэхийг шалгана: худалдагч идэвхтэй эсэх нь Mongo дээр
 * байдаг бөгөөд mongoose нь edge runtime дээр ажиллахгүй. Идэвхгүй хэрэглэгчийг
 * `features/seller-hub/screens/SellerHubLayout.tsx` доторх guard буцаана —
 * хоёулаа ижил газар (`/?sellerGate=1`) руу аваачдаг.
 */
export default clerkMiddleware(async (auth, req) => {
  if (!isSellerHubRoute(req)) return

  const { userId } = await auth()
  if (userId) return

  // "/" нь marketing layout (AppShell-гүй) тул дэлгүүрийн нүүр рүү явуулна —
  // идэвхжүүлэх хуудас зөвхөн тэнд mount хийгддэг.
  const home = new URL("/home", req.url)
  home.searchParams.set("sellerGate", "1")
  return NextResponse.redirect(home)
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
}
