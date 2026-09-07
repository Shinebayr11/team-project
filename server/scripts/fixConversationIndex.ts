import mongoose from "mongoose"

import { Conversation } from "../src/models/Conversation.js"

/**
 * Ярианы хуучин индексийг солино.
 *
 * `{ participants: 1 }` дээрх unique индекс нь массивын ЭЛЕМЕНТ тус бүрийг
 * давхардуулахгүй барьдаг тул нэг хэрэглэгч зөвхөн нэг яриатай байж чаддаг
 * байв. Загварт шинэ compound индекс тодорхойлсон ч mongoose хуучныг нь өөрөө
 * УСТГАДАГГҮЙ — иймд нэг удаа энэ скриптийг ажиллуулна:
 *
 *   npm run fix:conversation-index
 */
async function main() {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        console.error("MONGODB_URI алга байна")
        process.exit(1)
    }

    await mongoose.connect(uri)

    const before = await Conversation.collection.indexes()
    console.log("Өмнө:", before.map((index) => index.name).join(", "))

    if (before.some((index) => index.name === "participants_1")) {
        await Conversation.collection.dropIndex("participants_1")
        console.log("Хуучин `participants_1` индекс устлаа.")
    } else {
        console.log("Хуучин индекс аль хэдийн байхгүй байна.")
    }

    // Загварт тодорхойлсон индексүүдийг үүсгэнэ.
    await Conversation.syncIndexes()

    const after = await Conversation.collection.indexes()
    console.log("Дараа:", after.map((index) => index.name).join(", "))

    await mongoose.disconnect()
}

main().catch((error) => {
    console.error("fixConversationIndex алдаа:", error)
    process.exit(1)
})
