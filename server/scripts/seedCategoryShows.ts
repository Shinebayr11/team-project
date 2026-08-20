// Ажиллуулах: npm run seed:categories (server/ дотор)
// Зорилго: Home/Explore хуудсыг ангилал бүрээр нэвтрэх үед хоосон харагдахаас
// сэргийлж, ангилал (category) тус бүрд нэг жишээ шоу нэмнэ. Эдгээр нь бодит
// дамжуулалт биш тул status "live" биш — LiveKit-ийн идэвхтэй room шалгалтад
// (getliveshow) баригдахгүй, "Ирээдүйд төлөвлөгдсөн" (Scheduled) байдлаар
// байнга харагдана.
import mongoose from "mongoose"
import { connectDb } from "../src/lib/db.js"
import { Live_Show } from "../src/models/Live_show.js"
import { User } from "../src/models/User.js"

// frontend/data/exploreCategories.ts-ийн нэрстэй яг таарч байх ёстой —
// Home/Explore тэдгээр нэрээр шүүж/бүлэглэдэг.
const CATEGORIES = [
    { name: "Fashion", title: "Fashion Haul — шинэ ирц", icon: 1 },
    { name: "Sneakers", title: "Sneaker Drop — хязгаарлагдмал цуврал", icon: 2 },
    { name: "Sports Cards", title: "Sports Cards Unboxing", icon: 3 },
    { name: "Trading Cards", title: "Trading Cards Trade Show", icon: 4 },
    { name: "Collectibles", title: "Rare Collectibles Showcase", icon: 5 },
    { name: "Electronics", title: "Electronics Deals", icon: 6 },
    { name: "Vintage Decor", title: "Vintage Decor Finds", icon: 7 },
    { name: "Jewelry", title: "Jewelry Collection", icon: 8 },
]

// Home-ийн дээд "онцлох" баннер (FeaturedShow) хамгийн олон үзэгчтэй,
// status: "live" шоуг шаарддаг тул үүнд зориулж тусад нь нэг үзэгчтэй mock
// шоу нэмнэ. livekit_room_name огт өгөхгүй — бодит room хэзээ ч байгаагүй
// тул getliveshow-ийн LiveKit staleness шалгалт үүнийг алгасна (ended болгохгүй).
const FEATURED_SHOW = {
    title: "Test LIVE now",
    category: "Fashion",
    viewer_count: 128,
    thumbnail_url: "https://picsum.photos/1200/500?random=99",
}

async function seed() {
    await connectDb()

    const seller = await User.findOne()

    let created = 0
    let skipped = 0

    for (const cat of CATEGORIES) {
        // Зөвхөн категорийн нэр таарсан гэдгээрээ алгасахгүй — getliveshow-той ижил
        // шүүлтээр бодитоор Home дээр харагдах эсэхийг нь шалгана (жишээ нь
        // started_at/status хоосон хуучин бичлэг байвал тоохгүй, шинээр нэмнэ).
        const exists = await Live_Show.findOne({
            category: cat.name,
            status: { $ne: "ended" },
            $or: [{ status: "live" }, { started_at: { $ne: null } }],
        })
        if (exists) {
            skipped++
            continue
        }

        await Live_Show.create({
            seller_id: seller?._id,
            title: cat.title,
            category: cat.name,
            thumbnail_url: `https://picsum.photos/400/800?random=${cat.icon}`,
            started_at: new Date(),
            tags: cat.name,
            sponsored: false,
        })
        created++
    }

    const featuredExists = await Live_Show.findOne({
        title: FEATURED_SHOW.title,
        status: "live",
    })
    if (featuredExists) {
        skipped++
    } else {
        await Live_Show.create({
            seller_id: seller?._id,
            title: FEATURED_SHOW.title,
            category: FEATURED_SHOW.category,
            status: "live",
            viewer_count: FEATURED_SHOW.viewer_count,
            thumbnail_url: FEATURED_SHOW.thumbnail_url,
            started_at: new Date(),
            tags: FEATURED_SHOW.category,
            sponsored: false,
        })
        created++
    }

    console.log(`Дууслаа: ${created} шинээр үүсгэв, ${skipped} аль хэдийн байсан тул алгаслаа.`)
    await mongoose.disconnect()
}

seed().catch((error) => {
    console.error("Seed script алдаа:", error)
    process.exit(1)
})
