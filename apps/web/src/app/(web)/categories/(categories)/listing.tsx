import { CategoryList } from "~/components/web/categories/category-list"
import { findCategories } from "~/server/web/categories/queries"

export const CategoryListing = async () => {
  const categories = await findCategories({})

  return <CategoryList categories={categories} />
}
