"use client"

import * as React from "react"

import { Sheet, SheetBody, SheetHeader } from "@/components/ui/sheet"
import {
  PLATFORM_RULES,
  SELLER_CONTRACT,
  SELLER_TERMS_VERSION,
  type ContractSection,
} from "@/components/seller/sellerContract"

export type ContractDoc = "terms" | "rules"

const DOCS: Record<
  ContractDoc,
  { title: string; subtitle: string; sections: ContractSection[] }
> = {
  terms: {
    title: "Худалдагчийн гэрээ",
    subtitle: `Хувилбар ${SELLER_TERMS_VERSION}`,
    sections: SELLER_CONTRACT,
  },
  rules: {
    title: "Платформын дүрэм",
    subtitle: "Шууд дамжуулалт, дуудлага худалдаа, харилцаа",
    sections: PLATFORM_RULES,
  },
}

export const ContractSections: React.FC<{ sections: ContractSection[] }> = ({
  sections,
}) => (
  <div className="flex flex-col gap-5">
    {sections.map((section) => (
      <section key={section.heading} className="flex flex-col gap-1.5">
        <h3 className="text-[14px] font-[800] text-[var(--wn-ink)]">
          {section.heading}
        </h3>
        {section.body.map((paragraph) => (
          <p
            key={paragraph}
            className="text-[13.5px] leading-relaxed text-[var(--wn-ink-2)]"
          >
            {paragraph}
          </p>
        ))}
      </section>
    ))}
  </div>
)

/**
 * Гэрээ/дүрмийг идэвхжүүлэх хуудасны ДЭЭР давхарлан нээнэ. Ар талын хуудас
 * хаагдахгүй тул бөглөсөн утга бүрэн хэвээр үлдэнэ.
 */
export const SellerContractDrawer: React.FC<{
  doc: ContractDoc | null
  onClose: () => void
}> = ({ doc, onClose }) => {
  // Хаах анимац дуустал агуулга нь алга болохгүйн тулд сүүлчийн баримтыг санана.
  // Render үед тохируулж байгаа тул нэмэлт эргэлт үүсгэхгүй (React-ийн зөвлөсөн
  // "adjusting state during render" загвар).
  const [lastDoc, setLastDoc] = React.useState<ContractDoc>("terms")
  if (doc && doc !== lastDoc) setLastDoc(doc)

  const { title, subtitle, sections } = DOCS[doc ?? lastDoc]

  return (
    <Sheet
      nested
      wide
      open={doc !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetHeader title={title} subtitle={subtitle} />
      <SheetBody className="pb-8">
        <ContractSections sections={sections} />
      </SheetBody>
    </Sheet>
  )
}
