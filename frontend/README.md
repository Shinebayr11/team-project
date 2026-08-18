# WhyNot — frontend

Next.js 16 (App Router) storefront for live shopping. The UI is the WhyNot
design, ported from a standalone Vite app; Clerk handles auth and LiveKit
handles the actual broadcast.

## Layout

```
app/
  layout.tsx            root — ClerkProvider, fonts, globals.css
  (shop)/               the storefront. Wrapped in <AppShell>.
    page.tsx            /            Home
    explore/ live-show/ shop/ product/ profile/ messages/ wallet/
    admin/              the seller hub (own sidebar, no shopper topbar)
  (broadcast)/          LiveKit. Same <AppShell> chrome.
    sell/               create a room, then push to /live/[id]
    live/[id]/          <VideoStage> — the LiveKit room
  sign-in/ sign-up/     Clerk catch-all routes

components/           shopper side only
  layout/AppShell.tsx   StoreProvider + Topbar + modals + toasts
  screens/              page-level compositions, one per shopper route
  live/video-stage.tsx  LiveKit room + controls
  ui/                   Avatar, LiveDot, Modal, ToastContainer, button
  cards/ explore/ home/ liveshow/ messages/ modals/ product/
  profile/ reviews/ shop/ wallet/

features/
  seller-hub/           the whole seller dashboard, self-contained (see its README)
    screens/ components/ hooks/ data/ store/ types.ts

store/                  React context store, persisted to localStorage
data/                   seed/mock catalogue (shopper side)
hooks/                  feed and player hooks (shopper side)
types/                  domain types
lib/
  router.tsx            react-router -> next/navigation shim
  utils.ts              cn()
```

The seller hub is deliberately **not** spread across `components/`, `hooks/` and
`data/` — everything it owns lives under `features/seller-hub/`, including the
three store slices the global provider composes. See
[features/seller-hub/README.md](features/seller-hub/README.md) for its layering
rules, and [../ARCHITECTURE.md](../ARCHITECTURE.md) for the system-wide picture
(in Mongolian).

Route files under `app/` stay thin: they import a screen — from
`components/screens/` for the shopper side, or from `@/features/seller-hub` for
`/admin/*` — and wrap it in `<Suspense>` (the screens read the query string via
`useSearchParams`).

## Two systems, one shell

Everything in `(shop)` runs on **mock data** from `data/` — no backend. It is
public, because gating a static demo behind a login only gets in the way.

`(broadcast)` is the **real** feature. `middleware.ts` protects it with Clerk,
and it talks to a LiveKit server via `NEXT_PUBLIC_LIVEKIT_URL` plus a token
endpoint at `NEXT_PUBLIC_API_URL/livekit/token`. The entry point is the **Go
Live** button on Seller Hub → Shows (`/admin/shows`); the seller hub's own
"Go Live Now" on a show only flips a mock status and does not touch LiveKit.

Both render inside the same `<AppShell>`, so the app looks like one product.

The dev server must run on **port 3000** — `server/src/index.ts` only allows
that origin through CORS, so the token fetch fails on any other port.

## Styling

Tailwind v4. The WhyNot design tokens live in `app/globals.css` under
`.whynot-root` and are all `--wn-` prefixed — the source app used bare names
like `--accent` and `--border`, which are exactly what the shadcn-derived
`ui/button` still resolves.

That file also restores the Tailwind **v3** values for `rounded-*`, `shadow-sm`
and `backdrop-blur-sm`. v4 renamed the bottom of those scales, so the ported
class names would otherwise render at different sizes. The values were measured
against the original app.

## Commands

```bash
npm run dev
```

`npm run build` · `npm run typecheck` · `npm run lint` · `npm run format`
