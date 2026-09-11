"use client"

/**
 * "/" дээрх нэвтрээгүй хүнд зориулсан marketing хуудас.
 *
 * Таван section нь доош гүйлгэх явцад хуудсын дэвсгэр өнгийг тасралтгүй
 * шилжүүлнэ (`BackgroundMorph`). Хуудас бүхэлдээ статик — өгөгдөл татдаггүй,
 * auth төлөвөөр салаалдаггүй. Ганц зорилго нь "Бүртгүүлэх" эсвэл
 * "Худалдагч болох" руу оруулах.
 */

import { AuctionSection } from "../components/AuctionSection"
import { BackgroundMorph } from "../components/BackgroundMorph"
import { CtaSection } from "../components/CtaSection"
import { HeroSection } from "../components/HeroSection"
import { MarketingHeader } from "../components/MarketingHeader"
import { ScrollProvider } from "../components/ScrollProvider"
import { SectionNavPill } from "../components/SectionNavPill"
import { SellerSection } from "../components/SellerSection"
import { ShopSection } from "../components/ShopSection"

export function Landing() {
  return (
    <ScrollProvider>
      <BackgroundMorph />
      <MarketingHeader />
      <main>
        <HeroSection />
        <AuctionSection />
        <SellerSection />
        <ShopSection />
        <CtaSection />
      </main>
      <SectionNavPill />
    </ScrollProvider>
  )
}
