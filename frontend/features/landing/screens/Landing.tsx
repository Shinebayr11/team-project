"use client"

/**
 * "/" дээрх нэвтрээгүй хүнд зориулсан marketing хуудас.
 *
 * Зургаан section нь доош гүйлгэх явцад хуудсын дэвсгэр өнгийг тасралтгүй
 * шилжүүлнэ (`BackgroundMorph`). Хуудас бүхэлдээ статик — өгөгдөл татдаггүй,
 * auth төлөвөөр салаалдаггүй. Ганц зорилго нь "Үнэгүй бүртгүүлэх" эсвэл
 * "Худалдагч болох" руу оруулах.
 */

import { AuctionSection } from "../components/AuctionSection"
import { BackgroundMorph } from "../components/BackgroundMorph"
import { CategoriesSection } from "../components/CategoriesSection"
import { CtaSection } from "../components/CtaSection"
import { HeroSection } from "../components/HeroSection"
import { MarketingHeader } from "../components/MarketingHeader"
import { ScrollProvider } from "../components/ScrollProvider"
import { SectionNavPill } from "../components/SectionNavPill"
import { SellerSection } from "../components/SellerSection"
import { WalletSection } from "../components/WalletSection"

export function Landing() {
  return (
    <ScrollProvider>
      <BackgroundMorph />
      <MarketingHeader />
      <main>
        <HeroSection />
        <AuctionSection />
        <WalletSection />
        <SellerSection />
        <CategoriesSection />
        <CtaSection />
      </main>
      <SectionNavPill />
    </ScrollProvider>
  )
}
