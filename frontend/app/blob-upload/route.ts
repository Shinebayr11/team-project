import { auth } from "@clerk/nextjs/server"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

import { ALLOWED_TYPES, MAX_BYTES } from "@/lib/upload"

/**
 * Зургийг Vercel Blob руу байршуулна.
 *
 * ЗАМ НЬ `/api/...` БИШ байх ёстой: `next.config.ts` доторх rewrite нь
 * `/api/:path*`-ыг бүхэлд нь Hono сервер рүү (`beforeFiles`) дамжуулдаг тул
 * тэнд байрлуулсан route handler хэзээ ч дуудагдахгүй.
 *
 * Өмнө нь энэ нь зөвхөн ТОКЕН олгодог байсан бөгөөд файл нь хөтчөөс ШУУД
 * `vercel.com/api/blob` рүү явдаг байв. Тэр загварын бодит асуудал нь: Blob
 * татгалзвал (400) хариу нь CORS толгойгүй ирдэг тул хөтөч биеийг нь JS-д
 * огт үзүүлэхгүй — хэрэглэгч ч, бид ч ЯАГААД гэдгийг хэзээ ч мэдэхгүй,
 * зөвхөн "Failed to fetch" үлддэг. Одоо файл өөрийн сервер дээгүүр явдаг тул
 * CORS огт байхгүй бөгөөд Vercel-ийн жинхэнэ мессеж хэрэглэгчид хүрнэ.
 */
export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: "Нэвтэрч орно уу" }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get("file")
    // Тогтмол зам — шууд дамжуулалтын урьдчилсан зураг нэг байрыг дарж бичдэг.
    const fixedPath = form.get("path")

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Файл алга байна" }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Зөвхөн JPG, PNG, WEBP, GIF зураг оруулна уу" },
        { status: 400 }
      )
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { message: `Зургийн хэмжээ ${MAX_BYTES / 1024 / 1024}MB-аас бага байх ёстой` },
        { status: 400 }
      )
    }

    const fixed = typeof fixedPath === "string" && fixedPath.length > 0

    const blob = await put(fixed ? fixedPath : file.name, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: !fixed,
      allowOverwrite: fixed,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    // Vercel-ийн шалтгааныг битгий залги — store-ын тохиргоо, эрх, хэмжээний
    // алдааг ялгах цорын ганц мэдээлэл нь энэ мессеж.
    console.error("blob upload error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Байршуулж чадсангүй" },
      { status: 400 }
    )
  }
}
