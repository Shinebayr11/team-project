// Ажиллуулах:  npm run seed:demo-shop          — бараа бөглөж, захиалга үүсгэнэ
//              npm run seed:demo-shop -- --clean — үүсгэсэн захиалгыг устгана
//
// Зорилго: НЭГ худалдагчийн Seller Hub-ыг (Бараа, Захиалга, Аналитик) бодит
// мэт өгөгдлөөр дүүргэх. Захиалга нь `Order` цуглуулгад `seller_id`-тайгаа
// сууна — `GET /api/order/mine` зөвхөн эзэн нь уншдаг тул ӨӨР ХЭН Ч энэ
// өгөгдлийг харахгүй.
//
// БАРААГ ЭНЭ SCRIPT ҮҮСГЭХГҮЙ. Худалдагч зургаа аппаараа аль хэдийн оруулсан
// бөгөөд нэр, үнэ нь хоосон үлдсэн байдаг. Энэ нь тэдгээрийг ЗУРГААР НЬ олж
// дэлгэрэнгүйг нь бөглөнө — ингэснээр байршуулсан зураг хэвээр үлдэж,
// давхардсан бараа ч үүсэхгүй.
//
// `--clean` нь ЗӨВХӨН захиалгыг арилгана. Барааны нэр, үнэ буцаж "." болохгүй —
// түүнийг аппаасаа засна.
import assert from "node:assert"
import mongoose from "mongoose"
import { connectDb } from "../src/lib/db.js"
import { Live_Show } from "../src/models/Live_show.js"
import { Order } from "../src/models/Order.js"
import { Product } from "../src/models/Product.js"
import { ProductListing } from "../src/models/ProductListing.js"
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

interface Seed {
    /**
     * Зургийн хаяг доторх ЦОРЫН ГАНЦ хэсэг. Аль бараанд тохирохыг үүгээр олно —
     * Mongo-гийн id нь орчин бүрд өөр тул script дотор бичих нь эмзэг.
     */
    match: string
    name: string
    sku: string
    price: number
    stock: number
    category: string
    condition: string
    description: string
    /** Эрэлтийн жин — захиалгад хэр олон удаа таарахыг тодорхойлно. */
    weight: number
}

const PRODUCTS: Seed[] = [
    { match: "/zara%201-", name: "Half-Zip Sweatshirt", sku: "ZRA-HZ-001", price: 129000, stock: 28, category: "Fashion", condition: "New", description: "Зөөлөн флисс, зогсоо захтай, хагас цахилгаантай. Хар ба цөцгий өнгөтэй.", weight: 16 },
    { match: "/zara%202-", name: "Wool Bomber Jacket — Brown", sku: "ZRA-BM-002", price: 449000, stock: 9, category: "Fashion", condition: "New", description: "Ноосон холимог, эргүүлж болох зогсоо зах, резинэн ханцуйвч.", weight: 2 },
    { match: "/zara%203-", name: "Knit Zip Polo — Stone", sku: "ZRA-PL-003", price: 149000, stock: 22, category: "Fashion", condition: "New", description: "Сүлжмэл, богино ханцуйтай, унжсан хэлбэртэй хагас цахилгаант поло.", weight: 13 },
    { match: "/zara2-", name: "Ribbed Tank Top — Charcoal", sku: "ZRA-TT-004", price: 45000, stock: 64, category: "Fashion", condition: "New", description: "Угаалгын боловсруулалттай хөвөн; өнгөний жигд бус байдал нь загварын нэг хэсэг.", weight: 20 },
    { match: "/zar9-", name: "Tailored Trousers — Navy", sku: "ZRA-TR-005", price: 159000, stock: 4, category: "Fashion", condition: "New", description: "Индүүдсэн эвхэцтэй, шулуун хэлбэр. Ажлын өдөр тутам.", weight: 9 },
    { match: "/zara5-", name: "Leather Bomber Jacket — Camel", sku: "ZRA-LB-006", price: 690000, stock: 3, category: "Fashion", condition: "New", description: "Жинхэнэ арьс, товчлууртай халаас, резинэн бүсэлхий.", weight: 1 },
    { match: "/zara6-", name: "Leather Bomber Jacket — Black", sku: "ZRA-LB-007", price: 690000, stock: 0, category: "Fashion", condition: "New", description: "Гялалзсан арьс, сонгодог захтай bomber.", weight: 1 },
    { match: "/zara7-", name: "Slim Fit Trousers — Navy", sku: "ZRA-TR-008", price: 149000, stock: 31, category: "Fashion", condition: "New", description: "Нарийссан хэлбэр, эвхэцгүй. 46-56 размер.", weight: 12 },
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

/** [хот, дүүрэг/сум, хороо/баг, дэлгэрэнгүй] — `Order.shipping_address`-тай ижил бүтэц. */
const DISTRICTS = [
    ["Улаанбаатар", "Сүхбаатар", "6-р хороо", "16-р хороолол, 4-р байр 21 тоот"],
    ["Улаанбаатар", "Хан-Уул", "11-р хороо", "Зайсан, Ривер гарден 12 тоот"],
    ["Улаанбаатар", "Баянзүрх", "13-р хороо", "13-р хороолол, 45А байр 7 тоот"],
    ["Улаанбаатар", "Чингэлтэй", "5-р хороо", "Сансар, 3-р байр 14 тоот"],
    ["Дархан", "Дархан сум", "1-р баг", "22-р байр 3 тоот"],
    ["Эрдэнэт", "Баян-Өндөр", "4-р баг", "Найрамдал хороолол 8-р байр 11 тоот"],
]

const CARRIERS = ["Тээвэрлэгч Экспресс", "Шуурхай Хүргэлт", "Mongol Post"]

/** Дууссан эфирийн гарчиг. Ерөнхий тоймын "Сүүлийн шууд дамжуулалт" эдгээрийг харуулна. */
const SHOW_TITLES = [
    "Намрын шинэ ирц — гадуур хувцас",
    "Арьсан хүрэмний тусгай эфир",
    "Ажлын хувцас: өмд, цамц",
    "Долоо хоногийн шилдэг сонголт",
    "Сүлжмэл ба поло цуглуулга",
    "Өвлийн бэлтгэл — ноосон бүтээгдэхүүн",
    "Basics: өдөр тутмын хувцас",
    "Сарын эцсийн хямдрал",
]

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

    // Дахин ажиллуулахад хуулбар үүсгэхгүй — өмнөх захиалгаа үргэлж эхлээд арилгана.
    const removedOrders = await Order.deleteMany({ seller_id: seller._id, demo_seed: true })
    // Энэ script урьд нь бараагаа өөрөө үүсгэдэг байсан. Одоо худалдагчийн
    // өөрийнхийг нь бөглөдөг тул тэр үеийн хуулбаруудыг цэвэрлэнэ.
    const removedProducts = await Product.deleteMany({ seller_id: seller._id, demo_seed: true })
    // Эфирийн лотыг эфирээсээ ӨМНӨ хасна — эс тэгвэл эзэнгүй лот үлдэнэ.
    const oldShows = await Live_Show.find({ seller_id: seller._id, demo_seed: true }).select("_id")
    const removedLots = await ProductListing.deleteMany({
        live_show_id: { $in: oldShows.map((show) => show._id) },
        demo_seed: true,
    })
    const removedShows = await Live_Show.deleteMany({ seller_id: seller._id, demo_seed: true })
    console.log(
        `Хассан: ${removedOrders.deletedCount} захиалга, ${removedShows.deletedCount} эфир, ` +
            `${removedLots.deletedCount} лот, ${removedProducts.deletedCount} хуучин үзүүлэнгийн бараа`
    )

    if (clean) {
        console.log("--clean: цэвэрлээд зогслоо. Барааны нэр, үнэ хэвээр үлдэв.")
        await mongoose.disconnect()
        return
    }

    // --- Бараа: аппаас оруулсан зурагтай мөрүүдийг олж бөглөнө -------------
    const owned = await Product.find({ seller_id: seller._id })

    const created = PRODUCTS.map((seed) => {
        const hits = owned.filter((doc) =>
            (doc.images ?? []).some((url) => url.includes(seed.match))
        )
        // Дуугүй буруу бараанд наахаас, чангаар унасан нь дээр: зураг нэмэгдэх,
        // солигдох бүрд энэ шалгалт эхлээд хэлнэ.
        assert.equal(
            hits.length,
            1,
            `"${seed.match}" → ${hits.length} бараа таарлаа (яг 1 байх ёстой): ${seed.name}`
        )
        return hits[0]
    })

    for (const [i, doc] of created.entries()) {
        const seed = PRODUCTS[i]
        await Product.updateOne(
            { _id: doc._id },
            {
                $set: {
                    name: seed.name,
                    description: seed.description,
                    price_coins: seed.price,
                    stock_quantity: seed.stock,
                    sku: seed.sku,
                    category: seed.category,
                    condition: seed.condition,
                    listing_type: "buy_it_now",
                    status: seed.stock === 0 ? "OUT_OF_STOCK" : "ACTIVE",
                    sold_quantity: 0,
                },
            }
        )
        console.log(`  ${seed.sku}  ${seed.name}`)
    }
    console.log(`Бөглөсөн: ${created.length} бараа`)

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
            // Тэдний `Order` нь НЭГ бараатай (`product_id` + `quantity`) бөгөөд
            // `getMySellerOrders` эзнийг нь БАРААГААР нь олдог. Тиймээс энд
            // нэг захиалга = нэг бараа.
            const index = weightedPick(PRODUCTS)
            const seed = PRODUCTS[index]
            const doc = created[index]
            const quantity = rnd() < 0.78 ? 1 : between(2, 3)
            soldByProduct.set(String(doc._id), (soldByProduct.get(String(doc._id)) ?? 0) + quantity)

            // Хүргэлт нь ЦАГ ХУГАЦААНААС хамаарна: өчигдрийн захиалга хүргэгдсэн
            // байх ёсгүй, сарын өмнөх нь хүлээгдэж байх ёсгүй.
            let fulfillment: string
            if (day <= 1) fulfillment = pick(["PENDING", "PROCESSING"])
            else if (day <= 3) fulfillment = pick(["PROCESSING", "READY_TO_SHIP"])
            else if (day <= 6) fulfillment = pick(["READY_TO_SHIP", "SHIPPED"])
            else fulfillment = rnd() < 0.92 ? "DELIVERED" : rnd() < 0.6 ? "CANCELLED" : "RETURNED"

            const [city, district, khoroo, detail] = pick(DISTRICTS)
            const buyer = pick(BUYERS)
            const shipped = ["SHIPPED", "DELIVERED"].includes(fulfillment)

            // Өдрийн дотор ажлын цагт тараана.
            const at = new Date(date)
            at.setHours(between(9, 22), between(0, 59), between(0, 59), 0)

            orders.push({
                // `buyer_id` ЗОРИУДААР хоосон: бодит хэрэглэгч рүү заавал
                // тэдний "Миний захиалга" жагсаалтад үзүүлэнгийн мөр орж хутгална.
                buyer_name: buyer,
                product_id: doc._id,
                quantity,
                price_coins: seed.price * quantity,
                fulfillment_status: fulfillment,
                shipping_address: {
                    fullName: buyer,
                    phone: `9${between(1000000, 9999999)}`,
                    city,
                    district,
                    khoroo,
                    detail,
                },
                ...(shipped
                    ? { carrier: pick(CARRIERS), tracking_number: `MN${between(100000000, 999999999)}` }
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

    // --- Дууссан эфир ба тэн дээр зарагдсан лот -----------------------------
    // Ерөнхий тоймын "Сүүлийн шууд дамжуулалт" нь захиалгаас БИШ, эфир дээр
    // зарагдсан лотоос (`ProductListing.status = "sold"`) тоологддог тул
    // эдгээрийг тусад нь үүсгэнэ. Дуудлага худалдаа нь `Order` үүсгэдэггүй —
    // тиймээс энэ нь дээрх захиалгуудтай давхцахгүй, тусдаа суваг.
    const showDocs = await Live_Show.insertMany(
        SHOW_TITLES.map((title, i) => {
            // Хамгийн сүүлийнх нь 18 цагийн өмнө, цаашлаад 11 хоног тутам.
            // Худалдагчийн хуучин жишээ эфир (0 борлуулалттай) 1 хоногийн өмнө
            // дууссан тул түүнээс ХОЙШ байх ёстой — эс тэгвэл "Сүүлийн шууд
            // дамжуулалтын үзүүлэлт" том карт дээр ₮0 гарсаар байна.
            const endedAt = new Date(now - (0.75 + i * 11) * 86_400_000)
            const startedAt = new Date(endedAt.getTime() - between(45, 95) * 60_000)
            return {
                seller_id: seller._id,
                title,
                status: "ended",
                category: "Fashion",
                type: "mixed",
                viewer_count: between(180, 1450),
                started_at: startedAt,
                ended_at: endedAt,
                thumbnail_url: created[i % created.length].images?.[0],
                demo_seed: true,
            }
        })
    )

    const lots = showDocs.flatMap((show, showIndex) =>
        Array.from({ length: between(3, 6) }, () => {
            const index = weightedPick(PRODUCTS)
            const seed = PRODUCTS[index]
            // Дуудлага худалдаа тул эцсийн үнэ жагсаалтын үнээс дээш ч, доош ч
            // байж болно — үргэлж жагсаалтын үнээр бичвэл аукцион мэт харагдахгүй.
            const finalPrice = Math.round((seed.price * (0.75 + rnd() * 0.6)) / 1000) * 1000
            return {
                product_id: created[index]._id,
                live_show_id: show._id,
                sale_type: "auction",
                starting_price_coins: Math.round((seed.price * 0.5) / 1000) * 1000,
                current_highest_bid_coins: finalPrice,
                timer_ends_at: showDocs[showIndex].ended_at,
                status: "sold",
                demo_seed: true,
            }
        })
    )
    const lotDocs = await ProductListing.insertMany(lots)

    // Зарагдсан лот бүр ЗАХИАЛГА болно — `settleExpiredListings` бодит
    // аукционд яг үүнийг хийдэг. Ингэснээр ялагчид "Захиалга" хүснэгтэд
    // бусад захиалгын хамт, ижил шүүлтүүрээр харагдана.
    const lotOrders = lotDocs.map((lot, i) => {
        const show = showDocs.find((s) => String(s._id) === String(lot.live_show_id))!
        const endedAt = show.ended_at as Date
        const daysAgo = Math.floor((now - endedAt.getTime()) / 86_400_000)
        const buyer = pick(BUYERS)
        const [city, district, khoroo, detail] = pick(DISTRICTS)

        return {
            buyer_name: buyer,
            product_id: lot.product_id,
            listing_id: lot._id,
            live_show_id: lot.live_show_id,
            quantity: 1,
            price_coins: lots[i].current_highest_bid_coins,
            // Эфир дөнгөж дууссан бол илгээгээгүй байх нь жам ёсны.
            fulfillment_status:
                daysAgo <= 1 ? "PENDING" : daysAgo <= 4 ? "PROCESSING" : "DELIVERED",
            shipping_address: {
                fullName: buyer,
                phone: `9${between(1000000, 9999999)}`,
                city,
                district,
                khoroo,
                detail,
            },
            demo_seed: true,
            createdAt: endedAt,
            updatedAt: endedAt,
        }
    })
    await Order.insertMany(lotOrders, { timestamps: false })

    const lotRevenue = lots.reduce((sum, lot) => sum + lot.current_highest_bid_coins, 0)
    console.log(
        `Нэмсэн: ${showDocs.length} дууссан эфир, ${lots.length} зарагдсан лот ` +
            `(₮${lotRevenue.toLocaleString("en-US")}) — лот бүрд захиалга`
    )

    // --- Зарагдсан тоог захиалгатай нь тааруулна --------------------------
    // Аналитикийн "sell-through" нь `sold / (sold + үлдэгдэл)`-ээр бодогддог тул
    // энэ хоёр зөрвөл самбар өөртэйгөө зөрчилдсөн тоо харуулна.
    for (const doc of created) {
        const sold = soldByProduct.get(String(doc._id)) ?? 0
        await Product.updateOne({ _id: doc._id }, { $set: { sold_quantity: sold } })
    }

    const revenue = orders.reduce((sum, o) => sum + (o.price_coins as number), 0)
    console.log(`\nНийт: ${orders.length} захиалга · ₮${revenue.toLocaleString("en-US")}`)
    console.log(`Дундаж чек: ₮${Math.round(revenue / orders.length).toLocaleString("en-US")}`)

    await mongoose.disconnect()
}

main()
