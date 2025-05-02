import { CategoryList } from "~/components/web/categories/category-list"
import { findRootCategories } from "~/server/web/categories/queries"

export const CategoryListing = async () => {
  const categories = await findRootCategories({})

  return <CategoryList categories={categories} />
}
