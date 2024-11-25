import type { Prisma } from "@prisma/client"
import { CategoryList } from "~/components/web/categories/category-list"
import { findCategories } from "~/server/categories/queries"

type CategoryListingProps = {
  where?: Prisma.CategoryWhereInput
}

export const CategoryListing = async ({ where }: CategoryListingProps) => {
  const categories = await findCategories({ where })

  return <CategoryList categories={categories} />
}
