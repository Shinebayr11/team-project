# Landing-ийн зургууд

Эх файлууд: `~/Desktop/landing zurag/`. Эндэхийг **гараар засахгүй** — доорх
скриптээр дахин үүсгэнэ.

```bash
cd frontend && python3 scripts/build-landing-images.py
```

Босоо/дөрвөлжин эх зургийг **center-crop**-оор харьцаанд нь оруулна. Жинхэнэ
хэвтээ зургийг (машин, MacBook) тайрахгүй — бүтнээр нь голд тавьж, ард нь
өөрийнх нь бүдгэрүүлсэн хуулбарыг дэвсгэр болгоно. Хиймэлээр томруулахгүй тул
гаралтын хэмжээ файл бүрд өөр.

Нийт 24 файл, 784 KB.

| Файл | Юу вэ | Харьцаа · хэмжээ | Хэмжээ | Хаана |
|------|-------|------------------|--------|-------|
| `seller-live.webp` | Эфирт хувцсаа үзүүлж буй хүн | 9:19.5 · 620×1343 | 50 KB | Hero — утасны дэлгэц |
| `carhartt-detroit.webp` | Ногоон Carhartt Detroit | 4:5 · 640×800 | 67 KB | Hero карт + Гадуур хувцас |
| `seiko-lm.webp` | Улаан Seiko LM Special | 4:5 · 640×800 | 42 KB | Hero карт + Дуудлага худалдаа |
| `leather-bag.webp` | Хүрэн арьсан цүнх | 4:5 · 640×800 | 20 KB | Hero карт + Пүүз ба цүнх |
| `wool-bomber.webp` | Хүрэн ноосон бомбер | 4:5 · 640×800 | 20 KB | Гадуур хувцас |
| `leather-jacket.webp` | Хар арьсан хүрэм | 4:5 · 563×704 | 37 KB | Гадуур хувцас |
| `carhartt-akira.webp` | Carhartt × Akira | 4:5 · 640×800 | 56 KB | Гадуур хувцас |
| `yellow-dress.webp` | Шар даашинз | 4:5 · 640×800 | 57 KB | Энгийн хувцас |
| `striped-shirt.webp` | Судалтай цамц | 4:5 · 393×491 | 26 KB | Энгийн хувцас |
| `trousers.webp` | Албаны өмд | 4:5 · 563×704 | 9 KB | Энгийн хувцас |
| `jordan-1.webp` | Air Jordan 1 Chicago | 4:5 · 386×482 | 11 KB | Пүүз ба цүнх |
| `air-force-1.webp` | Nike Air Force 1 | 4:5 · 614×768 | 92 KB | Пүүз ба цүнх |
| `burgundy-bag.webp` | Бордо арьсан цүнх | 4:5 · 524×655 | 31 KB | Пүүз ба цүнх |
| `rhode-lip-tint.webp` | Rhode уруулын тос | 4:5 · 459×574 | 23 KB | Гоо сайхан ⚠️ |
| `inglot-lip-pencil.webp` | Inglot харандаа | 4:5 · 372×465 | 2 KB | Гоо сайхан |
| `makeup-brushes.webp` | Будгийн сойзны багц | 4:5 · 640×800 | 37 KB | Гоо сайхан |
| `iphone.webp` | iPhone Pro | 4:5 · 377×471 | 7 KB | Технологи ⚠️ |
| `macbook.webp` | MacBook Pro | 4:5 · 234×292 | 8 KB | Технологи |
| `smart-tv.webp` | Ухаалаг зурагт | 4:5 · 640×800 | 37 KB | Технологи |
| `marshall-major.webp` | Marshall Major IV | 4:5 · 640×800 | 41 KB | Технологи |
| `logitech-superlight.webp` | Logitech Superlight | 4:5 · 276×345 | 3 KB | Технологи |
| `toyota-camry.webp` | Toyota Camry | 4:5 · 640×800 | 33 KB | Дуудлага худалдаа |
| `atomic-habits.webp` | Atomic Habits ном | 4:5 · 480×600 | 65 KB | Дуудлага худалдаа |
| `sunglasses.webp` | Нарны шил | 4:5 · 640×800 | 11 KB | Дуудлага худалдаа |

## ⚠️ Дахин үүсгэж БОЛОХГҮЙ хоёр файл

`rhode-lip-tint.webp` болон `iphone.webp` — тэдний эх файл (`images (1).jpeg`,
`images (2).jpeg`) дараа нь Atomic Habits ном болон Logitech хулганаар **дарж
бичигдсэн**. Гаралтын webp нь энд бүтэн байгаа ба скрипт тэдэнд хүрэхгүй.
Эх зураг нь дахин олдвол `scripts/build-landing-images.py`-ийн `JOBS`-д буцааж
нэмнэ.
