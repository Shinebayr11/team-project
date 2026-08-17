import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Everything under app/(shop) runs on mock data, so it stays public — gating it
// would only put a login in front of a static demo. Clerk protects the one real
// feature: app/(broadcast), the LiveKit go-live flow at /sell and /live/[id].
const isPublic = createRouteMatcher([
  "/",
  "/home",
  "/explore",
  "/live-show",
  "/shop",
  "/product",
  "/profile",
  "/messages",
  "/wallet",
  "/admin(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
}
