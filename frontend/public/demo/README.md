# Үзүүлэнгийн барааны зураг

`server/scripts/seedDemoShop.ts` доторх `PRODUCTS` жагсаалт эндээс зураг татна
(`/demo/<файлын нэр>`). Next эдгээрийг статикаар түгээдэг тул Vercel Blob руу
байршуулах шаардлагагүй.

Хүлээгдэж буй файлууд:

| Файл | Бараа |
|---|---|
| `halfzip-pair.jpg` | Half-Zip Sweatshirt |
| `bomber-wool-brown.jpg` | Wool Bomber Jacket — Brown |
| `polo-knit-stone.jpg` | Knit Zip Polo — Stone |
| `tank-ribbed-charcoal.jpg` | Ribbed Tank Top — Charcoal |
| `trousers-navy-tailored.jpg` | Tailored Trousers — Navy |
| `bomber-leather-camel.jpg` | Leather Bomber Jacket — Camel |
| `bomber-leather-black.jpg` | Leather Bomber Jacket — Black |
| `trousers-navy-slim.jpg` | Slim Fit Trousers — Navy |

Файлын нэр өөр бол seed script доторх `IMG(...)` мөрүүдийг тааруулаад
`npm run seed:demo-shop` дахин ажиллуулна.
