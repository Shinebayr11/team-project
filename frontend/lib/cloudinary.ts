const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"]

/** Тохиргоо хийгдсэн эсэх — UI үүнээс хамааран зурагны хэсгээ нуудаг. */
export const isImageUploadReady = () => !!CLOUD_NAME && !!UPLOAD_PRESET

export class UploadError extends Error {}

/**
 * Preset нь гаднаас өгсөн `public_id`-г зөвшөөрөх эсэх. Эхний татгалзалд
 * унтарч, цаашид дэмий оролдохгүй.
 */
let overwriteSupported = true

/**
 * Зургийг Cloudinary руу шууд хөтчөөс байршуулж, хаягийг нь буцаана.
 *
 * Unsigned preset ашигладаг тул нууц түлхүүр хөтөч рүү гардаггүй. Хэмжээ,
 * форматын хязгаарыг Cloudinary дээрх preset дээр бас тавьж өгөх нь зүйтэй —
 * энд шалгах нь зөвхөн хэрэглэгчид эрт мэдэгдэх зорилготой.
 */
export async function uploadImage(
  file: File,
  /**
   * Тогтмол `public_id`. Дамжуулалтын урьдчилсан зураг шиг НЭГ байрыг дахин
   * дахин шинэчилдэг зурагт өгнө — эс тэгвэл 20 секунд тутам шинэ файл үүсч,
   * нэг цагийн лайв ~180 хог зураг үлдээдэг.
   *
   * Preset дээр "Use filename or externally defined public ID" асаагүй бол
   * Cloudinary татгалзана — тэр үед энгийн байршуулалт руу шилжинэ.
   */
  publicId?: string
): Promise<string> {
  if (!isImageUploadReady()) {
    throw new UploadError("Зураг байршуулах тохиргоо хийгдээгүй байна")
  }
  if (!ALLOWED.includes(file.type)) {
    throw new UploadError("Зөвхөн JPG, PNG, WEBP, GIF зураг оруулна уу")
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("Зургийн хэмжээ 5MB-аас бага байх ёстой")
  }

  const form = new FormData()
  form.append("file", file)
  form.append("upload_preset", UPLOAD_PRESET!)
  if (publicId && overwriteSupported) {
    form.append("public_id", publicId)
    form.append("overwrite", "true")
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  )
  const body = await res.json().catch(() => null)

  if (!res.ok || !body?.secure_url) {
    // Preset нь гаднаас өгсөн `public_id`-г хориглодог бол дахин оролдохгүй:
    // тэмдэглээд энгийн байршуулалтаар нэг удаа давтана. Зөвхөн 400 үед —
    // сүлжээ/серверийн түр зуурын алдаанд боломжийг бүрмөсөн унтраахгүй.
    if (publicId && overwriteSupported && res.status === 400) {
      overwriteSupported = false
      return uploadImage(file)
    }
    throw new UploadError(
      body?.error?.message ?? "Зураг байршуулж чадсангүй"
    )
  }

  return body.secure_url as string
}
