import { auth } from "@clerk/nextjs/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

import { ALLOWED_TYPES, FIXED_PAYLOAD, MAX_BYTES } from "@/lib/upload"

/**
 * Vercel Blob руу байршуулах эрхийн богино хугацааны токен олгоно.
 *
 * ЗАМ НЬ `/api/...` БИШ байх ёстой: `next.config.ts` доторх rewrite нь
 * `/api/:path*`-ыг бүхэлд нь Hono сервер рүү (`beforeFiles`) дамжуулдаг тул
 * тэнд байрлуулсан route handler хэзээ ч дуудагдахгүй.
 *
 * Файл нь хөтчөөс ШУУД Blob руу очно — сервер нь зөвхөн зөвшөөрөл олгоно.
 * Ингэснээр Vercel-ийн 4.5MB-ын хүсэлтийн биеийн хязгаарт хамаарахгүй.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // Токен олгохын өмнө нэвтрэлт шалгана — эс тэгвээс хэн ч бидний
        // хадгалах санд файл байршуулж чадна.
        const { userId } = await auth()
        if (!userId) throw new Error("Нэвтэрч орно уу")

        // Шууд дамжуулалтын урьдчилсан зураг нэг л байрыг 20 секунд тутам
        // дарж бичдэг; бусад нь санамсаргүй дагавартай шинэ файл болно.
        const fixed = clientPayload === FIXED_PAYLOAD

        return {
          allowedContentTypes: [...ALLOWED_TYPES],
          maximumSizeInBytes: MAX_BYTES.video,
          addRandomSuffix: !fixed,
          allowOverwrite: fixed,
        }
      },
      // Байршуулалт дуусахад клиент хаягийг нь шууд авдаг тул энд хийх ажил
      // алга. Localhost дээр энэ callback дуудагдахгүй ч байршуулалт бүтнэ.
      onUploadCompleted: async () => {},
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Байршуулж чадсангүй",
      },
      { status: 400 }
    )
  }
}
