# Landing v1.2 — STEP 0 код шалгалтын тайлан

Огноо: 2026-09-11 · Салбар: `feat/seller-analytics` · Хамрах хүрээ: `frontend/features/landing/**`

---

## 1. Section component-уудын жагсаалт

Route: `frontend/app/(marketing)/page.tsx` → `features/landing` (barrel) → `screens/Landing.tsx`.
`(marketing)/layout.tsx` нь `AppShell`-гүй, `whynot-root` класс өгөөд өөрийн дэвсгэрээ
`transparent` болгодог (өнгийг `BackgroundMorph` зурна).

| # | Файл | Үүрэг |
|---|------|-------|
| — | `app/(marketing)/page.tsx` | Route бүрхүүл, `<Landing />`-ээс өөр юу ч биш (5 мөр) |
| — | `features/landing/screens/Landing.tsx` | 6 section-ийг угсарна. Өгөгдөл татдаггүй, auth-аар салаалдаггүй |
| — | `features/landing/motion.ts` | Easing / duration / variants / `SECTIONS` / `PARALLAX` / `AUCTION` — бүх motion тогтмол |
| — | `features/landing/useAmplitude.ts` | `prefers-reduced-motion` + mobile → `amp` (0/0.5/1), `tilt`, `motionOn` |
| — | `components/ScrollProvider.tsx` | Lenis instance + идэвхтэй section (IntersectionObserver) + `scrollToSection` |
| — | `components/BackgroundMorph.tsx` | `fixed` өнгө шилжих давхарга, 2 blur blob, `document.body` өнгө sync |
| — | `components/SectionShell.tsx` | Section бүрхүүл (`min-h-100svh`, `overflow-hidden`) + `ParallaxLayer` (back/mid/front) |
| — | `components/MaskText.tsx` | Үг тус бүрийн mask reveal + `RevealSub` / `RevealCta`. `immediate` горим = CSS keyframe |
| — | `components/MarketingHeader.tsx` | Sticky header, tone-оор өнгө урвана, Clerk `useUser()` уншина |
| — | `components/SectionNavPill.tsx` | Доод "дараагийн section" товч |
| — | `components/CtaButtons.tsx` | `PrimaryCta` / `GhostCta` (аппын `ui/button`-оос тусдаа) |
| 1 | `components/HeroSection.tsx` | Гарчиг + CSS-ээр зурсан phone mockup + 3 хөвөгч карт |
| 2 | `components/AuctionSection.tsx` | Ажиллаж буй auction карт — rAF loop, таймер, bid мөрүүд, ялагч |
| 3 | `components/WalletSection.tsx` | **Зоосны** 3 багц (500 / 2,000 / 5,000 зоос) |
| 4 | `components/SellerSection.tsx` | Dashboard карт: 3 count-up статистик + 7 багана |
| 5 | `components/CategoriesSection.tsx` | Chip-үүдийн 2 мөр marquee + идэвхгүй хайлтын mockup |
| 6 | `components/CtaSection.tsx` | Төгсгөлийн CTA + footer |

**Брифээс зөрөх бүтэц (санаатай хадгална):** бриф `components/landing/*` ба `lib/motion.ts`
гэж заасан. Кодод аль хэдийн `features/landing/components/*` ба `features/landing/motion.ts`
байгаа бөгөөд feature-barrel дүрэм (`features/landing/README.md`) үүнийг тогтоосон.
**Шинэ зам үүсгэхгүй, байгаа дээр нь нэмнэ** — файл зөөх нь v1.2-т хамааралгүй diff үүсгэнэ.

---

## 2. Одоогийн animation / scroll механик

**Lenis холбогдсон уу — тийм.** `ScrollProvider` дотор instance үүсэж, хуудсын
`requestAnimationFrame`-ээр эргэдэг, `prefers-reduced-motion` үед огт үүсдэггүй.
Lenis-ийн суурь CSS нь `node_modules`-оос import хийгдээгүй, `app/globals.css` дотор
гараар хуулсан байна. GSAP байхгүй — бриф тавьсан хязгаарлалт аль хэдийн биелсэн.

Ашиглагдаж буй механикууд:

| Механик | Хаана | Тайлбар |
|---------|-------|---------|
| Lenis smooth scroll | `ScrollProvider` | `lerp .09`, `duration 1.1`. `scrollToSection` үүгээр явна |
| `useScroll({ target, offset })` | `SectionShell` | Section тус бүрийн `scrollYProgress` context-ээр доош дамжина |
| `useSpring` + `useTransform` | `ParallaxLayer` | Түүхий progress-ыг ХЭЗЭЭ Ч шууд холбодоггүй — бүгд spring-ээр |
| `useScroll().scrollY` (global) | `HeroSection`, `BackgroundMorph`, `MarketingHeader` | Гурван тусдаа хэрэглэгч |
| IntersectionObserver | `ScrollProvider` (`rootMargin -50%/-50%`) | Идэвхтэй section → header tone + nav pill |
| `useInView` | `AuctionSection`, `SellerSection` | Loop эхлүүлэх / count-up-ыг нэг удаа асаах |
| `whileInView` + variants | `MaskText`, `WalletSection`, `CategoriesSection` | `VIEWPORT = { once: true, amount: 0.4 }` |
| Цэвэр CSS keyframe | `.wn-rise` / `.wn-lift` (hero), `.wn-marquee` (categories) | LCP-г JS-ийн ард үлдээхгүйн тулд санаатай |
| Ганц `requestAnimationFrame` loop | `AuctionSection` | Таймер + bid + ялагч гурвуулаа нэг timestamp дээр |
| `ResizeObserver(document.body)` | `BackgroundMorph` | Section-ийн голыг дахин хэмжинэ |

**Дүгнэлт:** motion суурь нь брифийн шаардлагад аль хэдийн 80% нийцсэн байна —
`transform`/`opacity` л animate хийдэг, reduced-motion бүрэн унтардаг, mobile дээр далайц
50%, тогтмолууд нэг файлд. **Шинээр motion layer бичих шаардлагагүй, өргөтгөнө.**

Дутуу байгаа зүйлс: (а) scroll-linked **sticky** section огт байхгүй, (б) `AnimatePresence`
хаана ч ашиглагдаагүй, (в) `layoutId` ашиглагдаагүй, (г) `dynamic(..., { ssr: false })`
lazy импорт байхгүй — бүх section эхний bundle-д орно.

---

## 3. Асуудлууд

### 3.1 Placeholder визуал (брифийн үндсэн гомдол — батлагдав)

`public/` дотор `.gitkeep`-ээс өөр файл байхгүй. Landing дээр **растр зураг ганц ч алга** —
энэ нь `features/landing/README.md` дээр санаатай шийдвэр гэж бичигдсэн («LCP нь текст хэвээр»).
Үр дүнд:

- `HeroSection.tsx:153-157` — phone mockup нь radial-gradient гэрэл + саарал `linear-gradient`
  тэгш өнцөгт. Хүн байхгүй, Dynamic Island байхгүй, титан хүрээ байхгүй.
- `HeroSection.tsx:180` — 3 хөвөгч картын "зураг" нь `bg-gradient-to-br from-white/25 to-white/5`,
  өөрөөр хэлбэл 56px өндөртэй саарал блок.
- `CategoriesSection` — бүтээгдэхүүн огт байхгүй, зөвхөн текст chip.

**Энэ нь ухамсартай trade-off байсныг тэмдэглэх нь чухал:** зураг нэмэх нь LCP-г текстээс
зураг руу шилжүүлнэ. Тиймээс §5-д тусгасан хэмжилтийн нөхцөл заавал биелэх ёстой.

### 3.2 Mobile дээр hero-гийн картууд БҮРЭН алга

`HeroSection.tsx:172` — `className="absolute hidden ... sm:block"`. 375px дээр гурвуулаа
`display:none`. Бриф «mobile дээр 2 болж багасна» гэсэн — одоо 0 байна. Явцуу дэлгэц дээр
hero-гийн баруун талд зөвхөн 240px өргөнтэй утас үлдэж, hero хоосон харагдана.

### 3.3 `SectionShell` дээрх `overflow-hidden` нь STEP 3-ыг блоклоно

`SectionShell.tsx:74` — бүх section дээр `overflow-hidden`. CSS-ийн дүрмээр `overflow`
`visible`-ээс өөр байх эцэг доторх `position: sticky` **ажиллахгүй**. STEP 3-ын
«3 алхамт horizontal flow, sticky section» үүнийг тойрч гарах ёстой:
`overflow-hidden`-ыг section-ээс салгаж дотоод wrapper (marquee, blob) дээр л үлдээнэ,
эсвэл тухайн section-д `overflow-visible` prop нэмнэ.

### 3.4 Кирилл фонт ачаалагддаггүй

`app/layout.tsx:28-35` — `Plus_Jakarta_Sans` болон `Bricolage_Grotesque` хоёулаа
`subsets: ["latin"]`. Энэ хоёр гарнитур Google Fonts дээр **кирилл subset огт нийлүүлдэггүй**.
Хуудасны бүх текст монгол кирилл тул `--wn-font` / `--wn-font-display` нь бодит байдал дээр
хэзээ ч хэрэглэгддэггүй — `system-ui` руу унана (macOS дээр SF, Windows дээр Segoe).
Дизайн токен «Plus Jakarta Sans» гэж бичигдсэн ч дэлгэц дээр огт харагдахгүй байна.
`Inter` нь `["latin","cyrillic"]`-тэй тул `--font-sans` л зөв ажиллаж байна.

### 3.5 Hardcode өнгө

| Байршил | Утга | Тайлбар |
|---------|------|---------|
| `motion.ts:95-100` | `#5b3fe0`, `#0e0b18`, `#fbfaff`, `#f1edfe` | **Зөвтгөгдсөн** — `useTransform` нь `var()` string interpolate хийж чаддаггүй. Токентой давхардаж байгааг comment-д тэмдэглэсэн |
| `MarketingHeader.tsx:92,111`, `CtaButtons.tsx:33` | `#241f35` | Токенгүй hover өнгө, 3 газар давхардсан |
| `BackgroundMorph.tsx:147,156` | `#7c5cff`, `#c9b8ff` | Blob-ийн өнгө, токенгүй |
| `HeroSection.tsx:153` | `#2a2440` | Phone дэлгэцийн gradient, токенгүй |
| `analytics/SalesChart.tsx:26-32` | 5 hex | **Зөвтгөгдсөн** — Recharts SVG attribute дотор `var()` тайлдаггүй |

Брифийн `#C9F73D` (lime) **кодод огт байхгүй**. v1.2-т active accent болгож нэвтрүүлэх бол
`--wn-lime` токен шинээр нэмэх шаардлагатай.

### 3.6 Давхардсан style / logic

- `app/globals.css` дотор `.dark { ... }` блок **хоёр удаа** тодорхойлогдсон (нэг нь өнгөт
  oklch, нөгөө нь бүрэн саарал шаблон) — хоёр дахь нь эхнийхийг бүрэн дардаг. Landing-д
  шууд нөлөөлөхгүй ч токен уншихад төөрөгдөл үүсгэнэ.
- Мянгатын тусгаарлагчийн ижил `replace(/\B(?=(\d{3})+(?!\d))/g, ",")` regex **3 газар**
  давхардсан: `AuctionSection.formatPrice`, `SellerSection.group`, мөн аппын өөр газруудад
  `toLocaleString()` хэлбэрээр. Landing дотор нэг helper болгоно.
- Global `useScroll()` **3 удаа** дуудагдана (`HeroSection`, `BackgroundMorph`,
  `MarketingHeader`). Бриф «scroll-linked section-ууд ганц source-оос удирдагдана» гэсэн —
  `ScrollProvider` дотроос `scrollY`-г context-оор тараах нь зөв.

### 3.7 Layout shift (CLS)

Одоогийн байдлаар **CLS эрсдэл бага**: зураг байхгүй, auction картын bid жагсаалт
`min-h-[156px]`-ээр, ялагчийн badge `h-[34px]`-ээр урьдчилан захиалагдсан (сайн загвар).

Эрсдэл нь **v1.2-т үүснэ**: зураг нэмэхэд `next/image` + тогтмол `aspect-ratio` + `priority`
+ blur placeholder заавал. Мөн `BackgroundMorph` нь `ResizeObserver`-оор section-ийн голыг
хэмждэг тул зураг ачаалагдах бүрд дахин хэмжилт хийгдэнэ — тэр нь өөрөө layout shift биш
боловч дэвсгэрийн өнгө "үсрэх" эрсдэлтэй (одоо `document.body` дээр давхар бичдэг тул
илэрсэн асуудал алга).

### 3.8 Бусад

- `AuctionSection.tsx:265` — module-level mutable `let bidId` counter. Ганц instance байгаа
  тул ажиллаж байгаа ч HMR/олон instance үед сэжигтэй.
- `CategoriesSection.tsx:96` — `w-screen -translate-x-1/2 left-1/2`. Эцэг нь `overflow-hidden`
  тул одоо аюулгүй; §3.3-ын дагуу `overflow`-г салгавал энэ мөр хэвтээ scrollbar үүсгэнэ.
- `MarketingHeader` нь Clerk `useUser()` дууддаг тул landing бүрэн статик байсан ч Clerk-ийн
  клиент bundle ачаалагдана. (`proxy.ts` нь `/`-д middleware алгасдаг — тэр нь тусдаа, зөв.)
- `CtaSection` дээр `className="content-between"` өгсөн ч `SectionShell` нь
  `place-items-center` grid — `content-between` нь мөрийн тоо 1 үед нөлөөгүй.

---

## 4. Section тус бүрийн шийдвэр

| # | Section | Шийдвэр | Шалтгаан |
|---|---------|---------|----------|
| — | `ScrollProvider` | **Хадгална + өргөтгөнө** | Lenis + IO аль хэдийн зөв. `scrollY`-г context-оор тараах нэмэлт (§3.6) |
| — | `SectionShell` / `ParallaxLayer` | **Хадгална + засна** | `overflow` prop нэмнэ (§3.3). Бусад нь хэвээр |
| — | `MaskText`, `CtaButtons`, `SectionNavPill` | **Хадгална** | Асуудалгүй |
| — | `BackgroundMorph` | **Хадгална** | v1.2-ын шинэ section-ийн `bg`-г `SECTIONS`-д шинэчлэхэд л хангалттай |
| — | `MarketingHeader` | **Хадгална** | Зөвхөн `SECTIONS` label өөрчлөлтөөс шууд хамаарна |
| 1 | `HeroSection` | **Дахин бичнэ (visual), motion-оо хадгална** | Phone mockup → бодит iPhone frame (SVG/CSS) + live seller зураг; 3 карт → бодит product зураг; mouse-follow tilt нэмэх; mobile дээр 2 карт харуулах (§3.2). Exit-parallax логик нь хэвээр зөв |
| 2 | `AuctionSection` | **STEP 3 рүү нэгтгэнэ** | v1.2-ын Section 3 нь дуудлага худалдаа + хэтэвчний нэгдсэн narrative. Одоогийн rAF loop нь ГОЛ ХӨРӨНГӨ — anti-snipe таймер, bid мөр, ялагч бүгд ажиллаж байна. Кодыг нь дахин ашиглаж, дээр нь 3 алхамт sticky flow + хэтэвчний баланс demo нэмнэ |
| 3 | `WalletSection` | **УСТГАНА (бүрэн)** | Зоос/coin ойлголт хасагдсан. Файл бүхэлдээ, `SECTIONS`-ийн `wallet` мөр, "Зоосны хэтэвч" label бүгд явна |
| 4 | `SellerSection` | **Дахин бичнэ** | Одоогийн 3 stat + 7 багана нь `/seller/analytics`-ийн бодит дэлгэцтэй огт таарахгүй. 5 KPI + line chart (`pathLength` 0→1) + tab morph (`layoutId`) болгоно. `CountUp` компонентыг шууд дахин ашиглана |
| 5 | `CategoriesSection` | **Дахин бичнэ** | Chip marquee → typewriter хайлт + `AnimatePresence` бүтээгдэхүүний background swap. Идэвхгүй хайлтын mockup нь одоо ямар ч утга үүсгэхгүй байна |
| 6 | `CtaSection` | **Хадгална** | Асуудалгүй, footer-той нэг section дотор зөв суусан |

Үүний дүнд `SECTIONS` 6 → 5 болно:
`hero` → `auction` (шинэ нэр: «Дуудлага худалдаа») → `sellers` → `shop` → `cta`.

---

## 5. Хэрэгжүүлэхээс өмнө шийдэх ёстой 3 зүйл

### 5.1 ⚠️ `/createimage` энэ session-д БАЙХГҮЙ

Зураг үүсгэх tool энэ орчинд холбогдоогүй байна (Canva, Figma, Gemini connector-ууд
**authorize хийгдээгүй** — тэдгээрийг claude.ai-ийн connector тохиргоо, эсвэл интерактив
session дээр `/mcp`-ээр зөвшөөрөх шаардлагатай). Тиймээс STEP 1-ийн 4 зураг, STEP 4-ийн
24 ангиллын зургийг **би энэ ажлын хүрээнд үүсгэж чадахгүй**.

Гурван сонголт:

1. **Connector-оо authorize хийнэ** → дараа нь зургуудыг үүсгээд `public/landing/`-д хийнэ.
2. **Та зургаа өгнө** → би `public/landing/` бүтэц, `next/image` дуудалт, alt текстийг
   бэлэн болгож, файл орж ирэхэд шууд ажиллахаар үлдээнэ.
3. **Зурагг��й хувилбар** → iPhone frame, Dynamic Island, product card бүгдийг SVG/CSS-ээр
   зурна (одоогийн арга барилын үргэлжлэл). Live seller portrait-ыг л орлуулах боломжгүй.

**Зөвлөмж:** 3-р сонголтоор frame/card-уудыг SVG-ээр бүрэн хийчихээд (тэдэнд гадны зураг
хэрэггүй гэж бриф өөрөө хэлсэн), зөвхөн 4 бодит фото (seller portrait + 3 product) орох
`<Image>` цэгүүдийг placeholder-тайгаар бэлдэх. Зураг ирмэгц ганц фолдерт хийхэд бэлэн болно.

### 5.2 ⚠️ Coin нь backend дээр амьд байна

Бриф «coin ойлголт байхгүй болсон» гэсэн. Гэвч кодод:

- `server/src/route/cointransactionRoute.ts`, `controllers/cointransactionController.ts` — бүтэн resource
- `server/src/controllers/walletController.ts`
- `hooks/useWallet.ts` — `coin_balance`, `held_coins`
- `components/live/auction-bid-panel.tsx` — `current_highest_bid_coins`, `starting_price_coins`
- Нийт **30 орчим файлд** зоос/coin ойлголт тархсан (`components/screens/Wallet.tsx`,
  `auction-bid-modal.tsx`, `bids-panel.tsx`, `ProductAuctionPanel.tsx`, `useAuction.ts` г.м.)

Өөрөөр хэлбэл **landing нь ₮-ээр ярих ч, бүтээгдэхүүн нь зоосоор ажиллана**. Брифийн хамрах
хүрээ («Section 3-ын coin-той холбоотой код л бүрэн дахин бичигдэнэ») дагуу **би зөвхөн
landing-ийг ₮ рүү шилжүүлнэ**. Апп доторх coin-ыг ₮ болгох нь тусдаа, backend-тэй хамт хийх
migration — энэ ажилд оруулахгүй. Хэрэв landing-ийн амлалт бодит бүтээгдэхүүнтэй таарах ёстой
бол дараагийн даалгавар болгож тавина уу.

### 5.3 `/api/search` байхгүй

`server/src/route/` дотор search route алга (`productRoute`, `categoryRoute` л бий).
STEP 4-ийн debounce-той suggestion-ыг **mock adapter** дээр бичиж, `TODO`-той үлдээнэ —
бриф өөрөө үүнийг зөвшөөрсөн.

---

## 6. Дараагийн алхамд хийх зүйлсийн дараалал

1. `SECTIONS` шинэчлэх (wallet устгах, shop нэмэх, label засах) — бүх section үүнээс хамаарна
2. `SectionShell`-д `overflow` prop (sticky-г нээх)
3. `ScrollProvider`-оос global `scrollY` context тараах
4. `--wn-lime` токен + `#241f35` → `--wn-noir-hover` токен нэмэх
5. STEP 3 (auction + хэтэвч, coin устгах) — хамгийн том, эрсдэлтэй нь
6. STEP 2 (seller analytics), STEP 4 (дэлгүүр/хайлт)
7. STEP 1 (hero) — зураг ирмэгц эсвэл SVG хувилбараар
8. Кирилл фонтын асуудлыг (§3.4) шийдэх эсэхийг тусад нь шийднэ

---

# Хэрэгжүүлэлт — юу өөрчлөгдсөн (v1.2)

STEP 1-ийг сүүлд үлдээж, STEP 3 → 2 → 4 → 1 дарааллаар хийв.

## Суурь

| Өөрчлөлт | Файл |
|----------|------|
| `SECTIONS` 6 → 5 (`wallet` устсан, `categories` → `shop`) | `motion.ts` |
| `SectionShell`-д `clip` / `innerClassName` prop — sticky-г нээв (§3.3) | `SectionShell.tsx` |
| Scroll-ын ГАНЦ эх сурвалж: `useLandingScroll().scrollY` (§3.6 — 3 listener → 1) | `ScrollProvider.tsx` + 3 хэрэглэгч |
| `useAmplitude`-д `wide` (`lg`) нэмэв | `useAmplitude.ts` |
| `--wn-lime`, `--wn-noir-hover` токен; `#241f35` × 3 → токен (§3.5) | `globals.css`, `MarketingHeader`, `CtaButtons` |
| `groupNumber()` — давхардсан regex × 3 → нэг helper (§3.6) | `format.ts` (шинэ) |
| `MediaSlot` — зургийн ганц үүд, blur placeholder, CLS 0 | `MediaSlot.tsx` (шинэ) |
| Үхмэл код устгав: `.wn-marquee` CSS (26 мөр), `listVariants`/`itemVariants` | `globals.css`, `motion.ts` |

## Section тус бүр

**STEP 3 — `auction` (бүрэн дахин бичсэн).** Зоос бүрмөсөн устсан.
`WalletSection.tsx` устав. Section нь `lg`-ээс дээш **sticky** (280svh зам):
гүйлгэхэд Цэнэглэх → Санал өгөх → Ялвал суутгана гэсэн 3 алхам солигдоно.
Карт: anti-snipe таймер (санал бүрд 10 сек сэргэнэ), улаан progress bar,
мөрүүд доороос дээш slide-in + lime гялбаа, үнэ `AnimatePresence`-ээр roll.
Данс `120,000₮ → 89,000₮` (−31,000₮ = ялсан дүн) болж буурна. Ялагч Болдоо,
3 секундын дараа loop. Бүхэл loop ганц `requestAnimationFrame` дээр.

**STEP 2 — `sellers` (дахин бичсэн).** `/seller/analytics`-ийн яг таван KPI
(Нийт / Цэвэр борлуулалт, Захиалга, Зарагдсан бараа, Дундаж захиалгын дүн),
харагдмагц count-up. "Борлуулалтын үзүүлэлт" график нь **гараар бичсэн SVG** —
`pathLength` 0→1 (1.4s), дараа нь 7 цэг 80ms-ийн зайтай гарна. Орлого /
Захиалга / Бараа таб hover-оор солигдож, 3.4 секунд тутам өөрөө эргэнэ;
идэвхтэй табын товгор `layoutId`-аар шилжинэ. recharts landing-д ОРООГҮЙ.

**STEP 4 — `shop` (`categories`-ийг сольсон).** Төвд хайлтын мөр, ангиллын нэр
өөрөө бичигдэж арилна (Гар утас → Пүүз → Цуглуулгын карт → Гоо сайхан →
Хувцас → Эртний эдлэл). Үг арилах бүрд ард талын 4 бүтээгдэхүүн бүхэлдээ
солигдоно (`AnimatePresence mode="wait"`, stagger 60ms, crossfade + scale +
blur). 3D perspective + хулганы parallax. Бичихэд typewriter зогсож, 250ms
debounce-той хайлт ажиллана.

**STEP 1 — `hero` (визуалыг дахин бичсэн, motion-ыг хадгалсан).** Утас нь
бодит төхөөрөмж болов: титан gradient хүрээ, хар bezel, **Dynamic Island**,
хажуугийн 4 товч. Дэлгэц дээр борлуулагчийн зургийн слот + `● ШУУД` + үзэгчийн
тоо + chat 3 мөр + "Шууд авах 89,000₮ / Авах". Хулгана дагасан налалт ≤6°
(гадна давхарга scroll-ын гаралт, дотор нь налалт — хоёр `rotateX` мөргөлдөхгүй).
Картууд ±8px, 4.4–6s float; **mobile дээр 3 биш 2** (§3.2 засагдав).

## Шалгасан

`tsc --noEmit` ✓ · `eslint` ✓ (0 error, 0 warning) · `prettier` ✓ ·
`next build` ✓ (`/` статикаар prerender хэвээр).

Хөтөч дээр 375 / 768 / 1280 / 1440 / 1536 өргөнд: **хэвтээ overflow 0**.
Sticky нь 1440/1536 дээр ажиллаж, 768/375 дээр зөв унтарч байна. Scroll-д
уясан алхам 1 → 2 → 3 болж солигдож байгааг хэмжив. График 7 цэг, 7 dot,
зөв `d` замтай. Hero 375 дээр 2 карт, 1440 дээр 3.

## Үлдсэн TODO

1. **Зураг (блокер).** 4 фото цэг `src: null` хэвээр — `HeroSection.FLOATERS`,
   `PhoneMockup`, `shopCatalog.ts` (6 ангилал × 4). Зураг үүсгэх connector
   энэ session-д authorize хийгдээгүй. Файлыг `public/landing/*.webp`-д хийгээд
   `null`-ыг замаар нь солиход л ажиллана — өөр код засахгүй.
2. **`/api/search` (§5.3).** `shopCatalog.ts`-ийн `searchShop()` нь одоогоор
   локал mock. Endpoint нэмэгдмэгц функцийн биеийг `apiFetch` болгож солино.
3. **Coin migration (§5.2).** Backend болон апп (~30 файл) зоосоор ажилласаар.
   Landing одоо ₮-ээр ярьж байгаа тул зөрүү нээлттэй.
4. **Кирилл фонт (§3.4).** Plus Jakarta Sans / Bricolage кирилл дэмждэггүй тул
   монгол текст system-ui дээр гарсаар. Гарнитур солих эсэхийг шийдээгүй.
5. **Lighthouse хэмжээгүй.** Хөтчийн самбар нуугдмал байсан тул `rAF` зогсож,
   таймер/Lenis-ийн бодит гүйцэтгэлийг энэ орчинд хэмжих боломжгүй байв.
   Бүтэц, геометр, breakpoint-ыг DOM-оос хэмжиж баталгаажуулав.
6. **`dynamic(..., { ssr: false })` ЗОРИУДААР хийгээгүй.** Брифэд байсан ч
   marketing хуудсын текстийг HTML-ээс хасах нь SEO-г шууд алдагдуулна.
   Үүний оронд бүх хүнд зүйл (auction loop, chart, typewriter) `useInView`-оор
   хаалттай — дэлгэцэд ороогүй бол ганц ч frame эргэдэггүй.
