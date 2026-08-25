import mongoose from "mongoose";
import 'dotenv/config'

/**
 * Холболтыг нэг л удаа эхлүүлж, бүх хүсэлт түүнийг хүлээнэ.
 *
 * Vercel serverless дээр модуль ачаалагдмагц холболт бэлэн болдоггүй —
 * эхний хүсэлтүүд холбогдож амжаагүй байхад ирдэг. Өмнө нь `connectDb()`-г
 * хүлээлгүй дуудаад, алдааг нь залгичихдаг байсан тул холболт унасан ч
 * програм "хэвийн" ажиллаж, query бүр 10 секунд буферт хүлээгээд
 * "aldaa garlaa" болж унадаг байв. Одоо promise-ыг кэшлэж, дуудагч нь
 * хүлээх ба алдаа гарвал ил гарна.
 */
let connection: Promise<typeof mongoose> | null = null

export const connectDb = (): Promise<typeof mongoose> => {
    // 1 = connected. Аль хэдийн холбогдсон бол шууд буцаана.
    if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose)

    if (!connection) {
        const URI = process.env.MONGODB_URI
        if (!URI) {
            return Promise.reject(
                new Error("MONGODB_URI тохируулагдаагүй байна"),
            )
        }

        connection = mongoose.connect(URI).catch((error) => {
            // Дараагийн хүсэлт дахин оролдож чадахын тулд кэшийг цэвэрлэнэ —
            // эс тэгвээс нэг удаагийн түр алдаа мөнхөд үлдэнэ.
            connection = null
            throw error
        })
    }

    return connection
}
