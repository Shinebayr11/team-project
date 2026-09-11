# Landing

Нийтэд нээлттэй нүүр хуудас. **Landing-ийн бүх код энэ фолдерт байна.**

URL нь **`/`** (`app/(marketing)/page.tsx`). Route файл нь зөвхөн бүрхүүл: энэ
фолдерын screen-ийг render хийдэг, өөр логик агуулдаггүй.

`(marketing)` route group нь `AppShell`-гүй — landing өөрийн header/footer-тэй,
store-д хүрдэггүй. Layout нь `whynot-root` класс өгнө (`--wn-*` токенууд түүгээр
ажиллана) ба өөрийн дэвсгэрээ **transparent** болгоно: хуудсын өнгийг
`BackgroundMorph` зурдаг.

## Юу вэ

Scroll-оор удирдагддаг 5 section-ийн marketing хуудас. Доош гүйлгэхэд дэвсгэр
өнгө section хооронд тасалдалгүй шилжинэ. Ганц зорилго: нэвтрээгүй хүнийг
**Бүртгүүлэх** эсвэл **Худалдагч болох** руу оруулах.

| # | id | Дэвсгэр | Текст | Юу вэ |
|---|----|---------|-------|-------|
| 1 | `hero` | accent → accent-deep gradient | цагаан | Утасны mockup + хөвөгч бараа |
| 2 | `auction` | noir | цагаан | Ажиллаж буй дуудлага худалдаа + данс (**sticky**) |
| 3 | `sellers` | accent-soft | noir | `/seller/analytics`-ийн бяцхан хувилбар |
| 4 | `shop` | noir | цагаан | Хайлт + солигдох бүтээгдэхүүн |
| 5 | `cta` | accent | цагаан | Төгсгөлийн CTA + footer |

### Зоос БАЙХГҮЙ

Хэрэглэгч дансаа **шууд ₮-өөр** цэнэглээд дуудлага худалдаанд оролцоно.
Өмнөх `wallet` section (500 / 2,000 / 5,000 зоосны багц) бүрмөсөн устсан.

Апп болон backend дээр ч энэ ойлголт үлдээгүй — бүх текст, тайлбар ₮-ийн
үлдэгдлээр ярина. Өгөгдлийн сангийн талбарын нэрс (`coin_balance`,
`held_coins`, `CoinTransaction`, `*_bid_coins`) хуучнаараа хэвээр: тэдгээрийг
сольход өгөгдөл нүүлгэх шаардлагатай тул тусдаа ажил болно.

## Бүтэц

```
features/landing/
├── index.ts        Public surface — зөвхөн Landing screen-ийг export
├── motion.ts       Easing, duration, variant, SECTIONS — бүх тогтмол ЭНД
├── format.ts       groupNumber — locale-ээс хамааралгүй мянгатын тусгаарлагч
├── shopCatalog.ts  Дэлгүүрийн section-ий үзүүлэн + хайлтын adapter
├── useAmplitude.ts reduced-motion / mobile / wide — орчны нэгдсэн эх сурвалж
├── screens/        Landing.tsx — section-үүдийг угсарна (өгөгдөл татдаггүй)
└── components/
    ├── ScrollProvider    Lenis + ГАНЦ scrollY + идэвхтэй section
    ├── BackgroundMorph   fixed өнгө шилжих давхарга + blur blob-ууд
    ├── MarketingHeader   sticky header, tone-оор өнгө нь урвана
    ├── SectionShell      section бүрхүүл + ParallaxLayer (back/mid/front)
    ├── MaskText          үг тус бүрийн mask reveal + RevealSub / RevealCta
    ├── MediaSlot         зургийн ганц үүд (next/image эсвэл placeholder)
    ├── CtaButtons        PrimaryCta / GhostCta
    ├── HeroSection       CSS утасны frame + хөвж буй барааны картууд
    ├── AuctionSection    signature: sticky 3 алхам + ажиллаж буй карт + данс
    ├── SellerSection     analytics самбар: 5 KPI + SVG зурааст график
    ├── ShopSection       typewriter хайлт + солигдох бүтээгдэхүүний үүл
    ├── CtaSection        төгсгөлийн CTA + footer
    └── SectionNavPill    доод navigation
```

## Motion

`lenis` (smooth scroll) + `framer-motion`. GSAP байхгүй. **Зөвхөн `transform`
болон `opacity`** анимэйт хийнэ — layout property-д хэзээ ч хүрэхгүй.
(Ганц үл хамаарах зүйл: `ShopSection`-ий картууд багц солигдох 0.45 секундэд
`filter: blur` дамжина. Энэ нь GPU-composited бөгөөд давтагддаг loop БИШ.)

- **Scroll-ын эх сурвалж** — `ScrollProvider` дотор ГАНЦ `useScroll()`. Hero,
  BackgroundMorph, header гурвуулаа `useLandingScroll().scrollY`-оос уншина.
- **Sticky** — `auction` section л sticky. Тиймээс тэр ганцаараа
  `<SectionShell clip={false}>`: `overflow: hidden` эцэг доторх `position:
  sticky` ажилладаггүй. Sticky нь `lg`-ээс дээш л асна — нарийн дэлгэц дээр
  агуулга 100svh-д багтахгүй тул наавал доод тал нь харагдахгүй үлдэнэ.

- **Дэвсгэрийн шилжилт** — `BackgroundMorph` нь section-үүдийн бодит DOM голыг
  хэмжиж, дэлгэцийн гол хоёр section-ийн голын хооронд хаана явааг "бутархай
  индекс" болгож бодоод, түүнийг өнгө рүү interpolate хийнэ. Section-ууд ижил
  өндөртэй байх шаардлагагүй (mobile дээр контентоос хамаарч өснө).
  Замын эхний/сүүлийн 30%-д өнгө хөдөлдөггүй, дунд 40%-д нь шилжинэ.
- **Parallax** — `<ParallaxLayer depth="back|mid|front">`. Түүхий
  `scrollYProgress`-ыг ХЭЗЭЭ Ч шууд холбохгүй; бүгд `useSpring`-ээр дамжина.
- **Reduced motion** — `useAmplitude()` нь далайцыг 0 болгож, Lenis, loop,
  marquee, float бүгд унтарна. Mobile (< 768px) дээр далайц 50%, rotateX 0.

### Hero-гийн reveal нь CSS, framer-motion БИШ

`MaskText`-ийн `immediate` горим (зөвхөн hero) нь `.wn-rise` / `.wn-lift` CSS
keyframe ашиглана (`app/globals.css`). Шалтгаан: hero-гийн гарчиг бол хуудсын
LCP элемент бөгөөд framer-motion-ы `initial="hidden"` түүнийг hydration болтол
`opacity: 0`-оор барьдаг — удаан утсан дээр LCP ~1 секундээр хойшилдог.
Доод section-ууд viewport-оос гадна эхэлдэг тул framer-motion дээрээ хэвээр.

## `/` нь Clerk-ийг алгасдаг

`proxy.ts` нь `/` замд `clerkMiddleware`-ийг огт дуудахгүй. Landing бүрэн статик,
auth төлөвөөр салаалдаггүй, middleware нь ч зөвхөн `/seller(.*)`-ыг хамгаалдаг.
Гэтэл clerkMiddleware эхний зочинд dev-browser handshake хийж хуудсыг нэг
эргүүлдэг — TTFB ~1.5s нэмэгддэг. Бусад бүх зам хэвээрээ дамжина.

## Зураг

**Бүтэц нь бэлэн, файл нь дутуу.** Утасны хүрээ, dashboard, график бүгд
CSS/SVG-ээр зурагдсан (гадны ассет татахгүй) — эдгээрт зураг ХЭРЭГГҮЙ.

Бодит фото орох 4 цэг байгаа ба бүгд `<MediaSlot>` дундуур явна:

| Хаана | Юу | `src` |
|-------|-----|-------|
| `HeroSection` → `PhoneMockup` | Эфирт байгаа борлуулагч (9:19.5) | `null` |
| `HeroSection` → `FLOATERS` | Ретро хүрэм / Пүүз / Ховор карт (4:5) | `null` |
| `ShopSection` | Ангилал тус бүрд 4 бараа (4:5) | `shopCatalog.ts` |

`src === null` үед токеноор зурсан дэвсгэр гарна. Хайрцгийн `aspect-ratio` нь
ОДООНООС тогтоогдсон тул зураг нэмэхэд layout огт хөдлөхгүй (**CLS 0**).
Зураг бэлэн болмогц `public/landing/*.webp` руу хийгээд `null`-ыг замаар нь
солиход л хангалттай — өөр файл засах шаардлагагүй.

## Layer-ийн дүрэм

`screens/` бол өгөгдөлтэй холбогдох цорын ганц давхарга (одоогоор ямар ч
өгөгдөл татдаггүй). `components/` доторх юу ч `useStore`, `@/data`-г import
хийхгүй.

## `/` болон `/home`

`/` нь landing. Дэлгүүрийн feed нь **`/home`** (`app/(shop)/home/page.tsx`).
Апп доторх лого, "Home" таб, Explore-ын "View all" бүгд `/home` руу заана.
