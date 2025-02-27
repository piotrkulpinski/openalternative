import type { ComponentProps } from "react"
import { CategoryCard, CategoryCardSkeleton } from "~/components/web/categories/category-card"
import { EmptyList } from "~/components/web/empty-list"
import { Grid } from "~/components/web/ui/grid"
import type { CategoryMany } from "~/server/web/categories/payloads"
import { cx } from "~/utils/cva"

type CategoryListProps = ComponentProps<typeof Grid> & {
  categories: CategoryMany[]
}

const CategoryList = ({ categories, className, ...props }: CategoryListProps) => {
  return (
    <Grid className={cx("md:gap-8", className)} {...props}>
      {categories.map(category => (
        <CategoryCard key={category.slug} category={category} />
      ))}

      {!categories.length && <EmptyList>No categories found.</EmptyList>}
    </Grid>
  )
}

const CategoryListSkeleton = () => {
  return (
    <Grid className="md:gap-8">
      {[...Array(24)].map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { CategoryList, CategoryListSkeleton }
