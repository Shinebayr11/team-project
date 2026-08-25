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

## LiveKit энд ХАМААРАХГҮЙ

`components/shows/ShowStatusPanel.tsx` дээрх **"Go Live Now"** товч нь LiveKit
дуудахгүй — зөвхөн mock store доторх статусыг `LIVE` болгож солино.

Бодит шууд дамжуулалт огт өөр газар:

```
app/(broadcast)/sell/page.tsx        → шоу эхлүүлэх товч
app/(broadcast)/live/[id]/page.tsx   → өрөө
components/live/video-stage.tsx      → LiveKit room + token авах
```

Энэ хоёр хэсэг одоогоор **хоорондоо холбогдоогүй**. Seller Hub-ын шоуг бодит
дамжуулалттай холбох бол тэр ажил энэ фолдерын гадна, `app/(broadcast)/` талд хийгдэнэ.
