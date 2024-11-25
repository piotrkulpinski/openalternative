"use client"

import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { CategoryCard, CategoryCardSkeleton } from "~/components/web/categories/category-card"
import { EmptyList } from "~/components/web/empty-list"
import { Grid } from "~/components/web/ui/grid"
import type { CategoryMany } from "~/server/categories/payloads"
import { cx } from "~/utils/cva"

type CategoryListProps = ComponentProps<typeof Grid> & {
  categories: CategoryMany[]
}

const CategoryList = ({ categories, className, ...props }: CategoryListProps) => {
  return (
    <Grid className={cx("md:gap-8", className)} {...props}>
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}

      {!categories.length && <EmptyList>No categories found.</EmptyList>}
    </Grid>
  )
}

const CategoryListSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Box className="px-4 py-2.5 text-sm/normal rounded-lg w-full">
        <span>&nbsp;</span>
      </Box>

      <Grid>
        {[...Array(6)].map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </Grid>
    </div>
  )
}

export { CategoryList, CategoryListSkeleton }
