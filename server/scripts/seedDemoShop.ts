// Ажиллуулах:  npm run seed:demo-shop          — үүсгэнэ / шинэчилнэ
//              npm run seed:demo-shop -- --clean — өөрийн үүсгэснийг устгана
//
// Зорилго: НЭГ худалдагчийн Seller Hub-ыг (Бараа, Захиалга, Аналитик) бодит
// мэт өгөгдлөөр дүүргэх. Захиалга нь `Order` цуглуулгад `seller_id`-тайгаа
// сууна — `GET /api/order/mine` зөвхөн эзэн нь уншдаг тул ӨӨР ХЭН Ч энэ
// өгөгдлийг харахгүй. Repo дахь `seedOrders.ts` нь бүх зочинд ачаалагддаг тул
// тэр замаар "зөвхөн нэг хүнд" гэдэг боломжгүй байсан.
//
// Бүх бичлэг `demo_seed: true` тэмдэгтэй тул `--clean` нь бодит бараа,
// захиалганд хэзээ ч хүрэхгүй.
import mongoose from "mongoose"
import { connectDb } from "../src/lib/db.js"
import { Order } from "../src/models/Order.js"
import { Product } from "../src/models/Product.js"
import { User } from "../src/models/User.js"

/** Хэний самбарыг дүүргэх вэ. Clerk-ийн id — Mongo `_id` нь орчноос хамаарч өөр. */
const CLERK_USER_ID = "user_3IQq6KOP8O0s87IgJ6OYVgiMHKw"

/**
 * Хэдэн хоногийн түүх үүсгэх вэ.
 *
 * Аналитик дэлгэц 7/30/90 хоногийн товчтой. 30 хоног нь гол харагдац боловч
 * 90-ийг бүрэн дүүргэвэл гурван товч гурван өөр зураг өгнө — эс тэгвэл "90 хоног"
 * дарахад "30 хоног"-той яг адилхан харагдана.
 */
const DAYS = 90

/**
 * Барааны зураг: `frontend/public/demo/` доторх файлууд.
 *
 * Vercel Blob руу байршуулах шаардлагагүй — Next тэдгээрийг өөрөө түгээх тул
 * `/demo/<нэр>` гэсэн харьцангуй зам хөтөч дээр шууд ажиллана. Файлыг тэр
 * хавтсанд хийгээд доорх нэрсийг таарууллаа гэхэд болно.
 */
const IMG = (name: string) => `/demo/${name}`

interface Seed {
    name: string
    sku: string
    price: number
    stock: number
    category: string
    condition: string
    images: string[]
    description: string
    /** Эрэлтийн жин — захиалгад хэр олон удаа таарахыг тодорхойлно. */
    weight: number
}

const PRODUCTS: Seed[] = [
    { name: "Half-Zip Sweatshirt", sku: "UNQ-HZ-001", price: 129000, stock: 28, category: "Fashion", condition: "New", images: [IMG("halfzip-pair.jpg")], description: "Зөөлөн флисс, зогсоо захтай, хагас цахилгаантай. Хар ба цөцгий өнгөтэй.", weight: 16 },
    { name: "Wool Bomber Jacket — Brown", sku: "UNQ-BM-002", price: 449000, stock: 9, category: "Fashion", condition: "New", images: [IMG("bomber-wool-brown.jpg")], description: "Ноосон холимог, эргүүлж болох зогсоо зах, резинэн ханцуйвч.", weight: 2 },
    { name: "Knit Zip Polo — Stone", sku: "UNQ-PL-003", price: 149000, stock: 22, category: "Fashion", condition: "New", images: [IMG("polo-knit-stone.jpg")], description: "Сүлжмэл, богино ханцуйтай, унжсан хэлбэртэй хагас цахилгаант поло.", weight: 13 },
    { name: "Ribbed Tank Top — Charcoal", sku: "UNQ-TT-004", price: 45000, stock: 64, category: "Fashion", condition: "New", images: [IMG("tank-ribbed-charcoal.jpg")], description: "Угаалгын боловсруулалттай хөвөн; өнгөний жигд бус байдал нь загварын нэг хэсэг.", weight: 20 },
    { name: "Tailored Trousers — Navy", sku: "UNQ-TR-005", price: 159000, stock: 4, category: "Fashion", condition: "New", images: [IMG("trousers-navy-tailored.jpg")], description: "Индүүдсэн эвхэцтэй, шулуун хэлбэр. Ажлын өдөр тутам.", weight: 9 },
    { name: "Leather Bomber Jacket — Camel", sku: "UNQ-LB-006", price: 690000, stock: 3, category: "Fashion", condition: "New", images: [IMG("bomber-leather-camel.jpg")], description: "Жинхэнэ арьс, товчлууртай халаас, резинэн бүсэлхий.", weight: 1 },
    { name: "Leather Bomber Jacket — Black", sku: "UNQ-LB-007", price: 690000, stock: 0, category: "Fashion", condition: "New", images: [IMG("bomber-leather-black.jpg")], description: "Гялалзсан арьс, сонгодог захтай bomber.", weight: 1 },
    { name: "Slim Fit Trousers — Navy", sku: "UNQ-TR-008", price: 149000, stock: 31, category: "Fashion", condition: "New", images: [IMG("trousers-navy-slim.jpg")], description: "Нарийссан хэлбэр, эвхэцгүй. 46-56 размер.", weight: 12 },
]

/**
 * Худалдан авагчид. Жагсаалт нь ЗАХИАЛГЫН тооноос хамаагүй урт байх ёстой —
 * 15 нэр дээр 220 захиалга тарааж болох ч тэгвэл "нэг хүн 15 удаа худалдан
 * авсан" болж, аналитикийн "дундаж зарцуулалт" утгагүй өндөр гарна.
 */
const BUYERS = [
    "Б. Энхжаргал", "Д. Тэмүүлэн", "С. Номин-Эрдэнэ", "Г. Батбаяр", "М. Сарангэрэл",
    "Т. Ганзориг", "Ц. Оюунчимэг", "Н. Мөнхбат", "Х. Алтантуяа", "Э. Батсайхан",
    "Л. Чинбат", "Ж. Уранчимэг", "П. Ганболд", "О. Сувдаа", "Р. Тэмүүжин",
    "А. Болормаа", "Б. Мөнх-Эрдэнэ", "В. Цэрэндулам", "Г. Ундрах", "Д. Ариунзаяа",
    "Е. Батжаргал", "Ж. Долгорсүрэн", "З. Ганбаатар", "И. Нарантуяа", "К. Отгонбаяр",
    "Л. Мөнгөнцэцэг", "М. Баттулга", "Н. Эрдэнэчимэг", "О. Ганцэцэг", "П. Дэлгэрмаа",
    "Р. Баярсайхан", "С. Хулан", "Т. Анужин", "У. Мөнхзул", "Ф. Ганхуяг",
    "Х. Оюунбилэг", "Ц. Батзориг", "Ч. Сэлэнгэ", "Ш. Наранбаатар", "Э. Дулмаа",
    "Ю. Тэгшзаяа", "Я. Алтанзул", "Б. Пүрэвсүрэн", "Д. Хишигбаяр", "Г. Тунгалаг",
    "М. Энхтуяа", "Н. Батболд", "С. Ариунаа", "Т. Золбоо", "Ц. Мандах",
    "Х. Билгүүн", "Ж. Нямсүрэн", "Л. Одонтуяа", "О. Ганзаяа", "Р. Сарантуяа",
    "Э. Хүрэлбаатар", "Б. Түвшинбаяр", "Д. Мөнхтуяа", "Г. Цолмон", "Н. Ууганбаяр",
]

const DISTRICTS = [
    ["Улаанбаатар", "Сүхбаатар", "16 -р хороолол, 4 -р байр 21 тоот"],
    ["Улаанбаатар", "Хан-Уул", "Зайсан, Ривер гарден 12 тоот"],
    ["Улаанбаатар", "Баянзүрх", "13 -р хороолол, 45А байр 7 тоот"],
    ["Улаанбаатар", "Чингэлтэй", "5 -р хороо, Сансар 3 -р байр 14 тоот"],
    ["Дархан", "Дархан сум", "1 -р баг, 22 -р байр 3 тоот"],
    ["Эрдэнэт", "Баян-Өндөр", "Найрамдал хороолол 8 -р байр 11 тоот"],
]

const CARRIERS = ["Тээвэрлэгч Экспресс", "Шуурхай Хүргэлт", "Mongol Post"]

/**
 * Тогтвортой санамсаргүй тоо (LCG).
 *
 * `Math.random` БИШ: script-ийг дахин ажиллуулахад өгөгдөл нь өөрчлөгдвөл
 * "өчигдөр 4.2 сая байсан" гэж ярьж байгаад дахин seed хийхэд тоо нь өөр болно.
 */
let rngState = 20260910
const rnd = () => {
    rngState = (rngState * 1664525 + 1013904223) % 4294967296
    return rngState / 4294967296
}
const pick = <T>(list: T[]): T => list[Math.floor(rnd() * list.length)]
const between = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1))

/** Жинтэй сонголт — зарим бараа бусдаасаа илүү зарагддаг. */
const weightedPick = (items: { weight: number }[]) => {
    const total = items.reduce((sum, item) => sum + item.weight, 0)
    let roll = rnd() * total
    for (let i = 0; i < items.length; i += 1) {
        roll -= items[i].weight
        if (roll <= 0) return i
    }
    return items.length - 1
}

async function main() {
    const clean = process.argv.includes("--clean")
    await connectDb()

    const seller = await User.findOne({ clerk_user_id: CLERK_USER_ID })
    if (!seller) {
        console.error(`Худалдагч олдсонгүй: ${CLERK_USER_ID}`)
        await mongoose.disconnect()
        process.exit(1)
    }
    console.log(`Худалдагч: ${seller.display_name} (${seller.shop_name ?? "-"}) ${seller._id}\n`)

    // Дахин ажиллуулахад хуулбар үүсгэхгүй — өмнөх seed-ээ үргэлж эхлээд арилгана.
    const removedOrders = await Order.deleteMany({ seller_id: seller._id, demo_seed: true })
    const removedProducts = await Product.deleteMany({ seller_id: seller._id, demo_seed: true })
    console.log(`Хассан: ${removedProducts.deletedCount} бараа, ${removedOrders.deletedCount} захиалга`)

    if (clean) {
        console.log("--clean: цэвэрлээд зогслоо.")
        await mongoose.disconnect()
        return
    }

    // --- Бараа ---------------------------------------------------------------
    const created = await Product.insertMany(
        PRODUCTS.map((p) => ({
            seller_id: seller._id,
            name: p.name,
            description: p.description,
            price_coins: p.price,
            stock_quantity: p.stock,
            images: p.images,
            sku: p.sku,
            category: p.category,
            condition: p.condition,
            listing_type: "buy_it_now",
            status: p.stock === 0 ? "OUT_OF_STOCK" : "ACTIVE",
            sold_quantity: 0,
            demo_seed: true,
        }))
    )
    console.log(`Нэмсэн: ${created.length} бараа`)

    // --- Захиалга ------------------------------------------------------------
    const now = Date.now()
    const orders: Record<string, unknown>[] = []
    const soldByProduct = new Map<string, number>()

    for (let day = DAYS - 1; day >= 0; day -= 1) {
        const date = new Date(now - day * 86_400_000)
        const isWeekend = date.getDay() === 0 || date.getDay() === 6

        // Сүүлийн үе рүүгээ өсөх хандлага + амралтын өдрийн өсөлт. Аль ч өдөр
        // 0 захиалгатай байж болно — жигд график бол хуурамч харагддаг.
        const trend = 1 + ((DAYS - day) / DAYS) * 0.8
        const base = (isWeekend ? 2.6 : 1.6) * trend
        const count = Math.max(0, Math.round(base + (rnd() - 0.5) * 2.4))

        for (let n = 0; n < count; n += 1) {
            const lineCount = rnd() < 0.65 ? 1 : rnd() < 0.85 ? 2 : 3
            const chosen = new Set<number>()
            while (chosen.size < lineCount) chosen.add(weightedPick(PRODUCTS))

            const items = [...chosen].map((index) => {
                const product = PRODUCTS[index]
                const doc = created[index]
                const quantity = rnd() < 0.78 ? 1 : between(2, 3)
                soldByProduct.set(
                    String(doc._id),
                    (soldByProduct.get(String(doc._id)) ?? 0) + quantity
                )
                return {
                    product_id: doc._id,
                    name: product.name,
                    sku: product.sku,
                    price_coins: product.price,
                    quantity,
                }
            })

            const total = items.reduce((sum, i) => sum + i.price_coins * i.quantity, 0)

            // Төлбөр: голдуу төлөгдсөн. Цөөн хэдэн хүлээгдэж буй, буцаалттай нь
            // байхгүй бол самбар хэт "цэвэр" харагдаж, жинхэнэ мэт болохгүй.
            const payRoll = rnd()
            const payment = payRoll < 0.88 ? "PAID" : payRoll < 0.96 ? "PENDING" : "REFUNDED"

            // Хүргэлт нь ЦАГ ХУГАЦААНААС хамаарна: өчигдрийн захиалга хүргэгдсэн
            // байх ёсгүй, сарын өмнөх нь хүлээгдэж байх ёсгүй.
            let fulfillment: string
            if (payment === "REFUNDED") fulfillment = "RETURNED"
            else if (payment === "PENDING") fulfillment = "PENDING"
            else if (day <= 1) fulfillment = pick(["PENDING", "PROCESSING"])
            else if (day <= 3) fulfillment = pick(["PROCESSING", "READY_TO_SHIP"])
            else if (day <= 6) fulfillment = pick(["READY_TO_SHIP", "SHIPPED"])
            else fulfillment = rnd() < 0.94 ? "DELIVERED" : "CANCELLED"

            const [city, state, line] = pick(DISTRICTS)
            const buyer = pick(BUYERS)
            const shipped = ["SHIPPED", "DELIVERED"].includes(fulfillment)

            // Өдрийн дотор ажлын цагт тараана.
            const at = new Date(date)
            at.setHours(between(9, 22), between(0, 59), between(0, 59), 0)

            orders.push({
                seller_id: seller._id,
                buyer_name: buyer,
                items,
                total_coins: total,
                payment_status: payment,
                fulfillment_status: fulfillment,
                shipping_address: {
                    fullName: buyer,
                    addressLine1: line,
                    city,
                    state,
                    postalCode: String(between(11000, 19999)),
                    country: "Mongolia",
                },
                ...(shipped
                    ? {
                          carrier: pick(CARRIERS),
                          tracking_number: `MN${between(100000000, 999999999)}`,
                      }
                    : {}),
                demo_seed: true,
                createdAt: at,
                updatedAt: at,
            })
        }
    }

    // `timestamps: false` — эс тэгвэл mongoose `createdAt`-ыг ОДООГООР дарж
    // бичих тул бүх захиалга нэг өдрийнх болж, график нэг баганад хураагдана.
    await Order.insertMany(orders, { timestamps: false })
    console.log(`Нэмсэн: ${orders.length} захиалга (${DAYS} хоног)`)

    // --- Зарагдсан тоог захиалгатай нь тааруулна --------------------------
    // Аналитикийн "sell-through" нь `sold / (sold + үлдэгдэл)`-ээр бодогддог тул
    // энэ хоёр зөрвөл самбар өөртэйгөө зөрчилдсөн тоо харуулна.
    for (const doc of created) {
        const sold = soldByProduct.get(String(doc._id)) ?? 0
        await Product.updateOne({ _id: doc._id }, { $set: { sold_quantity: sold } })
    }

    const paid = orders.filter((o) => o.payment_status === "PAID")
    const revenue = paid.reduce((sum, o) => sum + (o.total_coins as number), 0)
    console.log(`\nТөлөгдсөн: ${paid.length} захиалга · ₮${revenue.toLocaleString("en-US")}`)
    console.log(`Дундаж чек: ₮${Math.round(revenue / paid.length).toLocaleString("en-US")}`)

    await mongoose.disconnect()
}

main()
