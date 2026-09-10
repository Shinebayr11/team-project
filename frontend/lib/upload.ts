/** Байршуулах route. `/api/*` нь Hono рүү rewrite хийгддэг тул тэнд байж болохгүй. */
const UPLOAD_ROUTE = "/blob-upload"

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]

/**
 * Vercel-ийн функц хүлээж авах хүсэлтийн биеийн дээд хэмжээ 4.5MB. Файл
 * серверээр дамжин өнгөрдөг тул түүнээс доогуур байх ёстой — 4MB нь multipart
 * бүрхүүлд зай үлдээнэ.
 */
export const MAX_BYTES = 4 * 1024 * 1024

export class UploadError extends Error {}

/**
 * Зургийг Vercel Blob руу байршуулж, нийтэд нээлттэй хаягийг нь буцаана.
 *
 * Файл нь өөрийн серверээр дамжина (`app/blob-upload/route.ts`). Хөтчөөс шууд
 * Blob руу илгээх хувилбар нь илүү том файл дэмждэг ч, алдаа гарвал хариу нь
 * CORS толгойгүй ирдэг тул ЯАГААД гэдгийг харуулж чаддаггүй байв — зурагны
 * хэмжээ 4MB-д багтдаг тул тэр үнэ өндөр.
 *
 * Видео (200MB) энэ замаар багтахгүй. Видео оруулах дэлгэц гарах үед тэр
 * урсгалыг тусад нь хөтчөөс шууд илгээх болгоно.
 */
export async function uploadFile(
  file: File,
  /**
   * Тогтмол зам. Шууд дамжуулалтын урьдчилсан зураг шиг НЭГ байрыг дахин
   * дахин шинэчилдэг файлд өгнө — эс тэгвэл 20 секунд тутам шинэ файл үүсч,
   * нэг цагийн дамжуулалт ~180 хог файл үлдээнэ.
   */
  fixedPath?: string
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError("Зөвхөн JPG, PNG, WEBP, GIF зураг оруулна уу")
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError(
      `Зургийн хэмжээ ${MAX_BYTES / 1024 / 1024}MB-аас бага байх ёстой`
    )
  }

  const form = new FormData()
  form.append("file", file)
  if (fixedPath) form.append("path", fixedPath)

  let res: Response
  try {
    res = await fetch(UPLOAD_ROUTE, { method: "POST", body: form })
  } catch {
    throw new UploadError("Сүлжээ тасарлаа. Дахин оролдоно уу.")
  }

  const body = await res.json().catch(() => null)

  if (!res.ok || !body?.url) {
    throw new UploadError(body?.message ?? "Зураг байршуулж чадсангүй")
  }

  return body.url as string
}
