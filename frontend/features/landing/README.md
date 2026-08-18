# Landing

Нийтэд нээлттэй нүүр хуудас. **Landing-ийн бүх код энэ фолдерт байна.**

URL нь **`/`** (`app/(marketing)/page.tsx`). Route файл нь зөвхөн бүрхүүл: энэ
фолдерын screen-ийг render хийдэг, өөр логик агуулдаггүй.

`(marketing)` route group нь `AppShell`-гүй — landing өөрийн header/footer-тэй,
store-д хүрдэггүй (сагс, кредит, мессеж энд хэрэггүй). Layout нь зөвхөн
`whynot-root` класс өгнө: `--wn-*` токенууд түүгээр л ажиллана
(`app/globals.css`).

## Бүтэц

```
features/landing/
├── index.ts        Public surface — зөвхөн Landing screen-ийг export
├── screens/        Landing.tsx — өгөгдөл авч, section-үүдэд props-оор тарааx
└── components/     Presentational: ЗӨВХӨН props авна
    ├── LandingHeader   лого + Нэвтрэх / Бүртгүүлэх (Clerk SignedIn/SignedOut)
    ├── Hero            гарчиг + CTA + шууд эфирт байгаа онцлох шоу
    ├── LiveNow         "Одоо шууд эфирт" grid
    ├── LiveShowCard    нэг шоуны карт → /live-show?show=
    ├── HowItWorks      3 алхам
    ├── JoinCta         доод CTA хэсэг
    └── LandingFooter
```

## Нэвтрэлт

Landing бол **нэвтрэхгүй хүнд зориулсан** хуудас: шууд эфирийн жагсаалт, шоуны
карт бүр `/live-show` руу шууд ордог — Clerk-ийн хамгаалалт байхгүй
(`middleware.ts`-ийн public matcher-т `/` болон `/live-show` байна).

Нэвтрэх/Бүртгүүлэх товч нь нэвтэрсэн эсэхээс үл хамааран **үргэлж** харагдана —
хуудас auth төлөвөөр салаалдаггүй тул бүрэн статик хэвээр үлддэг. (Clerk Core 3
дээр `<SignedIn>` / `<SignedOut>` байхгүй болсныг санамж болгон тэмдэглэв.)

## Layer-ийн дүрэм

`screens/` бол өгөгдөлтэй холбогдох цорын ганц давхарга (`@/data`-г эндээс л
import хийнэ) — seller-hub-тай ижил. `components/` доторх юу ч `useStore`,
`@/data`-г import хийхгүй.

## `/` болон `/home`

`/` нь landing. Дэлгүүрийн feed нь **`/home`** руу шилжсэн
(`app/(shop)/home/page.tsx`) — өмнө нь `/` дээр байсан. Апп доторх лого, "Home"
таб, Explore-ын "View all" бүгд `/home` руу заана.
