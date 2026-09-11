// Худалдан авагчийн талын анхны (demo) төлөв. Зурвасны жагсаалт дээр шууд
// харагддаг тул текст нь монголоор.
export const SEED_FOLLOWING = {
  amyperrin: true, thewittleshop: true, mysticroseantiques: true,
  dirtyrichesauctions: true, kellys_lighthouse: true,
};

export const SEED_THREADS = [
  {
    slug: "amyperrin", initial: "A", tint: "#E6E2F8", unread: 1,
    messages: [
      { from: "them" as const, text: "Сайн байна уу! Дагасанд баярлалаа — товгор хээтэй ваар өнөө орой 20 цагт гарна.", at: "Өчигдөр" },
      { from: "me" as const, text: "Сайн байна, заавал орно. 8 инчийнх мөн үү?", at: "Өчигдөр" },
      { from: "them" as const, text: "Тийм ээ. Шинэ шиг, огт цуурсан газаргүй.", at: "10:12" },
    ],
  },
  {
    slug: "thewittleshop", initial: "T", tint: "#E4EAF0", unread: 0,
    messages: [
      { from: "me" as const, text: "Хоёр шууд дамжуулалтын барааг нэг хүргэлтэд нэгтгэдэг үү?", at: "Дав" },
      { from: "them" as const, text: "Үргэлж тэгдэг — нэг долоо хоногт хожсон бүх бараа хамт явна.", at: "Дав" },
    ],
  },
  {
    slug: "mysticroseantiques", initial: "M", tint: "#F0E8E8", unread: 2,
    messages: [
      { from: "them" as const, text: "Таны хээтэй аягыг савласан, маргааш явуулна.", at: "Мяг" },
      { from: "them" as const, text: "Хүргэлтийн код өнөө орой и-мэйлээр очно.", at: "Мяг" },
    ],
  },
  {
    slug: "dirtyrichesauctions", initial: "D", tint: "#EDE9E2", unread: 0,
    messages: [
      { from: "me" as const, text: "Мөнгөн иж бүрдлийн жин эцэстээ хэд болсон бэ?", at: "7-р сарын 30" },
      { from: "them" as const, text: "1400 гаруй грамм. Нэхэмжлэх захиалгын жагсаалтад чинь байгаа.", at: "7-р сарын 30" },
    ],
  },
];

