"use client"

import { use, useState } from "react"
import { CategorySidebar } from "@/components/layout/category-sidebar"
import {
  CategoryHeader,
  type SortOption,
} from "@/components/browse/category-header"
import { StreamGrid } from "@/components/browse/stream-grid"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { CATEGORIES, MOCK_STREAMS } from "@/lib/mock-data"

export default function BrowseCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: slug } = use(params)
  const [sort, setSort] = useState<SortOption>("popular")

  const category = CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[5]
  const shown = MOCK_STREAMS.filter((s) => s.categorySlug === category.slug)

  return (
    <div className="flex">
      <CategorySidebar categories={CATEGORIES} activeSlug={category.slug} />

      <main className="min-w-0 flex-1 px-8 py-6">
        <CategoryHeader
          name={category.name}
          sort={sort}
          onSortChange={setSort}
        />

        <StreamGrid streams={shown} />

        {shown.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline">
              Илүү олон шоу
              <ChevronDown className="ml-2 size-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
