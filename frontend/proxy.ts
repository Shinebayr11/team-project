import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

const isSellerHubRoute = createRouteMatcher(["/seller(.*)"])

/**
 * Худалдагчийн самбарын хаалт.
 *
 * Энд зөвхөн НЭВТЭРСЭН эсэхийг шалгана: худалдагч идэвхтэй эсэх нь Mongo дээр
 * байдаг бөгөөд mongoose нь edge runtime дээр ажиллахгүй. Идэвхгүй хэрэглэгчийг
 * `features/seller-hub/screens/SellerHubLayout.tsx` доторх guard буцаана —
 * хоёулаа ижил газар (`/?sellerGate=1`) руу аваачдаг.
 */
const withClerk = clerkMiddleware(async (auth, req) => {
  if (!isSellerHubRoute(req)) return

  const { userId } = await auth()
  if (userId) return

  // "/" нь marketing layout (AppShell-гүй) тул дэлгүүрийн нүүр рүү явуулна —
  // идэвхжүүлэх хуудас зөвхөн тэнд mount хийгддэг.
  const home = new URL("/home", req.url)
  home.searchParams.set("sellerGate", "1")
  return NextResponse.redirect(home)
})

/**
 * "/" (landing) нь Clerk-ийг бүрэн алгасна.
 *
 * Landing бол бүрэн статик marketing хуудас — auth төлөвөөр салаалдаггүй,
 * middleware нь ч зөвхөн /seller(.*)-ыг хамгаалдаг тул түүнд хийх ажил алга.
 * Гэтэл clerkMiddleware нь эхний зочинд dev-browser handshake хийж, хуудсыг
 * clerk.accounts.dev руу нэг эргүүлж татдаг: TTFB ~1.5s нэмэгддэг. Аппын бусад
 * бүх зам (нэвтрэх/бүртгүүлэх, дэлгүүр, seller hub) хэвээрээ дамжина.
 */
export default function proxy(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname === "/") return NextResponse.next()
  return withClerk(req, event)
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
}
