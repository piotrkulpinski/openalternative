import type { Category } from "@openalternative/db/client"
import { getCategoryAncestors } from "~/server/web/categories/queries"

export const getCategoryPath = async (category: Pick<Category, "slug" | "parentId">) => {
  if (!category.parentId) {
    return category.slug
  }

  const categoryAncestors = await getCategoryAncestors(category.slug)

  return categoryAncestors.join("/")
}
