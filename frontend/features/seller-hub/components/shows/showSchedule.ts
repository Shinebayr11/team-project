import { SellerShow } from "@/features/seller-hub/types"

/**
 * Товлолтын цагийн туслахууд.
 *
 * `datetime-local` нь ОРОН НУТГИЙН цагийг `YYYY-MM-DDTHH:mm` хэлбэрээр хүлээж
 * авдаг. Өмнө нь энд `toISOString().slice(0, 16)` бичигдсэн байсан нь UTC руу
 * хөрвүүлээд хэрчдэг тул Улаанбаатарт (UTC+8) талбар нь орон нутгийн цагаас 8
 * цаг хоцорсон утга «орон нутгийн цаг» нэрийн дор харуулдаг байв.
 */
const pad = (n: number) => String(n).padStart(2, "0")

export const toLocalInput = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`

/** «9-р сарын 10 · 20:00» — худалдан авагчийн карт дээрх богино хэлбэр. */
export const shortWhen = (date: Date) =>
  `${date.getMonth() + 1}-р сарын ${date.getDate()} · ${pad(date.getHours())}:${pad(date.getMinutes())}`

const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"]

/** «Мягмар гараг · 9-р сарын 15 · 20:00» */
export const humanWhen = (date: Date) =>
  `${WEEKDAYS[date.getDay()]} гараг · ${date.getMonth() + 1}-р сарын ${date.getDate()} · ${pad(date.getHours())}:${pad(date.getMinutes())}`

const startOfDay = (time: number) => {
  const date = new Date(time)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

/**
 * «Маргааш», «3 цагийн дараа», «6 хоногийн дараа». Өнгөрсөн үе нь null —
 * дуудагч тал үүнийг алдаа болгож харуулна.
 *
 * Хоёр хэмжүүр: ойрхон бол ЦАГААР, хол бол ХУАНЛИЙН ӨДРӨӨР.
 *
 * Зөвхөн цагаар тоолвол «Маргааш 20:00» нь (өглөө 02:00-оос 42 цаг) «2 хоногийн
 * дараа» болно — хүн 42 цаг гэж боддоггүй, маргааш орой гэж боддог. Харин
 * зөвхөн хуанлиар тоолвол 23:30-д товлосон 00:30 нь «Маргааш» болох ч бодит
 * байдал дээр ердөө нэг цагийн дараа. 12 цаг нь хоёрын хил.
 */
export const untilLabel = (date: Date, now = Date.now()): string | null => {
  const ms = date.getTime() - now
  if (ms <= 0) return null

  const minutes = Math.round(ms / 60_000)
  if (minutes < 60) return `${minutes} минутын дараа`

  const hours = Math.round(minutes / 60)
  const days = Math.round((startOfDay(date.getTime()) - startOfDay(now)) / 86_400_000)

  if (hours < 12 || days === 0) return `${hours} цагийн дараа`
  if (days === 1) return "Маргааш"
  if (days < 7) return `${days} хоногийн дараа`

  return `${Math.round(days / 7)} долоо хоногийн дараа`
}

/** Тухайн өдрийн өгсөн цаг. `addDays` нь өнөөдрөөс хойших өдрийн тоо. */
const at = (hour: number, addDays = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + addDays)
  date.setHours(hour, 0, 0, 0)
  return date
}

/**
 * Түргэн сонголтууд. Худалдагчид голдуу оройн ижил цагт эфирт ордог тул
 * товлолтын 90%-ийг гурван товчоор шийднэ. Өнгөрсөн болсон сонголт
 * ЖАГСААЛТАД ОРОХГҮЙ — өнөө орой 20:00 нь 21 цагт утгагүй.
 */
const EVENING = 20

export const schedulePresets = (): { label: string; value: Date }[] => {
  const daysToSaturday = (6 - new Date().getDay() + 7) % 7 || 7

  return [
    { label: `Өнөө орой ${EVENING}:00`, value: at(EVENING) },
    { label: `Маргааш ${EVENING}:00`, value: at(EVENING, 1) },
    { label: `Бямба ${EVENING}:00`, value: at(EVENING, daysToSaturday) },
  ].filter((preset) => preset.value.getTime() > Date.now())
}

/**
 * Маягтын анхны цаг. Өмнө нь `new Date()` буюу ОДОО байсан тул анхны утга нь
 * илгээх үед аль хэдийн өнгөрсөн байдаг байв — товлолт гэдэг нь ирээдүйн
 * цаг тул хамгийн ойрын утга учиртай сонголт болно.
 */
export const defaultScheduledAt = () => schedulePresets()[0]?.value ?? at(EVENING, 1)

export const SHOW_TYPES: { value: SellerShow["type"]; label: string; hint: string }[] = [
  {
    value: "mixed",
    label: "Хосолсон",
    hint: "Дуудлага худалдаа ба шууд худалдах хоёулаа",
  },
  { value: "auction", label: "Дуудлага худалдаа", hint: "Лот бүр үнийн саналаар зарагдана" },
  { value: "buy_it_now", label: "Шууд худалдах", hint: "Тогтсон үнээр шууд авна" },
]
