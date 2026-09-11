Prerequisites:

- [Vercel CLI](https://vercel.com/docs/cli) installed globally

To develop locally:

```
npm install
vc dev
```

```
open http://localhost:3000
```

To build locally:

```
npm install
vc build
```

To deploy:

```
npm install
vc deploy
```

## Төлбөр (Wire)

Хэтэвч цэнэглэх төлбөрийг [Wire](https://wire.mn) дамжуулна (QPay оператор).
Урсгал: `POST /api/payment/topup` → `payment_intent` үүсгээд `confirm` хийнэ →
клиент QR/deeplink-ийг харуулж `GET /api/payment/:id`-ээр төлөв шалгана →
төлбөр амжилттай болмогц webhook (эсвэл төлөв шалгалт) хэтэвчийг цэнэглэнэ.

Хэрэгтэй хувьсагчид: `WIRE_SECRET_KEY`, `WIRE_WEBHOOK_SECRET` (`.env.example` үз).

Webhook бүртгэх (нэг удаа, орчин тус бүрд):

```
curl -X POST https://api.wire.mn/v1/webhook_endpoints \
  -H "Authorization: Bearer $WIRE_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"url":"https://<домэйн>/api/payment/webhook","enabled_events":["payment_intent.succeeded"]}'
```

Wire-ийн БҮХ POST хүсэлт `Idempotency-Key` толгой шаарддаг (байхгүй бол 400).

Буцаж ирэх signing secret-ийг НЭГ Л УДАА харуулна — `WIRE_WEBHOOK_SECRET`-д
хадгална. Дараа нь Wire дээрээс "Баталгаажуулах" дарахад ping ирж, 2xx авбал
endpoint идэвхжинэ. Wire-ийн хүсэлт зөвхөн `65.109.117.186`-аас ирнэ (Vercel
дээр firewall тохируулах шаардлагагүй, гарын үсэг нь хамгаална).
