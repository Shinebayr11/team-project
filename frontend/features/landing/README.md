# Landing

Нийтэд нээлттэй нүүр хуудас. **Landing-ийн бүх код энэ фолдерт байна.**

URL нь **`/`** (`app/(marketing)/page.tsx`). Route файл нь зөвхөн бүрхүүл: энэ
фолдерын screen-ийг render хийдэг, өөр логик агуулдаггүй.

`(marketing)` route group нь `AppShell`-гүй — landing өөрийн header/footer-тэй,
store-д хүрдэггүй. Layout нь `whynot-root` класс өгнө (`--wn-*` токенууд түүгээр
ажиллана) ба өөрийн дэвсгэрээ **transparent** болгоно: хуудсын өнгийг
`BackgroundMorph` зурдаг.

## Юу вэ

Scroll-оор удирдагддаг 6 section-ийн marketing хуудас. Доош гүйлгэхэд дэвсгэр
өнгө section хооронд тасалдалгүй шилжинэ. Ганц зорилго: нэвтрээгүй хүнийг
**Үнэгүй бүртгүүлэх** эсвэл **Худалдагч болох** руу оруулах.

| # | id | Дэвсгэр | Текст |
|---|----|---------|-------|
| 1 | `hero` | accent → accent-deep gradient | цагаан |
| 2 | `auction` | noir | цагаан |
| 3 | `wallet` | paper | noir |
| 4 | `sellers` | accent-soft | noir |
| 5 | `categories` | noir | цагаан |
| 6 | `cta` | accent | цагаан |

## Бүтэц

```
features/landing/
├── index.ts        Public surface — зөвхөн Landing screen-ийг export
├── motion.ts       Easing, duration, variant, SECTIONS — бүх тогтмол ЭНД
├── useAmplitude.ts reduced-motion / mobile-ийн далайцын нэгдсэн эх сурвалж
├── screens/        Landing.tsx — section-үүдийг угсарна (өгөгдөл татдаггүй)
└── components/
    ├── ScrollProvider    Lenis + идэвхтэй section (IntersectionObserver)
    ├── BackgroundMorph   fixed өнгө шилжих давхарга + blur blob-ууд
    ├── MarketingHeader   sticky header, tone-оор өнгө нь урвана
    ├── SectionShell      section бүрхүүл + ParallaxLayer (back/mid/front)
    ├── MaskText          үг тус бүрийн mask reveal + RevealSub / RevealCta
    ├── CtaButtons        PrimaryCta / GhostCta
    ├── HeroSection       phone mockup + хөвж буй картууд
    ├── AuctionSection    signature: ажиллаж буй дуудлага худалдааны карт
    ├── WalletSection     coin багцын 3 карт
    ├── SellerSection     dashboard карт, count-up статистик
    ├── CategoriesSection chip marquee 2 мөр + хайлтын mockup
    ├── CtaSection        төгсгөлийн CTA + footer
    └── SectionNavPill    доод navigation
```

## Motion

`lenis` (smooth scroll) + `framer-motion`. GSAP байхгүй. **Зөвхөн `transform`
болон `opacity`** анимэйт хийнэ — layout property-д хэзээ ч хүрэхгүй.

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

Landing дээр **растр зураг байхгүй**: phone mockup, coin карт, dashboard,
категорийн chip бүгд CSS/DOM-оор зурагдсан. LCP нь текст хэвээр үлдэж,
`next/image` шаардлагагүй болсон.

## Layer-ийн дүрэм

`screens/` бол өгөгдөлтэй холбогдох цорын ганц давхарга (одоогоор ямар ч
өгөгдөл татдаггүй). `components/` доторх юу ч `useStore`, `@/data`-г import
хийхгүй.

## `/` болон `/home`

`/` нь landing. Дэлгүүрийн feed нь **`/home`** (`app/(shop)/home/page.tsx`).
Апп доторх лого, "Home" таб, Explore-ын "View all" бүгд `/home` руу заана.
