import { upload } from "@vercel/blob/client"

/** Токен олгодог route. `/api/*` нь Hono рүү rewrite хийгддэг тул тэнд байж болохгүй. */
const TOKEN_ROUTE = "/blob-upload"

/** `clientPayload` энэ утгатай ирвэл файл тогтмол зам дээр дарж бичигдэнэ. */
export const FIXED_PAYLOAD = "fixed"

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
export const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES]

export const MAX_BYTES = {
  image: 5 * 1024 * 1024,
  video: 200 * 1024 * 1024,
}

export class UploadError extends Error {}

/**
 * Зураг/видеог Vercel Blob руу байршуулж, нийтэд нээлттэй хаягийг нь буцаана.
 *
 * Файл хөтчөөс ШУУД Blob руу очно; `/blob-upload` нь зөвхөн богино хугацааны
 * токен олгодог тул нууц түлхүүр хөтөч рүү гардаггүй, мөн Vercel-ийн 4.5MB
 * хүсэлтийн хязгаарт хамаарахгүй.
 *
 * Өмнө нь энэ модуль Cloudinary-тэй ярьдаг байсан бөгөөд хоёр `NEXT_PUBLIC_`
 * хувьсагч шаарддаг байв. Одоо тохиргоо нь СЕРВЕР дээр (`BLOB_READ_WRITE_TOKEN`)
 * тул хөтөч урьдчилж "бэлэн үү" гэдгийг мэдэх боломжгүй — тохиргоо дутуу бол
 * байршуулах үед алдаа болж мэдэгдэнэ.
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
  const isVideo = file.type.startsWith("video/")

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError(
      "Зөвхөн JPG, PNG, WEBP, GIF зураг эсвэл MP4, WEBM, MOV видео оруулна уу"
    )
  }

  const limit = isVideo ? MAX_BYTES.video : MAX_BYTES.image
  if (file.size > limit) {
    throw new UploadError(
      `${isVideo ? "Видеоны" : "Зургийн"} хэмжээ ${Math.round(limit / 1024 / 1024)}MB-аас бага байх ёстой`
    )
  }

  try {
    const blob = await upload(fixedPath ?? file.name, file, {
      access: "public",
      handleUploadUrl: TOKEN_ROUTE,
      clientPayload: fixedPath ? FIXED_PAYLOAD : undefined,
    })
    return blob.url
  } catch (error) {
    throw new UploadError(
      error instanceof Error ? error.message : "Файл байршуулж чадсангүй"
    )
  }
}
