/**
 * API service layer — INTENTIONALLY EMPTY for Phase 1.
 *
 * Per ARCHITECTURE.md, only `POST /livekit/token` is currently mounted on
 * the backend (`server/src/index.ts`). The other 12 route files
 * (product, order, bid, wallet, user, category, liveshow, ...) exist but
 * are not mounted, so there is nothing real to call yet.
 *
 * When those routes are mounted, this folder will hold one file per
 * domain, e.g.:
 *
 *   services/
 *   ├── authService.ts
 *   ├── auctionService.ts
 *   ├── bidService.ts
 *   ├── productService.ts
 *   ├── userService.ts
 *   ├── orderService.ts
 *   └── notificationService.ts
 *
 * HTTP client: not decided yet. Do not add axios until the team confirms
 * it's needed — the built-in `fetch` may be sufficient for this API surface.
 */

export {};
