import type { Stream, Category } from "@/types/stream"

export const CATEGORIES: Category[] = [
  { slug: "for-you", name: "Танд зориулсан", icon: "sparkles" },
  { slug: "followed", name: "Дагаж буй хостууд", icon: "users" },
  { slug: "womens-contemporary", name: "Эмэгтэй орчин үеийн", icon: "shirt" },
  { slug: "estate-sales", name: "Өв хөрөнгийн худалдаа", icon: "home" },
  { slug: "mens-vintage", name: "Эрэгтэй винтаж хувцас", icon: "shirt" },
  { slug: "vintage-decor", name: "Винтаж чимэглэл", icon: "armchair" },
  { slug: "baby-kids", name: "Нялх ба хүүхэд", icon: "baby" },
  { slug: "mens-modern", name: "Эрэгтэй орчин үеийн", icon: "watch" },
  { slug: "womens-vintage", name: "Эмэгтэй винтаж хувцас", icon: "gem" },
]

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`

export const MOCK_STREAMS: Stream[] = [
  {
    id: "s1",
    title: "Дундад зууны шил",
    description:
      "Долоо хоногийн өв хөрөнгийн худалдаанаас онцгой олдвор. Ховор эд.",
    thumbnailUrl: img("glass1"),
    seller: { username: "kbjarzglassnmore" },
    categorySlug: "vintage-decor",
    badge: "sponsored",
    status: { kind: "live", viewers: 2 },
  },
  {
    id: "s2",
    title: "70-аад оны сэргэлт",
    description: "Гэрийн орчноо амьдруулах гоё олдворууд.",
    thumbnailUrl: img("retro1"),
    seller: { username: "amyperrin" },
    categorySlug: "vintage-decor",
    status: { kind: "live", viewers: 15 },
  },
  {
    id: "s3",
    title: "Сийлбэрт эрдэнэс",
    description: "Орчин үеийн гэрт тохирох модон онцгой чимэглэл.",
    thumbnailUrl: img("wood1"),
    seller: { username: "thewittleshop" },
    categorySlug: "vintage-decor",
    status: { kind: "live", viewers: 19 },
  },
  {
    id: "s4",
    title: "Бохо тавилга",
    description: "Тухтай орчинд тохирох сандал, жижиг ширээ.",
    thumbnailUrl: img("boho1"),
    seller: { username: "mysunroomchair" },
    categorySlug: "vintage-decor",
    status: { kind: "live", viewers: 3 },
  },
  {
    id: "s5",
    title: "Гууль ба гоо",
    description: "Хүнд металл, нарийн чимэглэл — тансаг байдал нэмнэ.",
    thumbnailUrl: img("brass1"),
    seller: { username: "missa_rissa3" },
    categorySlug: "vintage-decor",
    status: { kind: "live", viewers: 6 },
  },
  {
    id: "s6",
    title: "Шаазан мөрөөдөл",
    description: "Цэцгийн хээтэй нарийн шаазангийн цуглуулга.",
    thumbnailUrl: img("porcelain1"),
    seller: { username: "mysticroseantiques" },
    categorySlug: "vintage-decor",
    status: { kind: "scheduled", startsAt: "Өнөөдөр 15:15", savedCount: 41 },
  },
  {
    id: "s7",
    title: "Том өв хөрөнгийн худалдаа",
    description: "Бүх зүйл зарагдана! Гайхалтай байдалтай ховор эдлэл.",
    thumbnailUrl: img("estate1"),
    seller: { username: "dirtyrichesauctions" },
    categorySlug: "estate-sales",
    badge: "estate_sales",
    status: { kind: "scheduled", startsAt: "Өнөөдөр 16:00", savedCount: 26 },
  },
  {
    id: "s8",
    title: "Далайн сэдэв",
    description: "Далайн амьсгалыг гэртээ авчрах чимэглэлүүд.",
    thumbnailUrl: img("nautical1"),
    seller: { username: "kellys_lighthouse" },
    categorySlug: "vintage-decor",
    status: { kind: "scheduled", startsAt: "Өнөөдөр 16:00", savedCount: 13 },
  },
]
import type { UserProfile, FollowedSeller } from "@/types/user"

export const MOCK_USER: UserProfile = {
  username: "junglefinds",
  memberSince: "2022 оны 3-р сар",
  followingCount: 3,
  purchasesCount: 5,
  savedShowsCount: 4,
}

export const MOCK_FOLLOWED: FollowedSeller[] = [
  { id: "s2", username: "amyperrin", tagline: "Винтаж чимэглэл" },
  {
    id: "s3",
    username: "thewittleshop",
    tagline: "Шууд дамжуулж байна · Модон эдлэл",
    isLive: true,
  },
  { id: "s5", username: "missa_rissa3", tagline: "Гууль ба гоо" },
]
