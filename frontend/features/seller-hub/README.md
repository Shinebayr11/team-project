# Seller Hub

Худалдагчийн самбар. **Seller Hub-ын бүх код энэ фолдерт байна** — өөр газар хайх
шаардлагагүй.

URL нь `/seller/*` (`app/(shop)/seller/**`). Өмнө нь `/admin/*` байсныг
нэрийг нь үнэн зөв болгохын тулд зөөв — энэ бол админы бус, худалдагчийн самбар. Route файлууд нь зөвхөн бүрхүүл:
`Suspense` дотор энэ фолдерын screen-ийг render хийдэг, өөр логик агуулдаггүй.

## Бүтэц

```
features/seller-hub/
├── index.ts        Public surface — зөвхөн screen-үүдийг export хийнэ
├── types.ts        Seller-ийн бичлэгүүд: InventoryProduct, SellerOrder, SellerShow, ShowProduct
├── screens/        Container: useStore() дуудаж, props-оор доош тараана
├── components/     Presentational: ЗӨВХӨН props авна, store-д хүрдэггүй
├── hooks/          useSellerOverview, useSellerAnalytics — state-ээс дүгнэлт тооцно
├── data/           Mock seed өгөгдөл (seedInventory / seedOrders / seedShows / sellerStats)
└── store/          Энэ feature-т харьяалагдах slice-ууд (inventory / orders / shows)
```

## Давхаргын дүрэм

**`screens/` бол store-той холбогдох цорын ганц давхарга.** Screen нь `useStore()`-оос
өгөгдөл, action авч, `components/`-т props болгон дамжуулна.

**`components/` доторх юу ч `useStore`, `@/data`-г import хийхгүй.** Тэд зөвхөн props
авдаг тул тусад нь турших, дахин ашиглахад амархан. Энэ дүрмийг зөрчвөл feature-ийн
хил алдагдана.

```
app/(shop)/seller/orders/page.tsx     route бүрхүүл
  └── screens/SellerOrders.tsx       useStore() ← ганц холбоос
        └── components/orders/OrdersTable.tsx   props: { orders, onSelect }
```

## Global store-той холбоо

Гурван slice (`inventory`, `orders`, `shows`) энэ feature-т харьяалагдана. Global
`StoreProvider` тэдгээрийг зөвхөн угсардаг:

| Хэрэглэгч | Хаанаас авдаг |
|---|---|
| `store/StoreProvider.tsx` | `@/features/seller-hub/store/*` |
| `store/state.ts` | `@/features/seller-hub/data/seed*` |
| `store/types.ts`, `types/store.ts` | `@/features/seller-hub/types` |

Эдгээр нь `index.ts` barrel-аар биш, шууд leaf зам руу заадаг: barrel нь `"use client"`
screen-үүдийг export хийдэг тул зөвхөн төрөл авах import серверийн модуль граф руу
компонент чирч оруулахаас сэргийлсэн.

`state.sellerOrders` / `state.sellerShows` нь өмнө нь `adminOrders` / `adminShows`
нэртэй байсан. `loadState()` хуучин түлхүүрийг бас уншдаг тул хөтөч дээр хадгалагдсан
өгөгдөл алдагдахгүй.

## Дизайн тогтолцоо

Самбарын өнгө, хэмжээ **`app/globals.css`-ийн `--wn-admin-*` токеноос** ирнэ.
Компонентод шууд hex бичих, Tailwind-ын `gray-*` / `red-*` / `blue-*` хэмжүүр
хэрэглэх нь зөрчил: тэдгээр саарлууд хөх ялтастай (H≈258–264) бол самбарын
дэвсгэр ягаан тийш хазайдаг (H≈290–305) тул хажууд нь хүйтэн харагдана.

### Өнгө — хоёр тэнхлэг

**Самбарын үндсэн өнгө бол хар.** Үйлдэл ба сонголт хоёуланг нь тэр дааж,
бичвэрийн үйлдэл нь брэндийн ягаанаар явна:

| Үүрэг | Токен | Хаана |
|---|---|---|
| Гол үйлдэл ба сонгогдсон зүйл | `--wn-admin-ink` | Нийтлэх, нэмэх, хадгалах; цэс, таб, сегмент |
| Хоёрдогч үйлдэл | хүрээ (`--wn-ink-4`) | Цуцлах, ноорог хадгалах |
| Бичвэрийн үйлдэл | `--wn-admin-accent` | Холбоос, графикийн онцлох цэг |

Гол товч өмнө нь `--wn-admin-lime` (#c9f73d) дээр тусдаа явдаг байсныг хассан:
нэг дэлгэц дээр «Нийтлэх» ногоон-шар, «Бараа нэмэх» хар гэсэн хоёр өөр «гол
товч» зэрэгцэж, аль нь үндсэн үйлдэл нь болох нь ойлгогдохгүй байв.

**Төлөв** нь зөвхөн утга дамжуулна — чимэглэлээр хэрэглэхгүй:
`--wn-admin-ok` / `-warn` / `-danger` / `-info`, тус бүр `-soft` хостой.

KPI-гийн `--wn-admin-tone-*` нь ангилал заана, утга **заадаггүй**: «teal» гэдэг
нь «сайн» гэсэн үг биш.

### Хэмжээс

Үсэг: **11 · 12 · 13 · 14 · 16 · 18 · 20 · 24 · 28** — өөр утга байхгүй,
бутархай пиксель огт байхгүй.

| Хэмжээ | Үүрэг |
|---|---|
| 11 | Том үсгийн шошго, тэмдэг |
| 12 | Тайлбар, хүснэгтийн толгой |
| 13 | Хоёрдогч бичвэр |
| 14 | Үндсэн бичвэр, товч, жагсаалтын мөрийн гарчиг |
| 16 | Картын гарчиг |
| 18 | Хэсэг, цонхны гарчиг |
| 20 | Жижиг үзүүлэлт, лого |
| 24 | Хуудасны гарчиг |
| 28 | KPI-гийн дүн |

Дотоод зай гурван утгатай бөгөөд тус бүр өөр үүрэгтэй: `p-6` картын бие,
`p-5` нягт үзүүлэлтийн хайрцаг (`KpiCard`, `ActionCard`), `p-4` хэрэгслийн мөр.

Хяналтын өндөр нэг л утга — **40px (`h-10`)**. Хажуугийн багана **320px**
(үндсэн цэс нь 240px), агуулгын дээд өргөн **1100px**.

### Дахин ашиглах

| Юу | Хаанаас |
|---|---|
| Талбар, сонголт | `CONTROL` — `components/FormField.tsx` |
| Толгойн шүүлтүүр | `FILTER_CONTROL` — `components/FormField.tsx` |
| Товч | `btn(tone, size)` — `components/buttons.ts` (`tone`: `ink` \| `outline`) |
| Унтраалга | `Toggle` — `components/Toggle.tsx` |
| Төлөвийн тэмдэг | `StatusPill` — `components/StatusPill.tsx` |

Эдгээрийг хуулж бичихгүй. Өмнө нь `CONTROL`-ын мөр дөрвөн файлд хуулагдаж,
хуулбар бүр нь хүрээгээ `border-gray-300` (1.47:1 — WCAG SC 1.4.11-ийн 3:1-ийг
давдаггүй) дээр үлдээсэн байв.

## LiveKit энд ХАМААРАХГҮЙ

`components/shows/ShowStatusPanel.tsx` дээрх **"Go Live Now"** товч нь LiveKit
дуудахгүй — зөвхөн mock store доторх статусыг `LIVE` болгож солино.

Бодит шууд дамжуулалт огт өөр газар:

```
app/(broadcast)/sell/page.tsx        → шууд дамжуулалт эхлүүлэх товч
app/(broadcast)/live/[id]/page.tsx   → өрөө
components/live/video-stage.tsx      → LiveKit room + token авах
```

Энэ хоёр хэсэг одоогоор **хоорондоо холбогдоогүй**. Seller Hub-ын шууд дамжуулалтыг бодит
шууд дамжуулалттай холбох бол тэр ажил энэ фолдерын гадна, `app/(broadcast)/` талд хийгдэнэ.
