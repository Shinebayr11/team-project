"use client"

import { RefObject, useEffect, useRef } from "react"

import { useApiClient } from "@/hooks/useApiClient"
import { isImageUploadReady, uploadImage } from "@/lib/cloudinary"

/**
 * Хоёр байршуулалтын хоорондох завсар.
 *
 * Богиносгох тусам нүүрэн дэх зураг шинэлэг болох ч Cloudinary руу илгээх
 * файлын тоо шууд өснө (1 цагийн дамжуулалт ≈ 3600 / энэ утга). 20 секунд нь
 * "саяхны дүр зураг" мэдрэмжийг өгөхүйц шинэлэг, гэхдээ нэг цагт ~180 зурагт
 * багтах тэнцвэр.
 */
const SNAPSHOT_INTERVAL_MS = 20_000

/** Камер асаад тогтворжих хүртэл хүлээх хугацаа — эхний кадр хар байдаг. */
const FIRST_SNAPSHOT_DELAY_MS = 3_000

/** Картууд хамгийн ихдээ ~360px өндөртэй тул үүнээс том зураг утгагүй. */
const SNAPSHOT_WIDTH = 640
const JPEG_QUALITY = 0.7

/**
 * Худалдагчийн камерын нэг кадрыг тогтмол авч, дамжуулалтын `thumbnail_url` болгоно.
 *
 * Ингэснээр нүүрний том карт (`FeaturedShow`) болон бүх `ShowCard` дээр яг тэр
 * үед юу болж байгаа нь харагдана — үзэгч бүрийг LiveKit өрөөнд холбож,
 * үзэгчийн тоог гажуудуулахгүйгээр.
 *
 * Зөвхөн ХУДАЛДАГЧИЙН хөтөч дээр ажиллана: дамжуулж буй хүн нэг л удаа зураг
 * авч, бусад нь бэлэн хаягийг л уншина.
 */
export function useLiveThumbnail(
  videoRef: RefObject<HTMLVideoElement | null>,
  showId: string | undefined,
  enabled: boolean
) {
  const { callApi } = useApiClient()
  // Сүлжээ удаан үед өмнөх байршуулалт дуусаагүй байхад дараагийнх эхлэхээс
  // сэргийлнэ — эс тэгвэл давхарлаад Cloudinary руу дэмий ачаалал өгнө.
  const busy = useRef(false)

  useEffect(() => {
    if (!enabled || !showId || !isImageUploadReady()) return

    const capture = async () => {
      const video = videoRef.current
      // `readyState < 2` — кадр хараахан ирээгүй, зурвал хоосон canvas гарна.
      if (busy.current || !video || video.readyState < 2) return

      const sourceWidth = video.videoWidth
      const sourceHeight = video.videoHeight
      if (!sourceWidth || !sourceHeight) return

      busy.current = true
      try {
        const width = Math.min(SNAPSHOT_WIDTH, sourceWidth)
        const height = Math.round((sourceHeight / sourceWidth) * width)

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // `VideoTrack`-ийн `scaleX(-1)` нь зөвхөн CSS — canvas түүхий кадрыг
        // зурдаг тул үзэгчид толин тусгалгүй, зөв талаараа харагдана.
        ctx.drawImage(video, 0, 0, width, height)

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
        )
        if (!blob) return

        // Дамжуулалт бүр Cloudinary дээр ГАНЦ файлтай: 20 секунд тутам түүнийг дарж
        // бичнэ. Өмнө нь дуудалт бүрд шинэ файл үүсэж, устгагддаггүй байв.
        const url = await uploadImage(
          new File([blob], `live-${showId}.jpg`, { type: "image/jpeg" }),
          `live-shows/${showId}`
        )

        await callApi(`/api/liveshow/${showId}`, {
          method: "PATCH",
          body: JSON.stringify({ thumbnail_url: url }),
        })
      } catch (error) {
        // Урьдчилсан зураг бол чимэглэл — амжилтгүй болсон нь дамжуулалтад
        // огт нөлөөлөхгүй тул зогсоохгүй, зөвхөн бүртгэнэ.
        console.error("Thumbnail snapshot failed:", error)
      } finally {
        busy.current = false
      }
    }

    const first = setTimeout(capture, FIRST_SNAPSHOT_DELAY_MS)
    const timer = setInterval(capture, SNAPSHOT_INTERVAL_MS)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [enabled, showId, callApi, videoRef])
}
