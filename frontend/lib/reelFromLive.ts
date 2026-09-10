import { HomeShow, ReelShow } from "@/types"
import { getWatchPath } from "@/lib/liveShows"

/** Аватарын дэвсгэрийг нэрнээс тогтвортой сонгоно — дахин ачаалахад өөрчлөгдөхгүй. */
const TINTS = ["#E6E2F8", "#E4EAF0", "#EDE9E2", "#F0E8E8", "#E8F0EA"]

const tintOf = (key: string) => {
  let sum = 0
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i)
  return TINTS[sum % TINTS.length]
}

/**
 * Жинхэнэ шууд дамжуулалтыг reel-ийн мөр болгоно.
 *
 * Reel нь `data/reelShows.ts` дэх жишээ өгөгдлөөр бүтдэг бөгөөд бараа, чат,
 * дуудлага худалдаа нь тэр дотроо хатуу бичигдсэн байдаг. Жинхэнэ эфирт тийм
 * зүйл байхгүй — түүний бараа, чат, дуудлага худалдаа нь `/live/<room>` дээр
 * бодитоор явж байдаг. Тиймээс энд зөвхөн ХАВТАС нь (нэр, худалдагч, зураг,
 * үзэгчийн тоо) орж, `watchPath` нь дарахад тэр рүү аваачна.
 */
export const toReelShow = (show: HomeShow): ReelShow => {
  const seller = show.seller || "Худалдагч"

  return {
    slug: show.roomId || show.showId || seller,
    seller,
    initial: seller.charAt(0).toUpperCase(),
    avatarBg: tintOf(seller),
    title: show.title,
    cat1: show.category || "Шууд",
    cat2: show.tags || "",
    // Жинхэнэ үнэлгээ, дагагчийн тоо энэ endpoint-оос ирдэггүй тул зохиомол
    // тоо БИЧИХГҮЙ — хоосон мөр нь UI дээр зүгээр л харагдахгүй.
    rating: "",
    reviews: "",
    followers: "",
    viewers: show.live ?? 0,
    thumbnail: show.thumbnail,
    // Room-гүй эфир (өгөгдлийн сан дахь жишээ мөр) руу очих газар байхгүй —
    // `getWatchPath` тийм үед `/live-show` рүү буцаадаг тул өөр рүүгээ
    // чиглэсэн товч үүснэ. Тэр тохиолдолд замгүй үлдээнэ.
    watchPath: show.roomId ? getWatchPath(show) : undefined,
    item: {
      name: show.title,
      mode: "watch",
      price: "",
      next: "",
      seconds: 0,
      subline: "Яг одоо шууд явж байна",
    },
    products: { buynow: [], giveaways: [], sold: [] },
    chat: [],
  }
}
